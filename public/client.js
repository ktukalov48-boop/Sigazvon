document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  // элементы
  const login = document.getElementById('login');
  const chat = document.getElementById('chat');
  const loginBtn = document.getElementById('loginBtn');
  const nicknameInput = document.getElementById('nickname');

  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  let nickname = '';

  // вход
  loginBtn.addEventListener('click', () => {
    nickname = nicknameInput.value.trim();
    if (!nickname) return;

    socket.emit('join', nickname);

    login.classList.add('hidden');
    chat.classList.remove('hidden');
  });

  // отправка сообщения
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.value.trim()) return;

    socket.emit('message', input.value.trim());
    input.value = '';
  });
// получение сообщений
socket.on('message', (msg) => {
  const li = document.createElement('li');

  const avatar = document.createElement('div');
  avatar.classList.add('avatar');
  avatar.textContent = msg.user[0].toUpperCase();

  const content = document.createElement('div');
  content.classList.add('content');

  const user = document.createElement('span');
  user.classList.add('user');
  user.textContent = msg.user;

  const text = document.createElement('span');
  text.classList.add('text');
  text.textContent = msg.text;

  content.appendChild(user);
  content.appendChild(text);

  li.appendChild(avatar);
  li.appendChild(content);

  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

});