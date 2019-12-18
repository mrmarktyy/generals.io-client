import React, { Component } from 'react';
import './resign.css';

class Resign extends Component {
  render() {
    const { type, leaderboard, resigned } = this.props.state;
    if (type !== 'match' || leaderboard.length === 0 || resigned) {
      return null;
    }
    return (
      <div id="game-resign">
        <div className="btn border btn-resign" onClick={this.props.resign}>Resign</div>
      </div>
    );
  }
};

export default Resign;
