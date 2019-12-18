import React, { Component } from 'react';
import './toast.css';

class Toast extends Component {
  handleClick(event) {
    event.stopPropagation();
  }

  render() {
    let classNames = ['toast'];
    this.props.className && classNames.push(this.props.className);
    this.props.type && classNames.push(this.props.type);
    return (
      <div className={classNames.join(' ')} onClick={this.handleClick}>
        {this.props.children}
      </div>
    );
  }
}

export default Toast;
