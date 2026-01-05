console.log('client.js подключён');

document.addEventListener('DOMContentLoaded', () => {
  const login = document.getElementById('login');
  const chat = document.getElementById('chat');
  const joinBtn = document.getElementById('joinBtn');
  const nicknameInput = document.getElementById('nickname');

  const socket = io();

  joinBtn.onclick = () => {
    const nickname = nicknameInput.value.trim();
    if (!nickname) return;

    login.classList.add('hidden');
    chat.classList.remove('hidden');

    console.log('Вход выполнен:', nickname);
  };
});
