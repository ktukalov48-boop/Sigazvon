document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const login = document.getElementById('login');
  const chat = document.getElementById('chat');
  const loginBtn = document.getElementById('loginBtn');
  const nicknameInput = document.getElementById('nickname');

  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  const openSearch = document.getElementById('openSearch');
  const chatScreen = document.getElementById('chatScreen');
  const searchScreen = document.getElementById('searchScreen');

  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  let nickname = '';

  loginBtn.onclick = () => {
    nickname = nicknameInput.value.trim();
    if (!nickname) return;

    socket.emit('join', nickname);
    login.classList.add('hidden');
    chat.classList.remove('hidden');
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!input.value.trim()) return;

    socket.emit('message', input.value);
    input.value = '';
  });

  socket.on('message', msg => {
    const li = document.createElement('li');
    li.className = 'message';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = msg.user[0].toUpperCase();

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = msg.text;

    li.appendChild(avatar);
    li.appendChild(bubble);

    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
  });

  openSearch.onclick = () => {
    chatScreen.classList.remove('active');
    searchScreen.classList.add('active');
  };

  searchInput.oninput = () => {
    socket.emit('search users', searchInput.value);
  };

  socket.on('search results', users => {
    searchResults.innerHTML = '';
    users.forEach(u => {
      const li = document.createElement('li');
      li.textContent = u;
      searchResults.appendChild(li);
    });
  });
});
