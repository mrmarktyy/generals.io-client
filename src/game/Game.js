import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import PubSub from 'pubsub-js';

import './game.css'
import config from '../util/Config';
import ScrollHandler from '../util/ScrollHandler';
import patch from '../util/Patch';
import Modal from '../util/Modal';
import Map from './Map';
import Scroll from './Scroll';
import Leaderboard from './Leaderboard';
import Turn from './Turn';
import Resign from './Resign';
import Zoom from './Zoom';
import Chat from './Chat';

class Game extends Component {
  constructor(props) {
    super(props);

    this.user = props.user;
    this.connector = props.connector;
    this.unbind = this.connector.bind('onmessage', this.onmessage.bind(this));

    this.state = this.getInitialState();
    this._handleKeydown = this.handleKeydown.bind(this);
    this._updateState = this.updateState.bind(this);
    this.scrollHandler = new ScrollHandler(this._updateState);
  }

  getInitialState() {
    return {
      position: {x: 0, y: 0},
      id: null,
      mode: null,
      type: this.props.type,
      player_index: this.props.playerIndex,
      is50: null,
      flags: [],
      map: [],
      cities: [],
      generals: [],
      tiles: [],
      attackable: [],
      leaderboard: [],
      afks: [],
      deads: [],
      actions: [],
      selected: null,
      width: 0,
      height: 0,
      size: 0,
      turn: 0,
      counter: 0,
      lost: null,
      won: null,
      resign: false,
      resigned: false
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this._handleKeydown);
    window.addEventListener('beforeunload', this.handleUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._handleKeydown);
    window.removeEventListener('beforeunload', this.handleUnload);
    this.unbind();
  }

  handleUnload(event) {
    event.returnValue = true;
  }

  handleKeydown(event) {
    let direction;
    switch (event.keyCode) {
      case 32: // sapce
        this.map.deselect();
        break;
      case 65: // s
      case 37:
        direction = 'left';
        break;
      case 87: // w
      case 38:
        direction = 'top';
        break;
      case 68: // d
      case 39:
        direction = 'right';
        break;
      case 83: // s
      case 40:
        direction = 'bottom';
        break;
      case 69: // e
        this.undo();
        break;
      case 81: // q
        this.clear();
        break;
      case 187: // -
        this.user.incZoom();
        break;
      case 189: // +
        this.user.decZoom();
        break;
      default:
        break;
    }
    const { selected, terrain, tiles } = this.state;
    if (direction) {
      event.preventDefault();

      if (!selected) {
        return;
      }

      const targetTileIndex = selected[direction];
      if (targetTileIndex === -1 || terrain[targetTileIndex] === -2) {
        return;
      }

      const targetTile = tiles[targetTileIndex];
      if (!targetTile) {
        return;
      }

      this.move(
        this.create({from: selected.index, to: targetTileIndex}),
        targetTile
      );
    }
  }

  create({from, to}) {
    let action = {
      from,
      to,
      counter: this.state.counter
    };
    if (this.state.is50 !== null) {
      action.is50 = true;
    }
    return action;
  }

  move(action, targetTile) {
    this.state.counter++;
    this.state.actions.push(action);

    PubSub.publish('game:move', action);
    this.connector.send({
      action: 'game:move',
      payload: action
    });

    this.map.select(targetTile);
  }

  resign() {
    this.setState({resign: true});
  }

  spectate() {
    this.connector.send({action: 'game:spectate'});
    this.closeModal();
  }

  confirm() {
    this.connector.send({action: 'game:resign'});
    this.setState({resigned: true});
    this.closeModal();
  }

  closeModal() {
    this.setState({
      lost: false,
      won: false,
      resign: false
    });
  }

  toMainMenu() {
    browserHistory.push('/')
  }

