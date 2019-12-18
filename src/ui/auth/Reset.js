import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import PubSub from 'pubsub-js';

import Loader from '../misc/Loader';

class Reset extends Component {
  constructor(props) {
    super(props);

    this.connector = props.route.connector;
    this.unbind = this.connector.bind('onmessage', this.onmessage.bind(this));
    this.user = props.route.user;

    this.state = {
      password: '',
      confirm: '',
      progressing: false
    };
  }

  componentWillUnmount() {
    this.unbind();
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleConfirmChange(event) {
    this.setState({confirm: event.target.value});
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.confirm();
    }
    event.stopPropagation();
  }

  onmessage({type, payload}) {
    switch (type) {
      case 'user:reset_pwd':
        if (payload) {
          PubSub.publish('toast:message', {
            type: 'error',
            message: `${payload.error}`
          });
          this.setState({progressing: false});
          return;
        }
        PubSub.publish('toast:message', {
          type: 'success',
          message: '密码重置成功！'
        });
        this.toMainMenu();
        break;
      default:
        break;
    }
  }

  toMainMenu() {
    browserHistory.push('/');
  }

  confirm() {
    const { password, confirm, progressing } = this.state;
    const { token } = this.props.location.query;
    if (!password || !confirm || progressing) {
      return;
    }
    if (password !== confirm) {
      PubSub.publish('toast:message', {
        type: 'error',
        message: '新密码和确认密码不一致'
      });
      return;
    }
    this.setState({progressing: true});
    this.connector.send({
      action: 'user:reset_pwd',
      payload: {
        token,
        password
      }
    });
  }

  render() {
    const resetPasswordButton = this.state.progressing ? <Loader /> : '确认';
    return (
      <div className="reset-password">
        <center>
          <h1>密码重置</h1>
          <input type="password" onChange={this.handlePasswordChange.bind(this)}
            placeholder="新密码" value={this.state.password} />
          <input type="password" onChange={this.handleConfirmChange.bind(this)}
            onKeyDown={this.handleKeyDown.bind(this)}
            placeholder="再输入一次新密码" value={this.state.confirm} />
          <div className={classNames('btn', 'inverted', {disabled: this.state.progressing})} onClick={this.confirm.bind(this)}>
            {resetPasswordButton}
          </div>
          <div className="btn" onClick={this.toMainMenu.bind(this)}>
            返回
          </div>
        </center>
      </div>
    );
  }
}

export default Reset;
