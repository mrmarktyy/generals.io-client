import React, { Component } from 'react'
import './surrender.css'

export default class Surrender extends Component {
  render() {
    const { type, leaderboard, surrendered } = this.props.state
    if (type !== 'match' || leaderboard.length === 0 || surrendered) {
      return null
    }
    return (
      <div id="game-surrender">
        <div className="btn border btn-surrender" onClick={this.props.surrender}>Surrender</div>
      </div>
    )
  }
}
