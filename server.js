const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Подключился:', socket.id);

  socket.on('join', (nickname) => {
    if (typeof nickname !== 'string' || !nickname.trim()) return;
    socket.nickname = nickname.trim();
    console.log(`Вошёл: ${socket.nickname}`);
  });

  socket.on('message', (text) => {
    if (!socket.nickname) return;
    if (typeof text !== 'string' || !text.trim()) return;

    io.emit('message', {
      user: socket.nickname,
      text: text.trim()
    });
  });

  socket.on('disconnect', () => {
    console.log('Отключился:', socket.nickname || socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Sigazvon запущен: http://localhost:${PORT}`);
});
