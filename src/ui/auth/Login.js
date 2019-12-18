import React, { Component } from 'react';
import classNames from 'classnames';
import PubSub from 'pubsub-js';

import Modal from '../../util/Modal';
import Loader from '../misc/Loader';
import './auth.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.connector = props.connector;
    this.unbind = this.connector.bind('onmessage', this.onmessage.bind(this));
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      email: '',
      password: '',
      progressing: false
    };
  }

  componentDidMount() {
    this.emailInput.focus();
  }

  componentWillUnmount() {
    this.unbind();
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.login();
    }
    event.stopPropagation();
  }

  onmessage({type, payload}) {
    switch (type) {
      case 'user:login':
        if (payload) {
          PubSub.publish('toast:message', {
            type: 'error',
            message: `登陆失败：${payload.error}`
          });
          this.setState({progressing: false});
          return;
        }
        PubSub.publish('toast:message', {
          type: 'success',
          message: '登陆成功！'
        });
        this.props.close();
        break;
      default:
        break;
    }
  }

  login() {
    const { email, password, progressing } = this.state;
    if (!email || !password || progressing) {
      return;
    }
    this.setState({progressing: true});
    this.connector.send({
      action: 'user:login',
      payload: {
        email,
        password,
      }
    });
  }

  render() {
    const title = (<div><img className="modal-title-icon" alt="logo" src="/images/favicon.png" />登陆</div>);
    const loginButton = this.state.progressing ? <Loader /> : '登陆';
    return (
      <Modal centerOnly className="main-auth-modal main-login-modal" onClose={this.props.close} title={title}>
        <input type="text" ref={emailInput => this.emailInput = emailInput}
          onChange={this.handleEmailChange.bind(this)}
          placeholder="邮箱" value={this.state.email} />
        <input type="password"
          onKeyDown={this.handleKeyDown.bind(this)}
          onChange={this.handlePasswordChange.bind(this)}
          placeholder="密码" value={this.state.password} />
        <p className="modal-message" onClick={this.props.register}>还没有帐号？这里注册</p>
        <p className="modal-message" onClick={this.props.forgot}>忘记密码？</p>
        <div className="modal-footer">
          <div className={classNames('btn', 'inverted', {disabled: this.state.progressing})} onClick={this.login.bind(this)}>
            {loginButton}
          </div>
          <div className="btn inverted" onClick={this.props.close}>取消</div>
        </div>
      </Modal>
    );
  }
}

export default Login;
