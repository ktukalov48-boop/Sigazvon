document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  // ===== ЭЛЕМЕНТЫ ВХОДА =====
  const loginBtn = document.getElementById('loginBtn');
  const login = document.getElementById('login');
  const chat = document.getElementById('chat');
  const nicknameInput = document.getElementById('nickname');

  if (!loginBtn || !login || !chat || !nicknameInput) {
    console.error('❌ Ошибка: элементы входа не найдены');
    return;
  }

  let nickname = '';

  loginBtn.addEventListener('click', () => {
    if (!nicknameInput.value.trim()) return;

    nickname = nicknameInput.value.trim();

    login.classList.add('hidden');
    chat.classList.remove('hidden');
  });

  // ===== ЭЛЕМЕНТЫ ЧАТА =====
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  if (!form || !input || !messages) {
    console.error('❌ Ошибка: элементы чата не найдены');
    return;
  }

  // отправка сообщения
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.value) return;

    socket.emit('chat message', {
      user: nickname,
      text: input.value
    });

    input.value = '';
  });

  // получение сообщений
  socket.on('chat message', (msg) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
  });
});
