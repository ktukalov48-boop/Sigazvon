const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const users = {};

app.use(express.static('public'));

io.on('connection', socket => {
  console.log('Пользователь подключился');

  socket.on('join', nickname => {
    users[nickname] = socket.id;
  });

  socket.on('chat message', data => {
    io.emit('chat message', data);
  });

  socket.on('call-user', ({ to, from }) => {
    if (users[to]) {
      io.to(users[to]).emit('incoming-call', from);
    }
  });

  socket.on('accept-call', ({ to, from }) => {
    if (users[to]) {
      io.to(users[to]).emit('call-accepted', from);
    }
  });

  socket.on('disconnect', () => {
    for (const name in users) {
      if (users[name] === socket.id) {
        delete users[name];
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Sigazvon запущен на порту ${PORT}`);
});