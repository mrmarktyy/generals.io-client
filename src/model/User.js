import PubSub from 'pubsub-js';

class User {
  constructor(config) {
    this.config = config;
    this.synced = false;

    this.load();
    this.applyZoom();
  }

  load() {
    this.vid = localStorage.getItem('vid');
    this.name = localStorage.getItem('username') || 'unnamed';
    this.levels = JSON.parse(localStorage.getItem('new_levels')) || {
      '1v1': {lvl: 1000, n: 0, w: 0, r: null},
      'ffa': {lvl: 1000, n: 0, w: 0, r: null},
      '2v2': {lvl: 1000, n: 0, w: 0, r: null}
    };

    this.zoom = localStorage.getItem('zoom') || 2;
    this.tutorial = JSON.parse(localStorage.getItem('completed_tutorial'));
    this.is_visitor = true;
    this.team_id = null;
    this.team_mates = [];
    this.friends = [];
    this.applications = [];
  }

  set({id, vid, name, is_visitor, levels, friends, applications}) {
    Object.assign(this, {id, vid, name, is_visitor, levels, friends, applications})

    this.save();
    PubSub.publish('user:update');
  }

  sendInit(from) {
    this.connector.send({
      action: 'user:init',
      payload: {vid: this.getVid(), from}
    });
  }

  bind(connector) {
    this.connector = connector;
    this.connector.bind('onmessage', this.onmessage.bind(this));
  }

  onmessage({type, payload}) {
    switch (type) {
      case 'user:sync':
        this.synced = true;
        this.set(payload);
        break;
      case 'team:create':
        this.team_id = payload.id;
        this.team_mates = payload.mates;
        PubSub.publish('user:update');
        break;
      case 'team:leave':
        this.team_id = null;
        this.team_mates = [];
        PubSub.publish('user:update');
        break;
      default:
        break;
    }
  }

  changes({action, id}) {
    const friend = this.friends.find(friend => friend.id === id);
    if (friend) {
      if (action === 'join') {
        friend.online = true;
      } else if (action === 'leave') {
        friend.online = false;
      }
      PubSub.publish('user:update');
    }
  }

  save() {
    localStorage.setItem('vid', this.getVid());
    localStorage.setItem('username', this.getName());
    localStorage.setItem('new_levels', JSON.stringify(this.getLevels()));
    localStorage.setItem('zoom', this.zoom);
    localStorage.setItem('completed_tutorial', this.tutorial);
  }

  logout() {
    localStorage.removeItem('vid');
    localStorage.removeItem('username');
    localStorage.removeItem('new_levels');
    localStorage.removeItem('levels');
    localStorage.removeItem('rank');

    window.location.reload(true);
  }

  getId() {
    return this.id;
  }

  getVid() {
    return this.vid;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getLevels() {
    return this.levels;
  }

  getWinRate(mode) {
    const level = this.levels[mode];
    if (!level || level.n === 0) {
      return `0胜 / 0负 (0%)`;
    }
    return `${level.w}胜 / ${level.n - level.w}负 (${Math.round(100 * level.w / level.n)}%)`;
  }

  getTeams() {
    return {
      id: this.team_id,
      mates: this.team_mates
    };
  }

  getTeamId() {
    return this.team_id;
  }

  isSynced() {
    return this.isSynced;
  }

  setTutorial(flag) {
    this.tutorial = flag;
    localStorage.setItem('completed_tutorial', this.tutorial);
  }

  loggedin() {
    return !this.is_visitor;
  }

  getZoom() {
    return this.zoom;
  }

  applyZoom() {
    if (this.zoom >= this.config.fonts.length) {
      this.zoom = this.config.fonts.length - 1;
    } else if (this.zoom < 0) {
      this.zoom = 0;
    }
    document.body.className = document.body.className.replace(/\s?z_\d*/g, '');
    document.body.className += ' z_' + this.config.fonts[this.zoom];
  }

  incZoom() {
    this.zoom++;
    this.applyZoom();
    localStorage.setItem('zoom', this.zoom);
  }

  decZoom() {
    this.zoom--;
    this.applyZoom();
    localStorage.setItem('zoom', this.zoom);
  }
}

export default User;
