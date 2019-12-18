import config from '../config';

class Config {
  constructor() {
    Object.assign(this, config);

    this.colorsCls = this.colors.join(' ');
    this.tilesCls = this.tiles.join(' ');
  }
}

export default new Config();
