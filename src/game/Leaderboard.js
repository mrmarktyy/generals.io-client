import React, { Component } from 'react';
import classNames from 'classnames';

import config from '../util/Config';
import './leaderboard.css';

class Leaderboard extends Component {
  render() {
    const { leaderboard } = this.props.state;
    if (leaderboard.length === 0) {
      return null;
    }
    const deads = this.props.state.deads.map(dead => dead.playerIndex);
    const afks = this.props.state.afks.map(afk => afk.playerIndex);
    const leaderboards = leaderboard.map(player => {
      const playerIndex = player.playerIndex;
      return (
        <tr key={playerIndex}
          className={classNames({dead: deads.indexOf(playerIndex) >= 0, afk: afks.indexOf(playerIndex) >= 0})}>
          <td><span className="user-star">★</span>100</td>
          <td className={classNames('leaderboard__name', config.colors[playerIndex])}>
            {player.name}
          </td>
          <td>{player.army}</td>
          <td>{player.land}</td>
        </tr>
      );
    });
    return (
      <table id="game-leaderboard">
        <tbody>
          <tr>
            <td><span className="user-star">★</span></td>
            <td>Player</td>
            <td>Army</td>
            <td>Land</td>
          </tr>
          {leaderboards}
        </tbody>
      </table>
    );
  }
};

export default Leaderboard;
