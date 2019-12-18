import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import './app-container.css';
import Modal from './util/Modal';
import Toast from './util/Toast';
import Loader from './ui/misc/Loader';

class AppContainer extends Component {
  constructor(props) {
    super(props);

    this.user = props.route.user;
    this.connector = props.route.connector;
    this.connector.bind('onopen', this.onopen.bind(this));
    this.connector.bind('onmessage', this.onmessage.bind(this));
    this.connector.bind('onclose', this.onclose.bind(this));
    this.state = this.getInitalState();

    this.subscribes = [
      PubSub.subscribe('toast:message', (action, {type, message}) => {
        this.openToast({type, message});
      }),
      PubSub.subscribe('system:modal', (action, modal) => {
        this.openModal(modal)
      })
    ];
    this.subscribe = PubSub.subscribe('user:update', () => {
      if (this.user.isSynced()) {
        this.closeModal();
        PubSub.unsubscribe(this.subscribe);
      }
    });
  }

  getInitalState() {
    return {
      modals: [{
        title: 'Loading...Please wait...',
        content: <Loader width="100" height="40" fill="teal" />,
        footer: false
      }],
      toast: false
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.subscribes.forEach(subscribe => {
      PubSub.unsubscribe(subscribe);
    });
  }

  openModal(modal) {
    this.setState({
      modals: this.state.modals.concat(modal)
    });
  }

  closeModal() {
    this.setState({
      modals: this.state.modals.splice(1)
    });
  }

  openToast({type, message}) {
    this.setState({toast: {type, message}});
    setTimeout(() => this.closeToast(), 2500);
  }

  closeToast() {
    this.setState({toast: false});
  }

  renderModal() {
    const modal = this.state.modals[0];
    if (!modal) {
      return null;
    }
    return (
      <Modal className="app-system-modal" centerOnly={false}
        clickOutsideToClose={false} title={modal.title || 'System'}>
        {modal.content}
        {
          modal.footer !== false &&
          <div className="modal-footer">
            <div className="btn inverted" onClick={this.closeModal.bind(this)}>OK</div>
          </div>
        }
      </Modal>
    )
  }

  renderToast() {
    const { toast } = this.state;
    if (!toast) {
      return null;
    }
    return (
      <Toast type={toast.type}>
        <p>{toast.message}</p>
      </Toast>
    );
  }

  render() {
    return (
      <div id="app-container">
        {this.renderToast()}
        {this.props.children}
        {this.renderModal()}
      </div>
    );
  }

  onopen() {
    this.user.sendInit(this.props.location.query.from);
  }

  onmessage({type, payload}) {
    switch (type) {
      case 'user:repeat_join':
        this.openModal({
          content: (
            <div>
              <p className="modal-message">
                We found your account is already in use. Please do not open multiple tabs with your account.
              </p>
            </div>
          )
        });
        break;
      case 'server:message':
        const { errno } = payload;
        this.openToast({type: 'error', message: errno});
        break;
      default:
        break;
    }
  }

  onclose(error) {
    this.openModal({
      content: (
        <div>
          <p className="modal-message">
            When you see this message, it means you might have disconnected with the server.
            <br/>
            Please try refresh or please contact mrmarktyy at gmail dot com
          </p>
        </div>
      )
    });
  }
}

export default AppContainer;
