const io = require('socket.io-client');
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('connected', socket.id);
  socket.emit('login', { username: 'MINGAU', password: 'dev' });
});

socket.on('devMode', (isDev) => {
  console.log('devMode event:', isDev);
  process.exit(0);
});

socket.on('loginError', (msg) => {
  console.error('loginError:', msg);
  process.exit(1);
});

socket.on('connect_error', (err) => {
  console.error('connect_error', err.message);
  process.exit(2);
});
