import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import PubSub from 'pubsub-js';
import classNames from 'classnames';

import './match.css';
import config from '../util/Config';
import Notifier from '../util/Notifier';
import Game from '../game/Game';

class Match extends Component {
  constructor(props) {
    super(props);

    this.connector = props.route.connector;
    this.user = props.route.user;
    this.state = {
      matchStarted: false,
      matchInfo: props.location.state,
      matchStartTime: +new Date() + 5000,
      matchCountdown: 5
    };
  }

  componentDidMount() {
    if (!this.state.matchInfo) {
      browserHistory.push('/');
      return;
    }
    // TODO verify if this is a reload

    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    this.subscribe = PubSub.subscribe('game:start', () => {
      this.setGameStarted(true);
    });
    this.countdown();

    Notifier.run();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    PubSub.unsubscribe(this.subscribe);
  }

  routerWillLeave(nextLocation) {
    const { lost, won } = this.game.state;
    if (!lost && !won) {
      return 'Game hasn\'t finished yet, are you sure to leave the game?'
    }
  }

  countdown() {
    this.timer = setTimeout(() => {
      const matchCountdown = this.getMatchCountdown();
      this.setState({matchCountdown});
      if (matchCountdown) {
        this.countdown()
      }
    }, 1000);
  }

  getColorClassName(playerIndex) {
    return `player-color ${config.colors[playerIndex]}`;
  }

  getMatchCountdown() {
    const countdown = Math.ceil((this.state.matchStartTime - (+new Date())) / 1000);
    return countdown < 0 ? 0 : countdown;
  }

  setGameStarted(matchStarted) {
    this.setState({matchStarted});
  }

  render() {
    const { matchInfo, matchCountdown, matchStarted } = this.state;
    if (!matchInfo) {
      return null;
    }
    const players = matchInfo.players.map(player => {
      return (
        <li key={player.playerIndex}>
          <div>
            {player.name}
          </div>
          <div className={classNames('center-vertical', this.getColorClassName(player.playerIndex))}></div>
        </li>
      );
    });
    return (
      <div>
        { !matchStarted &&
        <div className="match-info center-horizontal">
          <h2>Game Info</h2>
          <div className="player">
            You will use:
            <div className={classNames(this.getColorClassName(matchInfo.playerIndex))}></div>
          </div>
          <p>Opponent:</p>
          <ul className="player-list">
            {players}
          </ul>
          <p>Game will start in <span className="match-countdown">{matchCountdown}</span> second...</p>
        </div>
        }
        <Game ref={game => this.game = game} connector={this.connector} user={this.user}
          playerIndex={matchInfo.playerIndex} type="match" />
      </div>
    );
  }
}

export default Match;
