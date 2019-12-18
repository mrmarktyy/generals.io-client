import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import './map.css';

import Tile from './Tile';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = props.state;
    this.updateGameState = props.updateGameState;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps.state});
  }

  handleTableClick() {
    PubSub.publish('body:click');
    this.deselect();
  }

  set50(tileIndex) {
    if (!this.state.selected) return;

    this.updateGameState({is50: tileIndex});
  }

  flag({tileIndex}) {
    let { flags } = this.state;
    if (flags.indexOf(tileIndex) >= 0) {
      flags = flags.filter(value => value !== tileIndex);
    } else {
      flags.push(tileIndex);
    }
    this.updateGameState({flags});
  }

  deselect() {
    if (!this.state.selected) return;

    this.updateGameState({
      selected: null,
      is50: null,
      attackable: []
    });
  }

  select(tile) {
    const { terrain, tiles } = this.state;

    this.deselect();

    let attackable = [];
    if (terrain[tile.top] !== -2 && tiles[tile.top]) {
      attackable.push(tile.top);
    }
    if (terrain[tile.right] !== -2 && tiles[tile.right]) {
      attackable.push(tile.right);
    }
    if (terrain[tile.bottom] !== -2 && tiles[tile.bottom]) {
      attackable.push(tile.bottom);
    }
    if (terrain[tile.left] !== -2 && tiles[tile.left]) {
      attackable.push(tile.left);
    }

    this.updateGameState({
      selected: tile,
      is50: null,
      attackable
    });
  }

  render() {
    let tbody = [];
    if (this.state) {
      for (let i = 0; i < this.state.height; i++) {
        let row = [];
        for (let j = 0; j < this.state.width; j++) {
          row.push(
            <Tile key={j+'.'+i} x={j} y={i}
              state={this.state}
              connector={this.props.connector}
              create={this.props.create} move={this.props.move}
              flag={this.flag.bind(this)}
              set50={this.set50.bind(this)}
              deselect={this.deselect.bind(this)}
              select={this.select.bind(this)} />
          );
        }
        tbody.push(<tr key={i}>{row}</tr>);
      }
    }
    return (
      <table id="map" style={this.getStyle()}
        onMouseDown={this.props.scroll._mousedown}
        onMouseMove={this.props.scroll._mousemove}
        onMouseUp={this.props.scroll._mouseup}
        onTouchStart={this.props.scroll._mousedown}
        onTouchMove={this.props.scroll._mousemove}
        onTouchEnd={this.props.scroll._mouseup}
        onClick={this.handleTableClick.bind(this)}>
        <tbody>{tbody}</tbody>
      </table>
    );
  }

  getStyle() {
    const {x, y} = this.props.scroll.getPosition();
    return {
      'transform': 'translate3d(' + x + 'px, ' + y + 'px, 0)',
      'WebkitTransform': 'translate3d(' + x + 'px, ' + y + 'px, 0)'
    };
  }
};

export default Map;
