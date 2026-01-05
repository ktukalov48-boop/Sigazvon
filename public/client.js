const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');


form.addEventListener('submit', (e) => {
e.preventDefault();
if (input.value) {
socket.emit('chat message', input.value);
input.value = '';
}
});


const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log('Sigazvon запущен');
});