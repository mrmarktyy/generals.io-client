import React, { Component } from 'react';
import './turn.css';

class Turn extends Component {
  render() {
    const { leaderboard, turn } = this.props.state;
    if (leaderboard.length === 0) {
      return null;
    }
    return (
      <div id="game-turn" className="border">
        Turn: {turn}
      </div>
    );
  }
};

export default Turn;
