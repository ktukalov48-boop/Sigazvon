document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  // элементы входа
  const login = document.getElementById('login');
  const nicknameInput = document.getElementById('nickname');
  const joinBtn = document.getElementById('joinBtn');

  // элементы чата
  const chat = document.getElementById('chat');
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  let nickname = '';

  // защита от отсутствующих элементов
  if (!login || !nicknameInput || !joinBtn || !chat) {
    console.error('Ошибка: отсутствуют элементы входа');
    return;
  }

  // вход
  joinBtn.addEventListener('click', () => {
    const value = nicknameInput.value.trim();
    if (!value) return;

    nickname = value;
    socket.emit('join', nickname);

    login.style.display = 'none';
chat.style.display = 'flex';
chat.classList.remove('hidden');
  });

  // отправка сообщений
  if (form && input && messages) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      socket.emit('message', text);
      input.value = '';
    });

    socket.on('message', (msg) => {
      const li = document.createElement('li');
      li.textContent = msg.user + ': ' + msg.text;
      messages.appendChild(li);
    });
  }
});
