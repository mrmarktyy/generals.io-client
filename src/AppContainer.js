import React, { Component } from 'react'
import PubSub from 'pubsub-js'

import './app-container.css'
import Modal from './util/Modal'
import Toast from './util/Toast'

class AppContainer extends Component {
  constructor(props) {
    super(props)

    this.user = props.route.user
    this.connector = props.route.connector
    this.connector.bind('onopen', this.onopen.bind(this))
    this.connector.bind('onmessage', this.onmessage.bind(this))
    this.connector.bind('onclose', this.onclose.bind(this))
    this.state = {
      modals: [],
      toast: false
    }
    // this.subscribes = [
    //   PubSub.subscribe('toast:message', (action, {type, message}) => {
    //     this.openToast({type, message})
    //   }),
    //   PubSub.subscribe('system:modal', (action, modal) => {
    //     this.openModal(modal)
    //   })
    // ]
  }

  componentWillUnmount () {
    this.subscribes.forEach(subscribe => {
      PubSub.unsubscribe(subscribe)
    })
  }

  openModal (modal) {
    this.setState({
      modals: this.state.modals.concat(modal)
    })
  }

  closeModal() {
    this.setState({
      modals: this.state.modals.splice(1)
    })
  }

  openToast({ type, message }) {
    this.setState({toast: {type, message}})
    setTimeout(() => this.closeToast(), 2500)
  }

  closeToast() {
    this.setState({toast: false})
  }

  renderModal() {
    const modal = this.state.modals[0]
    if (!modal) return null
    const { title = 'System', content, footer } = modal
    return (
      <Modal className="app-system-modal" centerOnly={false}
        clickOutsideToClose={false} title={title}>
        {content}
        {
          footer !== false &&
          <div className="modal-footer">
            <div className="btn inverted" onClick={this.closeModal.bind(this)}>OK</div>
          </div>
        }
      </Modal>
    )
  }

  renderToast() {
    const { toast } = this.state
    if (!toast) return null
    return (
      <Toast type={toast.type}>
        <p>{toast.message}</p>
      </Toast>
    )
  }

  render() {
    return (
      <div id="app-container">
        {this.renderToast()}
        {this.props.children}
        {this.renderModal()}
      </div>
    )
  }

  onopen () {
    this.user.sendInit()
  }

  onmessage({ type, payload }) {
    switch (type) {
      default:
        break
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
    })
  }
}

export default AppContainer
