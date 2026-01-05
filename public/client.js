const socket = io();

const login = document.getElementById('login');
const chat = document.getElementById('chat');
const joinBtn = document.getElementById('join');
const nicknameInput = document.getElementById('nickname');

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let nickname = localStorage.getItem('nickname');

if (nickname) {
  login.hidden = true;
  chat.hidden = false;
}

joinBtn.onclick = () => {
  const value = nicknameInput.value.trim();
  if (!value) return;

  nickname = value;
  localStorage.setItem('nickname', nickname);

  login.style.display = 'none';
  chat.style.display = 'flex';

  input.focus();
};

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!input.value) return;

  socket.emit('chat message', {
    text: input.value,
    nickname
  });

  input.value = '';
});

socket.on('chat message', msg => {
  const li = document.createElement('li');
  li.className = msg.nickname === nickname ? 'me' : 'other';

  li.innerHTML = `
    <span class="nick">${msg.nickname}</span>
    <div class="bubble">${msg.text}</div>
  `;

  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});