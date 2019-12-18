import React, { Component } from 'react';
import classNames from 'classnames';
import PubSub from 'pubsub-js';

import Modal from '../../util/Modal';
import Loader from '../misc/Loader';

class Forgot extends Component {
  constructor(props) {
    super(props);

    this.connector = props.connector;
    this.unbind = this.connector.bind('onmessage', this.onmessage.bind(this));
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      email: '',
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

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.forgot();
    }
    event.stopPropagation();
  }

  onmessage({type, payload}) {
    switch (type) {
      case 'user:forgot_pwd':
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
          message: '成功！ 请查收邮件并通过邮件提示完成密码重置。'
        });
        this.props.close();
        break;
      default:
        break;
    }
  }

  forgot() {
    const { email, progressing } = this.state;
    if (!email || progressing) {
      return;
    }
    this.setState({progressing: true});
    this.connector.send({
      action: 'user:forgot_pwd',
      payload: {
        email
      }
    });
  }

  render() {
    const title = (<div><img className="modal-title-icon" alt="logo" src="/images/favicon.png" />忘记密码</div>);
    const confirmButton = this.state.progressing ? <Loader /> : '确认';
    return (
      <Modal centerOnly className="main-auth-modal main-login-modal" onClose={this.props.close} title={title}>
        <input type="text" ref={emailInput => this.emailInput = emailInput}
          onChange={this.handleEmailChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
          placeholder="邮箱" value={this.state.email} />
        <div className="modal-footer">
          <div className={classNames('btn', 'inverted', {disabled: this.state.progressing})} onClick={this.forgot.bind(this)}>
            {confirmButton}
          </div>
          <div className="btn inverted" onClick={this.props.close}>取消</div>
        </div>
      </Modal>
    );
  }
}

export default Forgot;
