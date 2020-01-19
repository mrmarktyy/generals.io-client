import React, { Component } from 'react'
import classnames from 'classnames';
import './toast.css'

export default class Toast extends Component {
  handleClick (event) {
    event.stopPropagation()
  }

  render() {
    return (
      <div className={classnames('toast', this.props.className, this.props.type)} onClick={this.handleClick}>
        {this.props.children}
      </div>
    )
  }
}
