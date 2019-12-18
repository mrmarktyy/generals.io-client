import PubSub from 'pubsub-js';

class ScrollHandler {
  constructor(updateState) {
    this.moving = false;
    this.oldX = 0;
    this.oldY = 0;
    this.position = {x: 0, y: 0};
    this._mousedown = this.mousedown.bind(this);
    this._mousemove = this.mousemove.bind(this);
    this._mouseup = this.mouseup.bind(this);
    this.updateState = updateState;
  }

  getClientCoordinates(event) {
    return {
      x: event.clientX || event.changedTouches[0].clientX,
      y: event.clientY || event.changedTouches[0].clientY
    };
  }

  mousedown(event) {
    this.moving = true;
    const { x, y } = this.getClientCoordinates(event);
    this.oldX = x;
    this.oldY = y;

    event.stopPropagation();
    event.preventDefault();
  }

  mousemove(event) {
    if (!this.moving) return;

    const { x, y } = this.getClientCoordinates(event);
    this.position.x += x - this.oldX;
    this.position.y += y - this.oldY;

    this.oldX = x;
    this.oldY = y;

    this.updateState({last_updated: +new Date()});
    PubSub.publish('scroll:position');

    event.stopPropagation();
    event.preventDefault();
  }

  mouseup(event) {
    this.moving = false;

    event.stopPropagation();
    event.preventDefault();
  }

  getPosition() {
    return this.position;
  }

  setPosition(position) {
    this.position = position;
  }
}

export default ScrollHandler;
