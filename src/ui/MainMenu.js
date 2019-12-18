import React, { Component } from 'react';
import classNames from 'classnames';
import PubSub from 'pubsub-js';

import './main-menu.css';
import config from '../util/Config';
import Modal from '../util/Modal';

import MainBottomRight from './MainBottomRight';
import MainBottomLeft from './MainBottomLeft';
import MainTopLeft from './MainTopLeft';

class MainMenu extends Component {
  constructor(props) {
    super(props);

    this.user = props.route.user;
    this.connector = props.route.connector;
    this.unbind = this.connector.bind('onmessage', this.onmessage.bind(this));
    this.searchingTimer = null;
    this.searchingTime = '';
    this.state = {
      mode: null,
      chat: false,
      match: false,
      warning: false,
      unread: 0,
      searchingStartTime: null,
      ffa: {
        waiting: '?',
        total: '?'
      }
    };

    this.subscribe = PubSub.subscribe('user:update', () => this.forceUpdate());
  }

  componentWillUnmount() {
    if (this.state.searchingStartTime) {
      this.stop();
    } else {
      this.clear();
    }
    this.unbind();
    PubSub.unsubscribe(this.subscribe);
  }

  play() {
    if (!this.user.tutorial) {
      this.props.router.push('/tutorial');
      return;
    }
    this.setState({match: true});
  }

  search() {
    if (this.isSearchDisabled()) {
      return;
    }

    this.interval();
    this.setState({searchingStartTime: +new Date()});
    this.connector.send({
      action: 'user:search',
      payload: {mode: this.state.mode}
    });
  }

  interval() {
    this.searchingTimer = setTimeout(() => {
      this.forceUpdate();
      if (this.state.searchingStartTime) {
        this.interval();
      }
    }, 1000);
  }

  stop() {
    this.connector.send({action: 'user:stop_search'});
    this.clear();
  }

  clear() {
    clearTimeout(this.searchingTimer);
    this.setState({
      searchingStartTime: null,
      ffa: {
        waiting: '?',
        total: '?'
      }
    });
  }

  handleInputFocus(event) {
    this.setState({warning: true});
  }

  handleChatHandler(event) {
    const chat = !this.state.chat;
    this.setState({chat});
    if (chat) {
      this.setState({unread: 0});
    }
    event.stopPropagation();
  }

  receivedMsg() {
    const { chat, unread } = this.state;
    if (!chat) {
      this.setState({unread: unread + 1});
    }
  }

  close() {
    this.setState({match: false, warning: false});
  }

  selectMode(mode) {
    this.setState({mode});
  }

  login() {
    this.close();
    PubSub.publish('modal:login');
  }

  userPanel() {
    this.close();
    PubSub.publish('modal:user');
  }

  isSearchDisabled() {
    const { mode } = this.state;
    const teamId = this.user.getTeamId();
    if (!mode) {
      return true;
    }
    if (mode === '2v2' && !teamId) {
      return true;
    }
    if (mode !== '2v2' && teamId) {
      return true;
    }
    return false;
  }

  renderPlay() {
    const { searchingStartTime } = this.state;
    if (searchingStartTime) {
      const totalSecPast = Math.floor((+new Date() - searchingStartTime) / 1000);
      const sec = (totalSecPast % 60 < 10 ? '0' : '') + (totalSecPast % 60);
      this.searchingTime = `${Math.floor(totalSecPast / 60)}:${sec}`;
    }
    if (!this.state.match) {
      return null;
    }
    return (
      <Modal className="main-menu-play-modal"
        onClose={this.close.bind(this)}
        title={searchingStartTime ? 'Finding' : 'Choose game mode'}>
        {
          searchingStartTime &&
          <div>
            <h3>Searching for a competitor <span>{this.searchingTime}</span></h3>
            {
              this.state.mode === 'ffa' &&
              <p className="modal-message">匹配进度： {this.state.ffa.waiting} / {this.state.ffa.total}</p>
            }
            <p className="modal-message">服务器 一 / 普通匹配 / {this.state.mode}</p>
            <div className="modal-footer clearfix">
              <div className="btn warning btn-stop" onClick={this.stop.bind(this)}>取消</div>
            </div>
          </div>
        }
        {
          !searchingStartTime &&
          <div>
            <h3>Single Mode</h3>
            <ul className="single-match">
              <li>
                <div className={classNames('btn', {selected: config.ai.easy === this.state.mode})}  onClick={() => this.selectMode(config.ai.easy)}>
                  Easy
                </div>
                <div className={classNames('btn', {selected: config.ai.normal === this.state.mode})}  onClick={() => this.selectMode(config.ai.normal)}>
                  Normal
                </div>
              </li>
            </ul>
            <h3>Online mode</h3>
            <ul style={{ display: 'flex' }}>
              <li>
                {Object.keys(config.modes).map(mode => {
                  return (
                    <div key={mode} className={classNames('btn', {selected: mode === this.state.mode})} onClick={() => this.selectMode(mode)}>
                      {mode}
                    </div>
                  );
                })}
              </li>
            </ul>
            <div className="modal-footer clearfix">
              <div className={classNames('btn', 'btn-match', 'inverted', {disabled: this.isSearchDisabled()})} onClick={this.search.bind(this)}>
                Start matching
              </div>
            </div>
          </div>
        }
      </Modal>
    );
  }

  render() {
    return (
      <div id="main-menu" className={classNames({open: this.state.chat})}>
        <div className="center">
          <h1 className="main-title">Generals.io</h1>
          <input type="text" className={classNames('main-menu-username-input', this.props.location.query.from)}
            onFocus={this.handleInputFocus.bind(this)}
            placeholder="visitor" value={this.user.getName()} readOnly />
          <div className="btn border btn-play" onClick={this.play.bind(this)}>
            {this.state.searchingStartTime ? `Finding a match ${this.searchingTime}` : 'Play'}
          </div>
          <div className="main-menu-intro">
            <p>Protect your general.</p>
            <p>Capture enemy generals.<img src="/images/crown_white.png" alt="crown" /></p>
            <p><strong>↑ → ↓ ←</strong> move your troops</p>
            <p>[space] cancel [Q] clear commands [E] clear last command</p>
            <p>[-] zoom out [+] zoom in</p>
            <p>single click = move 100% troops</p>
            <p>double clicks = move 50% troops</p>
          </div>
        </div>
        {this.renderPlay()}
        <MainBottomRight version={this.props.route.version} />
        <MainBottomLeft connector={this.connector} />
        <MainTopLeft />
      </div>
    );
  }

  onmessage({type, payload}) {
    switch (type) {
      case 'game:matched':
        this.clear();
        this.props.router.push({
          pathname: `/g/${payload.id}`,
          state: payload
        });
        break;
      case 'user:stop_search':
        this.stop();
        this.close();
        break;
      case 'user:searching':
        this.setState({ffa: payload});
        break;
      case 'team:search':
        this.interval();
        this.setState({
          mode: '2v2',
          searchingStartTime: +new Date()
        });
        break;
      default:
        break;
    }
  }
}

export default MainMenu;
