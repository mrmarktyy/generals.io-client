import React, { Component } from 'react';

import config from '../util/Config';
import './main-bottom-right.css';

class MainBottomRight extends Component {
  render() {
    const href = `mailto:${config.mailto}`;
    return (
      <div className="main-bottom main-bottom-right">
        <p><a href={href}>mrmarktyy</a></p>
        <p>v{this.props.version}</p>
      </div>
    );
  }
}

export default MainBottomRight;
