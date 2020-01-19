import React, { Component } from 'react'

import config from '../util/Config'
import './main-bottom-right.css'

export default class MainBottomRight extends Component {
  render() {
    return (
      <div className="main-bottom main-bottom-right">
        <p><a href={`mailto:${config.mailto}`}>mrmarktyy</a></p>
        <p>v{this.props.version}</p>
      </div>
    );
  }
}
