alert('client.js подключен');
console.log('client.js подключён');

const socket = io();

const login = document.getElementById('login');
const chat = document.getElementById('chat');

const joinBtn = document.getElementById('joinBtn');
const nicknameInput = document.getElementById('nicknameInput');

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

const callTo = document.getElementById('callTo');
const callBtn = document.getElementById('callBtn');

const callModal = document.getElementById('callModal');
const callText = document.getElementById('callText');
const acceptCall = document.getElementById('acceptCall');
const rejectCall = document.getElementById('rejectCall');

let nickname = '';
let incomingFrom = null;

/* ВХОД */
joinBtn.onclick = () => {
  nickname = nicknameInput.value.trim();
  if (!nickname) return;

  socket.emit('join', nickname);
  login.classList.add('hidden');
  chat.classList.remove('hidden');
};

/* ЧАТ */
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!input.value) return;

  socket.emit('chat message', {
    user: nickname,
    text: input.value
  });

  input.value = '';
});

socket.on('chat message', data => {
  const li = document.createElement('li');
  li.textContent = `${data.user}: ${data.text}`;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

/* ЗВОНОК */
callBtn.onclick = () => {
  if (!callTo.value) return;
  socket.emit('call-user', { to: callTo.value, from: nickname });
};

socket.on('incoming-call', from => {
  incomingFrom = from;
  callText.textContent = `Входящий звонок от ${from}`;
  callModal.classList.add('active');
});

acceptCall.onclick = () => {
  socket.emit('accept-call', { to: incomingFrom, from: nickname });
  callModal.classList.remove('active');
  alert(`Вы приняли звонок от ${incomingFrom}`);
};

rejectCall.onclick = () => {
  callModal.classList.remove('active');
  incomingFrom = null;
};
