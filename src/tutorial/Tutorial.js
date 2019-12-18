import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { browserHistory } from 'react-router';
import PubSub from 'pubsub-js';

import './tutorial.css';
import Game from '../game/Game';

class Tutorial extends Component {
  constructor(props) {
    super(props);

    this.connector = props.route.connector;
    this.user = props.route.user;

    this.messages = [
      'Welcome to <strong>generals.io</strong><br>Before the real battle，Let me introduce you some of the rules！',
      'First，Click on your <strong>General</strong>，<br>then，use the arrow keys<strong> ↑ → ↓ ← </strong>to move the troops and conquer land around',
      'You can use <strong>WASD</strong> keys to move too.',
      'Good！Every <strong>25</strong> turns，all land owned by you will spawn <strong>1</strong> unit army。<br>Ok，Now try to drag the map around！',
      'Do you see the city locates bottom right to your General? <br>To conquer this city, you need at least<strong>40</strong>units army.<br>However, every turn，1 unit army will be spawn in your city.<br><strong>Now gather all your force and conquer this city! </strong>',
      'You made it！Now keep expanding your territory until you find enemy\'s <strong>General</strong>。<br><strong>Conquer it to win the game</strong><br>If your General is conquered by others, you lose the game immediately.',
      'Victory！Now you\'re good to battle in real match!'
    ];

    this.state = {
      step: 0,
      messages: [this.getMessage(0)]
    };

    this.subscriptions = [
      PubSub.subscribe('body:click', this.handleBodyClick.bind(this)),
      PubSub.subscribe('game:move', this.handleGameMove.bind(this)),
      PubSub.subscribe('game:update', this.handleGameUpdate.bind(this)),
      PubSub.subscribe('game:win', this.handleGameEnd.bind(this)),
      PubSub.subscribe('scroll:position', this.handleScrollPosition.bind(this))
    ];
  }

  componentDidMount() {
    if (this.user.tutorial) {
      browserHistory.push('/');
      return;
    }

    this.connector.send({
      action: 'user:search',
      payload: {mode: 'tutorial'}
    });
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => PubSub.unsubscribe(subscription));
  }

  handleBodyClick() {
    const { step } = this.state;
    if (step === 0) {
      this.next();
    }
  }

  handleGameMove() {
    const { step } = this.state;
    if (step === 1) {
      this.next();
    } else if (step === 2) {
      this.next();
    }
  }

  handleGameUpdate(message, terrain) {
    const { step } = this.state;
    if (step === 4 && terrain[46] === 0) {
      this.next();
    } else if (step === 5 && terrain[65] === 0) {
      this.next();
    }
  }

  handleGameEnd() {
    this.user.setTutorial(true);
  }

  handleScrollPosition() {
    const { step } = this.state;
    if (step === 3) {
      this.next();
    }
  }

  next() {
    let { step, messages } = this.state;
    const nextStep = step + 1;
    messages.push(this.getMessage(nextStep));
    messages.shift();
    this.setState({
      step: nextStep,
      messages
    });
  }

  getMessage(step) {
    return (
      <div key={step} id="tutorial" className="border">
        <p dangerouslySetInnerHTML={{__html: this.messages[step]}}></p>
      </div>
    );
  }

  render() {
    const { messages } = this.state;
    return (
      <div>
        <ReactCSSTransitionGroup
          transitionName="tutorial"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {messages}
        </ReactCSSTransitionGroup>
        <Game connector={this.connector} user={this.user} playerIndex={0} type="tutorial" />
      </div>
    );
  }
}

export default Tutorial;
