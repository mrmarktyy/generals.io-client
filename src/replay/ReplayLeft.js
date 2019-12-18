import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import './replay-left.css';

class ReplayLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {input: ''};
  }

  jump() {
    let input = this.state.input;
    if (!input) return;
    let turn = +input;
    if (isNaN(turn)) return;
    this.props.jump(turn);
    this.setState({input: ''});
  }

  exit() {
    browserHistory.push('/');
  }

  handleChange(event) {
    this.setState({input: event.target.value});
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.jump();
    }
    event.stopPropagation();
  }

  render() {
    return (
      <div id="game-replay-left">
        <div className="game-replay-turn-jump border">
          跳转到回合：
          <input type="text" className="game-replay-turn-jump-input" maxLength="5"
            value={this.state.input}
            onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} />
          <div className="btn btn-jump" onClick={this.jump.bind(this)}>→</div>
        </div>
        <div className="game-replay-exit border">
          <div className="btn btn-exit" onClick={this.exit}>退出</div>
        </div>
        <div className="game-replay-share border">
          <div className="btn btn-share" onClick={this.props.open}>分享录像</div>
        </div>
      </div>
    );
  }
}

export default ReplayLeft;
