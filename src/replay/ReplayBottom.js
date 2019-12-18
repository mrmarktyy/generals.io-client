import React, { Component } from 'react';
import classNames from 'classnames';

import './replay-bottom.css';

class ReplayBottom extends Component {
  renderPlayControl() {
    const { autoPlay, autoPlayTimeoutPtr } = this.props;
    if (!autoPlay) {
      return null;
    }
    return (
      <ul id="game-replay-bottom-playcontrol" className="clearfix border-bottom">
        <li className={classNames('btn', {selected: autoPlayTimeoutPtr === 4})} onClick={() => this.props.setPlaySpeed(4)}>0.5x</li>
        <li className={classNames('btn', {selected: autoPlayTimeoutPtr === 3})} onClick={() => this.props.setPlaySpeed(3)}>1x</li>
        <li className={classNames('btn', {selected: autoPlayTimeoutPtr === 2})} onClick={() => this.props.setPlaySpeed(2)}>2x</li>
        <li className={classNames('btn', {selected: autoPlayTimeoutPtr === 1})} onClick={() => this.props.setPlaySpeed(1)}>5x</li>
        <li className={classNames('btn', {selected: autoPlayTimeoutPtr === 0})} onClick={() => this.props.setPlaySpeed(0)}>10x</li>
      </ul>
    );
  }

  render() {
    const { autoPlay } = this.props;
    return (
      <div id="game-replay-bottom" className="fixed-center-horizontal">
        { this.renderPlayControl() }
        <ul id="game-replay-bottom-bar" className="clearfix">
          <li className="btn" onClick={this.props.prev}>
            <p>[←]</p>上一步
          </li>
          <li className={classNames('btn', {selected: autoPlay})} onClick={this.props.toggle}>
            <p>[空格]</p>自动播放
          </li>
          <li className="btn" onClick={this.props.next}>
            <p>[→]</p>下一步
          </li>
        </ul>
      </div>
    );
  }
};

export default ReplayBottom;
