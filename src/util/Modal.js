import React, { Component } from 'react';
import classNames from 'classnames';
import './modal.css';

class Modal extends Component {
  constructor(props) {
    super(props);

    this.onClickModalBackground = props.clickOutsideToClose === false ?
      () => {} : this.props.onClose;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({});
  }

  handleClick(event) {
    event.stopPropagation();
  }

  render() {
    const center = this.props.centerOnly ? ' center' : ' center-special';
    return (
      <div className="modal-background" onClick={this.onClickModalBackground}>
        <div className={classNames('modal', 'border', this.props.className, center)} onClick={this.handleClick}>
          {this.props.title && <h2 className="modal-title">{this.props.title}</h2>}
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Modal;