  render() {
    const { mode, type, lost, won, resign } = this.state;
    let modal = null;
    if (lost || won) {
      const title = lost ? 'Lost' : 'Victory';
      const showSpectateButton = lost && mode !== '1v1';
      modal = (
        <Modal className="game-end-modal"
          clickOutsideToClose={false} title={title}>
          {lost && <p className="modal-message">你被玩家 {lost} 击败了。</p>}
          {showSpectateButton && <div><div className="btn inverted" onClick={this.spectate.bind(this)}></div></div>}
          <div><div className="btn inverted" onClick={this.toMainMenu}>Exit</div></div>
        </Modal>
      );
    } else if (resign) {
      modal = (
        <Modal className="game-resign-modal"
          onClose={this.closeModal.bind(this)} title="Resign">
          <p className="modal-message">Are you sure to resign？</p>
          <div className="modal-footer">
            <div className="btn warning" onClick={this.confirm.bind(this)}>Ok</div>
            <div className="btn inverted" onClick={this.closeModal.bind(this)}>Cancel</div>
          </div>
        </Modal>
      );
    }
    return (
      <div id="game">
        {modal}
        <Scroll scroll={this.scrollHandler} />
        <Map ref={map => this.map = map} scroll={this.scrollHandler} state={this.state}
          connector={this.connector} move={this.move.bind(this)} create={this.create.bind(this)}
          updateGameState={this._updateState} />
        <Turn state={this.state} />
        <Resign state={this.state} resign={this.resign.bind(this)} />
        <Zoom state={this.state} user={this.user} />
        <Leaderboard state={this.state} />
        {type === 'match' && <Chat connector={this.connector} id={this.state.id} />}
        {this.props.children}
      </div>
    );
  }

  undo() {
    let action = this.state.actions.pop();
    if (action) {
      this.map.select(this.state.tiles[action.from]);
      this.state.counter--;
    }
    this.connector.send({action: 'game:undo_move'});
  }

  clear() {
    this.connector.send({action: 'game:clear_move'});
  }

  updateState(state) {
    this.setState({...state});
  }

  onmessage({type, payload}) {
    switch (type) {
      case 'game:start': {
        const { id, mode, map, cities, generals } = payload;
        const width = map[0];
        const height = map[1];
        this.setState({
          id,
          mode,
          map,
          cities,
          generals,
          width,
          height,
          size: width * height
        });
        for (let i = 0; i < width; i++) {
          for (let j = 0; j < height; j++) {
            const tile = {x: j, y: i};
            tile.index = this.convertToIndex(tile.x, tile.y);
            tile.top = tile.y === 0 ? -1 : this.convertToIndex(tile.x, tile.y - 1);
            tile.right = (tile.x === width - 1) ? -1 : this.convertToIndex(tile.x + 1, tile.y);
            tile.bottom = (tile.y === height - 1) ? -1 : this.convertToIndex(tile.x, tile.y + 1);
            tile.left = tile.x === 0 ? -1 : this.convertToIndex(tile.x - 1, tile.y);
            if (generals.indexOf(tile.index) >= 0) {
              this.autoCenter(tile);
            }
            this.state.tiles.push(tile);
          }
        }
        PubSub.publish('game:start');
        break;
      }
      case 'game:update': {
        const { turn, generals, counter, cities_diff, map_diff } = payload;
        const cities = patch(this.state.cities, cities_diff)
          .concat(this.state.afks.map(afk => afk.index))
          .concat(this.state.deads.map(dead => dead.index));
        const map = patch(this.state.map, map_diff);
        const army = map.slice(2, this.state.size + 2);
        const terrain = map.slice(2 + this.state.size, 2 + 2 * this.state.size);
        const actions = this.state.actions.filter(action => action.counter > counter);
        this.setState({
          turn,
          map,
          cities,
          generals,
          actions,
          army,
          terrain
        });
        PubSub.publish('game:update', terrain);
        break;
      }
      case 'game:leaderboard':
        if (payload.id !== this.state.id) {
          return;
        }
        this.setState({leaderboard: payload.lb});
        break;
      case 'game:lost':
        if (payload.playerIndex === this.state.player_index) {
          this.setState({lost: payload.name});
        }
        this.setState({deads: [...this.state.deads, payload]});
        break;
      case 'game:win':
        this.setState({won: true});
        PubSub.publish('game:win');
        break;
      case 'game:afk':
        this.setState({afks: [...this.state.afks, payload]});
        break;
      case 'game:flag':
        this.map.flag(payload);
        break;
      default:
        break;
    }
  }

  autoCenter(tile) {
    if (!config.mobile) {
      return;
    }
    const base = 30 + (+this.user.zoom * 10);
    const x = window.innerWidth / 2 - base * (tile.x + 0.5);
    const y = window.innerHeight / 2 - base * (tile.y + 0.5);
    this.scrollHandler.setPosition({x, y});
  }

  convertToIndex(x, y) {
    return x + y * this.state.width;
  }
}

export default Game;
