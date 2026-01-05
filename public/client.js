document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const login = document.getElementById('login');
  const chat = document.getElementById('chat');
  const joinBtn = document.getElementById('join');
  const nicknameInput = document.getElementById('nickname');

  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');
  const callBtn = document.getElementById('call');

  const callModal = document.getElementById('callModal');
  const callText = document.getElementById('callText');
  const acceptCall = document.getElementById('acceptCall');
  const rejectCall = document.getElementById('rejectCall');

  let nickname = localStorage.getItem('nickname');
  let incomingFrom = null;

  if (nickname) {
    login.hidden = true;
    chat.hidden = false;
    socket.emit('join', nickname);
  }

  joinBtn.onclick = () => {
    nickname = nicknameInput.value.trim();
    if (!nickname) return;

    localStorage.setItem('nickname', nickname);
    socket.emit('join', nickname);

    login.hidden = true;
    chat.hidden = false;
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
    li.className = msg.nickname === nickname ? 'me' : '';
    li.innerHTML = `
      <span class="nick">${msg.nickname}</span>
      <div class="bubble">${msg.text}</div>
    `;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
  });

  // 📞 ЗВОНОК
  callBtn.onclick = () => {
    const to = prompt('Кому позвонить? (ник)');
    if (!to) return;

    socket.emit('call-user', { to, from: nickname });
  };

  socket.on('incoming-call', from => {
    incomingFrom = from;
    callText.textContent = `Входящий звонок от ${from}`;
    callModal.hidden = false;
  });

  acceptCall.onclick = () => {
    socket.emit('accept-call', { to: incomingFrom, from: nickname });
    callModal.hidden = true;
    alert('Звонок принят (следующий шаг — WebRTC)');
  };

  rejectCall.onclick = () => {
    callModal.hidden = true;
    incomingFrom = null;
  };

  socket.on('call-accepted', from => {
    alert(`${from} принял звонок`);
  });
});
