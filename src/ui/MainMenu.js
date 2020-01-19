import React, { Component } from 'react'
import classnames from 'classnames'
import PubSub from 'pubsub-js'

import './main-menu.css'
import config from '../util/Config'
import Modal from '../util/Modal'

import MainBottomRight from './MainBottomRight'
import MainBottomLeft from './MainBottomLeft'

class MainMenu extends Component {
  constructor(props) {
    super(props)

    this.user = props.route.user
    this.connector = props.route.connector
    this.unbind = this.connector.bind('onmessage', this.onmessage.bind(this))
    this.searchingTimer = null
    this.searchingTime = ''
    this.state = {
      name: this.user.getName(),
      mode: null,
      match: false,
      unread: 0,
      searchingStartTime: null,
      ffa: {
        waiting: '?',
        total: '?'
      }
    }

    this.subscribe = PubSub.subscribe('user:update', () => this.forceUpdate())
  }

  componentWillUnmount() {
    if (this.state.searchingStartTime) {
      this.stop()
    } else {
      this.clear()
    }
    this.unbind()
    PubSub.unsubscribe(this.subscribe)
  }

  play() {
    if (!this.user.tutorial) {
      this.props.router.push('/tutorial')
      return
    }
    this.setState({match: true})
  }

  search() {
    if (!this.state.mode) return

    this.interval()
    this.setState({ searchingStartTime: +new Date() })
    this.connector.send({
      action: 'user:search',
      payload: { mode: this.state.mode }
    })
  }

  interval() {
    this.searchingTimer = setTimeout(() => {
      this.forceUpdate()
      if (this.state.searchingStartTime) {
        this.interval()
      }
    }, 1000)
  }

  stop = () => {
    this.connector.send({action: 'user:stop_search'})
    this.clear()
  }

  clear() {
    clearTimeout(this.searchingTimer)
    this.setState({
      searchingStartTime: null,
      ffa: {
        waiting: '?',
        total: '?'
      }
    })
  }

  close = () => {
    this.setState({ match: false })
  }

  onNameChange = e => {
    const name = e.target.value
    this.setState({ name })
    this.connector.send({
      action: 'user:update:name',
      payload: name,
    })
  }

  renderPlay() {
    const { searchingStartTime } = this.state
    if (searchingStartTime) {
      const totalSecPast = Math.floor((+new Date() - searchingStartTime) / 1000)
      const sec = (totalSecPast % 60 < 10 ? '0' : '') + (totalSecPast % 60)
      this.searchingTime = `${Math.floor(totalSecPast / 60)}:${sec}`
    }
    if (!this.state.match) return null
    return (
      <Modal className="main-menu-play-modal"
        onClose={this.close}
        title={searchingStartTime ? 'Finding' : 'Choose Mode'}>
        {
          searchingStartTime &&
          <div>
            <h3>Searching for a competitor <span>{this.searchingTime}</span></h3>
            {
              this.state.mode === 'ffa' &&
              <p className="modal-message">Matching progress： {this.state.ffa.waiting} / {this.state.ffa.total}</p>
            }
            <div className="modal-footer clearfix">
              <div className="btn warning btn-stop" onClick={this.stop}>Cancel</div>
            </div>
          </div>
        }
        {
          !searchingStartTime &&
          <div>
            <h3>Play with AI</h3>
            <ul className="single-match">
              <li>
                <div className={classnames('btn', {selected: config.ai.easy === this.state.mode})} onClick={() => this.setState({ mode: config.ai.easy })}>
                  Easy
                </div>
                <div className={classnames('btn', {selected: config.ai.normal === this.state.mode})} onClick={() => this.setState({ mode: config.ai.normal })}>
                  Normal
                </div>
              </li>
            </ul>
            <h3>Online mode</h3>
            <ul style={{ display: 'flex' }}>
              <li>
                {Object.keys(config.modes).map(mode => {
                  return (
                    <div key={mode} className={classnames('btn', {selected: mode === this.state.mode})} onClick={() => this.setState({ mode })}>
                      {mode}
                    </div>
                  )
                })}
              </li>
            </ul>
            <div className="modal-footer clearfix">
              <div className={classnames('btn', 'btn-match', 'inverted', {disabled: !this.state.mode})} onClick={this.search.bind(this)}>
                Start matching
              </div>
            </div>
          </div>
        }
      </Modal>
    )
  }

  render() {
    return (
      <div id="main-menu">
        <div className="center">
          <h1 className="main-title">Generals</h1>
          <input type="text" className="main-menu-username-input"
            placeholder="visitor" value={this.state.name} onChange={this.onNameChange} />
          <div className="btn border btn-play" onClick={this.play.bind(this)}>
            {this.state.searchingStartTime ? `Finding a match ${this.searchingTime}` : 'Play'}
          </div>
          <div className="main-menu-intro">
            <p>Protect your general. Capture enemy generals.</p>
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
      </div>
    )
  }

  onmessage({ type, payload }) {
    switch (type) {
      case 'game:matched':
        this.clear()
        this.props.router.push({
          pathname: `/g/${payload.id}`,
          state: payload
        })
        break
      case 'user:searching':
        this.setState({ffa: payload})
        break
      default:
        break
    }
  }
}

export default MainMenu
