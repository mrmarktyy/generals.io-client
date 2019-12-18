import React, { Component } from 'react';
import classNames from 'classnames';
import PubSub from 'pubsub-js';

import Modal from '../../util/Modal';
import Loader from '../misc/Loader';

class Register extends Component {
  constructor(props) {
    super(props);

    this.connector = props.connector;
    this.unbind = this.connector.bind('onmessage', this.onmessage.bind(this));
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      name: '',
      email: '',
      password: '',
      progressing: false
    };
  }

  componentDidMount() {
    this.nameInput.focus();
  }

  componentWillUnmount() {
    this.unbind();
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.register();
    }
    event.stopPropagation();
  }

  onmessage({type, payload}) {
    switch (type) {
      case 'user:register':
        if (payload) {
          PubSub.publish('toast:message', {
            type: 'error',
            message: `注册失败：${payload.error}`
          });
          this.setState({progressing: false});
          return;
        }
        PubSub.publish('toast:message', {
          type: 'success',
          message: '注册成功！'
        });
        this.props.close();
        break;
      default:
        break;
    }
  }

  register() {
    const { name, email, password, progressing } = this.state;
    if (!name || !email || !password || progressing) {
      return;
    }
    this.setState({progressing: true});
    this.connector.send({
      action: 'user:register',
      payload: {
        name,
        email,
        password,
      }
    });
  }

  render() {
    const title = (<div><img className="modal-title-icon" alt="logo" src="/images/favicon.png" />注册</div>);
    const registerButton = this.state.progressing ? <Loader /> : '注册';
    return (
      <Modal centerOnly className="main-auth-modal main-register-modal" onClose={this.props.close} title={title}>
        <input type="text" ref={nameInput => this.nameInput = nameInput}
          onChange={this.handleNameChange.bind(this)}
          placeholder="昵称:认真填写,不能随意修改" value={this.state.name} />
        <input type="text"
          onChange={this.handleEmailChange.bind(this)}
          placeholder="邮箱:真实邮箱,用于找回密码" value={this.state.email} />
        <input type="password"
          onKeyDown={this.handleKeyDown.bind(this)}
          onChange={this.handlePasswordChange.bind(this)}
          placeholder="密码" value={this.state.password} />
        <p className="modal-message" onClick={this.props.login}>已经有帐号？这里登陆</p>
        <div className="modal-footer">
          <div className={classNames('btn', 'inverted', {disabled: this.state.progressing})} onClick={this.register.bind(this)}>
            {registerButton}
          </div>
          <div className="btn inverted" onClick={this.props.close}>取消</div>
        </div>
      </Modal>
    );
  }
}

export default Register;
