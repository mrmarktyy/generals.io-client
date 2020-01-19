import PubSub from 'pubsub-js';

class User {
  constructor(config) {
    this.config = config

    this.load()
    this.applyZoom()
  }

  load() {
    this.name = localStorage.getItem('username') || 'unnamed'
    this.zoom = localStorage.getItem('zoom') || 2
    this.tutorial = JSON.parse(localStorage.getItem('completed_tutorial'))
  }

  set(payload) {
    Object.assign(this, payload)

    this.save()
    PubSub.publish('user:update')
  }

  sendInit () {
    this.connector.send({ action: 'user:init' })
  }

  bind(connector) {
    this.connector = connector
    this.connector.bind('onmessage', this.onmessage.bind(this))
  }

  onmessage({type, payload}) {
    switch (type) {
      case 'user:sync':
        this.synced = true
        this.set(payload)
        break
      default:
        break
    }
  }

  save() {
    localStorage.setItem('username', this.getName())
    localStorage.setItem('zoom', this.zoom)
    localStorage.setItem('completed_tutorial', this.tutorial)
  }

  logout() {
    localStorage.removeItem('username')
    window.location.reload(true)
  }

  getId() {
    return this.id
  }

  getName() {
    return this.name
  }

  setName(name) {
    this.name = name
  }

  setTutorial(flag) {
    this.tutorial = flag;
    localStorage.setItem('completed_tutorial', this.tutorial)
  }

  getZoom() {
    return this.zoom
  }

  applyZoom() {
    if (this.zoom >= this.config.fonts.length) {
      this.zoom = this.config.fonts.length - 1
    } else if (this.zoom < 0) {
      this.zoom = 0
    }
    document.body.className = document.body.className.replace(/\s?z_\d*/g, '')
    document.body.className += ' z_' + this.config.fonts[this.zoom]
  }

  incZoom() {
    this.zoom++
    this.applyZoom()
    localStorage.setItem('zoom', this.zoom)
  }

  decZoom() {
    this.zoom--;
    this.applyZoom();
    localStorage.setItem('zoom', this.zoom);
  }
}

export default User;
