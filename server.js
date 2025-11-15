const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs-extra');

// Minimal, robust server entrypoint to ensure process stays alive on Render.
// Serves static files in the repo and exposes a simple socket.io echo for smoke tests.

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = Number(process.env.PORT) || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', pid: process.pid });
});

// Basic users file loader (non-blocking, best-effort)
const USERS_FILE = path.join(__dirname, 'users.json');
let users = {};
try {
  if (fs.existsSync(USERS_FILE)) users = fs.readJsonSync(USERS_FILE);
} catch (e) {
  console.error('Failed to read users.json (non-fatal):', e && e.stack ? e.stack : e);
}

io.on('connection', (socket) => {
  console.log('[SOCKET] connected', socket.id);
  socket.emit('serverMessage', { text: 'Welcome (minimal server)', from: 'server' });

  socket.on('ping', () => socket.emit('pong'));
  socket.on('disconnect', () => console.log('[SOCKET] disconnected', socket.id));
});

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err && err.stack ? err.stack : err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled Rejection:', reason && reason.stack ? reason.stack : reason);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`✅ Minimal server listening on port ${PORT}`);
});

module.exports = { app, server, io };
