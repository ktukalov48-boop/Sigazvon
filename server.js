const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const users = {}; // nickname -> socket.id

io.on('connection', socket => {
  console.log('Пользователь подключился');

  socket.on('join', nickname => {
    users[nickname] = socket.id;
    socket.nickname = nickname;
  });

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on('call-user', ({ to, from }) => {
    const target = users[to];
    if (target) {
      io.to(target).emit('incoming-call', from);
    }
  });

  socket.on('accept-call', ({ to, from }) => {
    const target = users[to];
    if (target) {
      io.to(target).emit('call-accepted', from);
    }
  });

  socket.on('disconnect', () => {
    if (socket.nickname) {
      delete users[socket.nickname];
    }
    console.log('Пользователь отключился');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Sigazvon запущен на порту ${PORT}`);
});
