import React, { Component } from 'react'

import './app-container.css'
import Modal from './util/Modal'

class AppContainer extends Component {
  constructor(props) {
    super(props)

    this.user = props.route.user
    this.connector = props.route.connector
    this.connector.bind('onopen', this.onopen.bind(this))
    this.connector.bind('onclose', this.onclose.bind(this))
    this.state = {
      modal: null
    }
  }

  openModal (modal) {
    this.setState({ modal })
  }

  closeModal = () => {
    this.setState({ modal: null })
  }

  renderModal() {
    const { modal } = this.state
    if (!modal) return null
    return (
      <Modal className="app-system-modal" centerOnly={false}
        clickOutsideToClose={false} title="System">
        {modal}
        <div className="modal-footer">
          <div className="btn inverted" onClick={this.closeModal}>OK</div>
        </div>
      </Modal>
    )
  }

  render() {
    return (
      <div id="app-container">
        {this.props.children}
        {this.renderModal()}
      </div>
    )
  }

  onopen () {
    this.user.sendInit()
  }

  onclose (error) {
    this.openModal(
      <div>
        <p className="modal-message">
          When you see this message, it means you might have disconnected with the server.
          <br/>
          Please try refresh or please contact mrmarktyy at gmail dot com
        </p>
      </div>
    )
  }
}

export default AppContainer
