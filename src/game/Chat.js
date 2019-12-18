import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import config from '../config';

import './chat.css';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.connector = props.connector;
    this.unbind = this.connector.bind('onmessage', this.onmessage.bind(this));
    this.state = {
      input: '',
      messages: []
    };
  }

  componentDidMount() {
    this.subscribes = [
      PubSub.subscribe('body:click', () => this.input && this.input.blur()),
      PubSub.subscribe('tile:click', () => this.input && this.input.blur())
    ];
  }

  componentWillUnmount() {
    this.unbind();
    this.subscribes.forEach(subscribe => {
      PubSub.unsubscribe(subscribe);
    });
  }

  onmessage({type, payload}) {
    switch (type) {
      case 'game:chat':
        this.setState({messages: [...this.state.messages, payload]});
        break;
      default:
        break;
    }
  }

  handleChange(event) {
    this.setState({input: event.target.value});
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.input.blur();

      let finalInput = this.state.input.substr(0, config.chat.maxNumberOfCharactersAllowed);
      if (!finalInput) return;

      this.connector.send({
        action: 'game:chat',
        payload: {message: finalInput}
      });
      this.setState({input: ''});
    }
    event.stopPropagation();
  }

  render() {
    const { input, messages } = this.state;
    const { id } = this.props;
    if (!id) {
      return null;
    }
    return (
      <div id="game-chat">
        <div className="game-chat-container">
          {
            messages.map((message, index) => {
              return (
                <p key={index} className="game-chat-message">
                  <span>{message.name}</span>: <span>{message.content}</span>
                </p>
              );
            })
          }
        </div>
        <input type="text" id="game-chat-input" placeholder="Press [Enter] to chat" value={input}
          ref={input => this.input = input}
          maxLength={config.chat.maxNumberOfCharactersAllowed}
          onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} />
      </div>
    );
  }
};

export default Chat;
