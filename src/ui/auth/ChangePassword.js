import React, { Component } from 'react';
import classNames from 'classnames';
import PubSub from 'pubsub-js';

import Modal from '../../util/Modal';
import Loader from '../misc/Loader';
import './auth.css';

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.connector = props.connector;
    this.unbind = this.connector.bind('onmessage', this.onmessage.bind(this));
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      old: '',
      password: '',
      confirm: '',
      progressing: false
    };
  }

  componentWillUnmount() {
    this.unbind();
  }

  handleOldChange(event) {
    this.setState({old: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleConfirmChange(event) {
    this.setState({confirm: event.target.value});
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.change();
    }
    event.stopPropagation();
  }

  onmessage({type, payload}) {
    switch (type) {
      case 'user:change_pwd':
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
          message: '密码更改成功！'
        });
        this.props.close();
        break;
      default:
        break;
    }
  }

  change() {
    const { old, password, confirm, progressing } = this.state;
    if (!old || !password || !confirm || progressing) {
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
      action: 'user:change_pwd',
      payload: {
        old,
        password
      }
    });
  }

  render() {
    const title = (<div><img className="modal-title-icon" alt="logo" src="/images/favicon.png" />更改密码</div>);
    const changePasswordButton = this.state.progressing ? <Loader /> : '确认';
    return (
      <Modal centerOnly className="main-auth-modal main-login-modal" onClose={this.props.close} title={title}>
        <input type="password" onChange={this.handleOldChange.bind(this)}
          placeholder="旧密码" value={this.state.old} />
        <input type="password" onChange={this.handlePasswordChange.bind(this)}
          placeholder="新密码" value={this.state.password} />
        <input type="password" onChange={this.handleConfirmChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
          placeholder="再输入一次新密码" value={this.state.confirm} />
        <div className="modal-footer">
          <div className={classNames('btn', 'inverted', {disabled: this.state.progressing})} onClick={this.change.bind(this)}>
            {changePasswordButton}
          </div>
          <div className="btn inverted" onClick={this.props.close}>取消</div>
        </div>
      </Modal>
    );
  }
}

export default ChangePassword;
