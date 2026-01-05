const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


app.use(express.static('public'));


io.on('connection', (socket) => {
console.log('Пользователь подключился');


socket.on('chat message', (msg) => {
io.emit('chat message', msg);
});


socket.on('disconnect', () => {
console.log('Пользователь отключился');
});
});


http.listen(3000, () => {
console.log('Sigazvon запущен: http://localhost:3000');
});