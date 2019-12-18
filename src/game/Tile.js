import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import config from '../util/Config';

class Tile extends Component {
  constructor(props) {
    super(props);
    this.state = props.state;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps.state});
  }

  handleClick(event) {
    const tileIndex = this.props.x + this.props.y * this.state.width;
    const classList = event.currentTarget.classList;
    if (classList.contains('attackable')) {
      event.stopPropagation();

      this.props.move(
        this.props.create({from: this.state.selected.index, to: tileIndex}),
        this.state.tiles[tileIndex]
      );
    } else if (classList.contains('selectable')) {
      event.stopPropagation();

      if (classList.contains('selected50')) {
        this.props.deselect();
      } else if (classList.contains('selected')) {
        this.props.set50(tileIndex);
      } else {
        this.props.select(this.state.tiles[tileIndex])
      }
    }
    PubSub.publish('tile:click');
  }

  onContextMenu(event) {
    const tileIndex = this.props.x + this.props.y * this.state.width;
    this.props.flag({tileIndex});
    this.props.connector.send({
      action: 'game:flag',
      payload: tileIndex
    });

    event.preventDefault();
  }

  topArrow() {
    return (
      <div key="top" className="center-horizontal" style={{top: 0}}>↑</div>
    );
  }

  rightArrow() {
    return (
      <div key="right" className="center-vertical" style={{right: 0}}>→</div>
    );
  }

  bottomArrow() {
    return (
      <div key="bottom" className="center-horizontal" style={{bottom: 0}}>↓</div>
    );
  }

  leftArrow() {
    return (
      <div key="left" className="center-vertical" style={{left: 0}}>←</div>
    );
  }

  flag() {
    return (
      <div key="flag" className="center">⚑</div>
    );
  }

  render() {
    const { x, y } = this.props;
    const { width, selected, player_index, is50, flags, cities, generals, swords, eyes,
      shields, army, terrain, attackable, actions } = this.state;
    const i = x + y * width;

    if (!terrain || !army) {
      return null;
    }

    let classNames = [];
    switch (terrain[i]) {
      case -2:
        classNames.push('mountain');
        break;
      case -3:
        classNames.push('fog');
        break;
      case -4:
        classNames.push('fog obstacle');
        break;
      default:
        break;
    }

    let is50Tile = is50 === i;
    if (is50Tile) {
      classNames.push('selected50');
    }

    if (selected && selected.index === i) {
      classNames.push('selected');
    } else if (attackable.indexOf(i) >= 0) {
      classNames.push('attackable');
    }

    if (cities.indexOf(i) >= 0) {
      classNames.push('city');
    } else if (generals.indexOf(i) >= 0) {
      classNames.push('general');
    } else if (swords.indexOf(i) >= 0) {
      classNames.push('sword');
    } else if (eyes.indexOf(i) >= 0) {
      classNames.push('eye');
    } else if (shields.indexOf(i) >= 0) {
      classNames.push('shield');
    }

    if (terrain[i] > -1) {
      classNames.push(config.colors[terrain[i]]);
      if (terrain[i] === player_index) {
        classNames.push('selectable');
      }
    }

    const arrows = [];
    let bottom, top, right, left;
    actions
      .filter(action => action.from === i)
      .forEach(action => {
        const toX = action.to % width;
        const toY = Math.floor(action.to / width);
        if (x === toX && y === toY - 1 && !bottom) {
          arrows.push(this.bottomArrow());
          bottom = true;
        } else if (x === toX && y === toY + 1 && !top) {
          arrows.push(this.topArrow());
          top = true;
        } else if (x === toX - 1 && y === toY && !right) {
          arrows.push(this.rightArrow());
          right = true;
        } else if (x === toX + 1 && y === toY && !left) {
          arrows.push(this.leftArrow());
          left = true;
        }
      });

    if (flags.indexOf(i) >= 0) {
      classNames.push('flag');
      arrows.push(this.flag());
    }

    return (
      <td className={classNames.join(' ')}
        onClick={this.handleClick.bind(this)}
        onTouchStart={this.handleClick.bind(this)}
        onContextMenu={this.onContextMenu.bind(this)}>
        {is50Tile ? '50%' : (army[i] || '')}
        {arrows}
      </td>
    );
  }
}

export default Tile;
