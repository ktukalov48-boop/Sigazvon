const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = new Set();

app.use(express.static('public'));

io.on('connection', socket => {
  socket.on('join', nickname => {
    socket.nickname = nickname;
    users.add(nickname);
  });

  socket.on('message', text => {
    if (!socket.nickname) return;

    io.emit('message', {
      user: socket.nickname,
      text
    });
  });

  socket.on('search users', query => {
    if (!query) return;
    const result = [...users].filter(u =>
      u.toLowerCase().includes(query.toLowerCase())
    );
    socket.emit('search results', result);
  });

  socket.on('disconnect', () => {
    users.delete(socket.nickname);
  });
});

server.listen(3000, () => {
  console.log('Sigazvon запущен: http://localhost:3000');
});
