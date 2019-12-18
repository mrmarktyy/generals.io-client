import config from './Config';

class Notifier {
  constructor() {
    this.isVisible = true;

    if (typeof document.hidden !== 'undefined') {
      this.hidden = 'hidden';
      this.visibilityChange = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      this.hidden = 'msHidden';
      this.visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      this.hidden = 'webkitHidden';
      this.visibilityChange = 'webkitvisibilitychange';
    }
  }

  validate() {
    return window.Notification && Notification.permission !== 'denied';
  }

  init() {
    if (this.validate()) {
      Notification.requestPermission();

      if (typeof document[this.hidden] === 'undefined') {
        window.addEventListener('focus', () => this.isVisible = true, false);
        window.addEventListener('blur', () => this.isVisible = false, false);
      } else {
        document.addEventListener(this.visibilityChange, () => {
          this.isVisible = !document[this.hidden];
        }, false);

      }
    }
  }

  run() {
    new Audio(config.audio.matchStart).play();

    if (this.validate() && !this.isVisible) {
      const notice = new Notification('将军棋', {
        body: '游戏匹配完成，即将开始！',
        icon: '/images/favicon.png'
      });
      setTimeout(() => notice.close(), 5000);
    }
  }
}

export default new Notifier();
