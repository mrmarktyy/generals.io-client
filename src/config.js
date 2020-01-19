export default {
  env: process.env.NODE_ENV,
  WS_URL: '127.0.0.1',
  WS_PORT: 20000,
  mobile: window.innerWidth <= 480,
  colors: [
    'red', 'blue', 'green', 'yellow',
    'purple', 'orange', 'sea', 'asphalt',
    'neutral'
  ],
  tiles: [
    'empty', 'mountain', 'fog',
    'obstacle', 'city', 'general'
  ],
  fonts: [ 6, 8, 10, 12, 14, 16 ],
  chat: {
    maxNumberOfCharactersAllowed: 30
  },
  modes: {
    'ffa': 'ffa mode',
    '1v1': '1v1 mode',
  },
  ai: {
    easy: 'ai:easy',
    normal: 'ai:normal'
  },
  audio: {
    matchStart: '/audios/play.mp3'
  },
  mailto: 'mrmarktyy@gmail.com'
};
