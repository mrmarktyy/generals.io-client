import React, { Component } from 'react'

import './main-bottom-left.css'
import Help from './misc/Help'

export default class MainBottomLeft extends Component {
  constructor(props) {
    super(props)

    this.connector = props.connector
    this.state = {help: false}
  }

  close() {
    this.setState({help: false})
  }

  open() {
    this.setState({help: true})
  }

  render() {
    const help = <Help close={this.close.bind(this)} />
    return (
      <div className="main-bottom main-bottom-left">
        {this.state.help && help}
        <p onClick={this.open.bind(this)}>Help</p>
      </div>
    )
  }
}
