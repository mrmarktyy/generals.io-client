import React, { Component } from 'react';
import './zoom.css';

class Zoom extends Component {
  render() {
    const { user, leaderboard } = this.props.state;
    if (leaderboard.length === 0) {
      return null;
    }
    return (
      <div id="game-zoom" className="border">
        <div className="btn" onClick={() => user.incZoom()}><span className="icon-zoom-in"></span></div>
        <div className="btn" onClick={() => user.decZoom()}><span className="icon-zoom-out"></span></div>
      </div>
    );
  }
};

export default Zoom;
