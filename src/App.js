import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import 'whatwg-fetch';

import packageJSON from '../package';
import Connector from './util/Connector';
import config from './util/Config';
import Notifier from './util/Notifier';
import User from './model/User';

import AppContainer from './AppContainer';
import MainMenu from './ui/MainMenu';
import Match from './match/Match';
import Replay from './replay/Replay';
import Tutorial from './tutorial/Tutorial';

class App extends Component {
  constructor(props) {
    super(props);

    Notifier.init();
    console.log(config)
    this.user = new User(config);
    this.connector = new Connector(config);
    this.user.bind(this.connector);
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route connector={this.connector} user={this.user} component={AppContainer}>
          <Route path="/" connector={this.connector} user={this.user} version={packageJSON.version} component={MainMenu} />
          <Route path="/tutorial" connector={this.connector} user={this.user} component={Tutorial} />
          <Route path="/g/:id" connector={this.connector} user={this.user} component={Match} />
          <Route path="/r/:id" connector={this.connector} user={this.user} component={Replay} />
          <Route path="*" connector={this.connector} user={this.user} version={packageJSON.version} component={MainMenu}></Route>
        </Route>
      </Router>
    );
  }
}

export default App;
