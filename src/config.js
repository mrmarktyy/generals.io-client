export default {
  env: process.env.NODE_ENV,
  WS_URL: process.env.NODE_ENV === 'development' ? '127.0.0.1' : '54.79.4.48',
  WS_PORT: 20000,
  mobile: window.innerWidth <= 480,
  API: 'http://api.tantanguanguan.com',
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
    maximumNumberofMessages: 50,
    maxNumberOfCharactersAllowed: 30
  },
  modes: {
    // 'ffa': 'ffa mode',
    '1v1': '1v1 mode',
    // '2v2': '2v2 mode'
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
