import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './replay.css';

import config from '../util/Config';
import Game from '../game/Game';
import ReplayBottom from './ReplayBottom';
import ReplayLeft from './ReplayLeft';
import Modal from '../util/Modal';
import patch from '../util/Patch';

class Replay extends Component {
  constructor(props) {
    super(props);
    this.connector = props.route.connector;
    this.user = props.route.user;
    this.id = props.params.id;
    this.replayUrl = `${config.API}/game/generals/replay/${this.id}`;

    this.state = {
      loaded: false,
      errored: false,
      tick: 0,
      autoPlay: false,
      autoPlayTimeouts: [50, 100, 250, 500, 1000],
      autoPlayTimeoutPtr: 3,
      autoPlayTimer: null,
      modal: false,
      checked: false,
      turn: 0
    };

    this._handleKeydown = this.handleKeydown.bind(this);
  }

  fetch() {
    fetch(this.replayUrl)
      .then(response => response.json())
      .then(response => {
        if (response.result && response.result.content) {
          this.replay = JSON.parse(response.result.content);
          this.setState({loaded: true});
          this.init();
        } else {
          this.setState({errored: true});
        }
      }).catch(error => {
        console.error(error);
        this.setState({errored: true});
      });
  }

  componentWillMount() {
    window.addEventListener('keydown', this._handleKeydown);
    this.fetch();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._handleKeydown);
  }

  init() {
    const { mapWidth, mapHeight, cities, generals, swords = [], eyes = [], shields = [], afks } = this.replay;
    const { t } = this.props.location.query;
    const tick = t * 2 || 0;
    this.replay.history = this.repair(this.replay.history);
    this.setState({tick});
    this.game.setState({
      id: this.id,
      width: mapWidth,
      height: mapHeight,
      cities,
      generals,
      swords,
      eyes,
      shields,
      afks
    });
    this.load({tick});
  }

  repair(history) {
    let oldArmy = [];
    let oldTerrain = [];
    return history.map(state => {
      const army = patch(oldArmy, state.army);
      const terrain = patch(oldTerrain, state.terrain);
      oldArmy = army;
      oldTerrain = terrain;
      return {
        tick: state.tick,
        army,
        terrain
      };
    });
  }

  prev() {
    let { tick } = this.state;
    tick--;
    if (tick < 0) {
      tick = 0;
    }
    this.setState({tick});
    this.load({tick});
  }

  next() {
    let { tick } = this.state;
    tick++;
    const { ticks } = this.replay;
    if (tick > ticks) {
      tick = ticks;
    }
    this.setState({tick});
    this.load({tick});
  }

  jump(turn) {
    const { ticks } = this.replay;
    let tick = turn * 2;
    if (tick < 0) tick = 0;
    if (tick >= ticks) tick = ticks;

    this.setState({tick});
    this.load({tick});
  }

  load({tick}) {
    let cities = this.replay.cities.slice(0);
    const { generals, history, players } = this.replay;
    const { army, terrain } = history[tick];
    const leaderboard = this.leaderboard(players, army, terrain);
    const afks = this.replay.afks
      .filter(afk => tick >= afk.tick)
      .map(afk => {
        cities.push(generals[afk.playerIndex]);
        return {playerIndex: afk.playerIndex};
      });
    const deads = leaderboard
      .filter(player => player.land === 0)
      .map(player => {
        cities.push(generals[player.playerIndex]);
        return  {playerIndex: player.playerIndex}
      });
    this.game.setState({
      turn: ~~(tick / 2),
      army: army,
      terrain: terrain,
      cities: cities,
      leaderboard,
      afks,
      deads
    });
  }

  toggle() {
    const autoPlay = !this.state.autoPlay;
    this.setState({autoPlay});
    if (autoPlay) {
      this.play();
    } else {
      clearTimeout(this.state.autoPlayTimer);
    }
  }

  play() {
    const { ticks } = this.replay;
    if (this.state.tick >= ticks) {
      this.toggle();
      return;
    }

    this.next();
    const { autoPlayTimeouts, autoPlayTimeoutPtr } = this.state;
    const autoPlayTimer = setTimeout(() => {
      this.play();
    }, autoPlayTimeouts[autoPlayTimeoutPtr]);

    this.setState({autoPlayTimer});
  }

  leaderboard(players, army, terrain) {
    let leaderboard = players.map((player, playerIndex) => {
      return {
        name: player.name,
        level: player.level,
        land: 0,
        army: 0,
        playerIndex: playerIndex
      };
    });
    terrain.forEach((value, index) => {
      if (value >= 0 && value !== 8) {
        leaderboard[value].land ++;
        leaderboard[value].army += army[index];
      }
    });
    return leaderboard.sort((p1, p2) => p2.army - p1.army);
  }

  setPlaySpeed(autoPlayTimeoutPtr) {
    this.setState({autoPlayTimeoutPtr});
  }

  handleKeydown(event) {
    switch (event.keyCode) {
      case 32:
        this.toggle();
        break;
      case 37:
        if (this.state.autoPlay) return;
        this.prev();
        break;
      case 39:
        if (this.state.autoPlay) return;
        this.next();
        break;
      default:
        break;
    }
  }

  open() {
    this.setState({modal: true});
  }

  close() {
    this.setState({modal: false});
  }

  exit() {
    browserHistory.push('/');
  }

  handleCheck(event) {
    this.setState({checked: event.target.checked});
  }

  handleTurnChange(event) {
    this.setState({turn: event.target.value});
  }

  render() {
    const { loaded, errored, modal, checked, turn } = this.state;
    if (errored) {
      return (
        <Modal className="game-replay-error-modal"
          title="录像读取失败" clickOutsideToClose={false}>
          <p className="modal-message">如果你刚刚在一场游戏中被击败，那么很有可能这场游戏的录像还没有准备好。</p>
          <p className="modal-message"><span className="underline">游戏录像只有等游戏完全结束后才能观看</span>，请您稍后刷新这个页面，重新读取。或者你也可以从 个人面板->历史纪录 找到你的录像。</p>
          <br />
          <p className="modal-message">如果你一直看到这个错误页面，请联系我们帮助解决。</p>
          <p className="modal-message">联系我们的时候请提供录像ID: <span className="replay-id">{this.id}</span></p>
          <div className="modal-footer">
            <div className="btn inverted" onClick={this.exit.bind(this)}>返回</div>
          </div>
        </Modal>
      );
    }
    if (!loaded) {
      return (
        <Modal className="game-replay-loading-modal"
          title="疯狂读取录像中..." clickOutsideToClose={false}>
        </Modal>
      );
    }

    let shareModal = null;
    if (modal) {
      const shareUrl = `${window.location.origin}/r/${this.id}` + (checked ? ('?t=' + turn) : '');
      shareModal = (
        <Modal className="game-replay-share-modal"
          onClose={this.close.bind(this)} title="分享录像">
          <p className="game-replay-share-link">{shareUrl}</p>
          <p className="game-replay-share-turn">
            <input type="checkbox" id="game-replay-share-check" onChange={this.handleCheck.bind(this)} /><label htmlFor="game-replay-share-check">起始回合</label>
            <input type="number" className="game-replay-share-input" min="0" value={turn} onChange={this.handleTurnChange.bind(this)} />
          </p>
          <div className="modal-footer">
            <div className="btn inverted" onClick={this.close.bind(this)}>关闭</div>
          </div>
        </Modal>
      );
    }
    return (
      <div id="replay">
        {shareModal}
        <Game ref={game => this.game = game} connector={this.connector} user={this.user} type="replay">
          <ReplayLeft jump={this.jump.bind(this)} open={this.open.bind(this)} />
          <ReplayBottom autoPlay={this.state.autoPlay} autoPlayTimeoutPtr={this.state.autoPlayTimeoutPtr}
            setPlaySpeed={this.setPlaySpeed.bind(this)}
            toggle={this.toggle.bind(this)}
            next={this.next.bind(this)}
            prev={this.prev.bind(this)} />
        </Game>
      </div>
    );
  }
};

export default Replay;
