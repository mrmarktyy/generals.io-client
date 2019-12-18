import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import './scroll.css';

class Scroll extends Component {
  handleClick() {
    PubSub.publish('body:click');
  }

  render() {
    return (
      <div id="game-scroll"
        onMouseDown={this.props.scroll._mousedown}
        onMouseMove={this.props.scroll._mousemove}
        onMouseUp={this.props.scroll._mouseup}
        onTouchStart={this.props.scroll._mousedown}
        onTouchMove={this.props.scroll._mousemove}
        onTouchEnd={this.props.scroll._mouseup}
        onClick={this.handleClick.bind(this)}>
      </div>
    );
  }
};

export default Scroll;
