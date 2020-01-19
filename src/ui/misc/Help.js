import React, { Component } from 'react'

import Modal from '../../util/Modal'
import './help.css'

export default class Help extends Component {
  render() {
    return (
      <Modal className="main-help-modal" centerOnly
        onClose={this.props.close} title="Help">
        <div className="tab-content">
          <h3>What is generals ?</h3>
          <p>Protect your general, command your army, take control of land, and capture other generals in this fast-paced multiplayer strategy game.</p>
          <h3>Rules</h3>
          <p>You start with a general. This general produces 1 troop every turn. All the other generals must die or quit for you to win the game. Normal lands produce 1 troop in so 25 turns, cities produce 1 troop every turn, just like generals. You can't take mountains. If you capture a king, you will receive all his land and cities also.</p>
        </div>
        <div className="modal-footer">
          <div className="btn inverted" onClick={this.props.close}>Close</div>
        </div>
      </Modal>
    )
  }
}
