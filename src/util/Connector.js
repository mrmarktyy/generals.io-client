export default class Connector {
  constructor(config) {
    this.config = config
    this.handlers = {
      onmessage: [],
      onopen: [],
      onclose: []
    }
    this.cachedMessages = []
    this.ready = false
    this.connect()
  }

  bind (eventType, handler) {
    this.handlers[eventType].push(handler)
    return () => this.unbind(eventType, handler)
  }

  unbind (eventType, handler) {
    const index = this.handlers[eventType].indexOf(handler)
    if (index >= 0) {
      this.handlers[eventType].splice(index, 1)
    }
  }

  connect() {
    this.ws = new WebSocket(`ws://${this.config.WS_URL}:${this.config.WS_PORT}`)
    this.ws.onopen = this.onopen.bind(this)
    this.ws.onmessage = this.onmessage.bind(this)
    this.ws.onclose = this.onclose.bind(this)
    this.ws.onerror = this.onclose.bind(this)
  }

  reconnect() {
    this.ws && this.ws.close()
    this.connect()
  }

  send(data) {
    if (!this.ready) {
      this.cachedMessages.push(data)
      return
    }
    this.ws.send(JSON.stringify(data))
  }

  onopen(...args) {
    this.ready = true
    this.cachedMessages.forEach(data => this.send(data))
    this.handlers.onopen.forEach(handler => handler(...args))
  }

  onmessage(message) {
    const data = JSON.parse(message.data)
    this.handlers.onmessage.forEach(handler => handler(data))
  }

  onclose(...args) {
    this.ready = false
    this.handlers.onclose.forEach(handler => handler(...args))
  }
}
