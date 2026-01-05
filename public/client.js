document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  // ===== ЭЛЕМЕНТЫ =====
  const login = document.getElementById('login');
  const chat = document.getElementById('chat');
  const joinBtn = document.getElementById('join');
  const nicknameInput = document.getElementById('nickname');

  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  const callBtn = document.getElementById('call');
  const remoteAudio = document.getElementById('remoteAudio');

  // ===== НИКНЕЙМ =====
  let nickname = localStorage.getItem('nickname');

  if (nickname) {
    login.style.display = 'none';
    chat.style.display = 'flex';
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

  // ===== СООБЩЕНИЯ =====
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

  // ===== WEBRTC ЗВОНКИ =====
  let localStream;
  let peerConnection;

  const servers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  async function getAudio() {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  }

  function createPeer() {
    peerConnection = new RTCPeerConnection(servers);

    localStream.getTracks().forEach(track =>
      peerConnection.addTrack(track, localStream)
    );

    peerConnection.ontrack = event => {
      remoteAudio.srcObject = event.streams[0];
    };

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate);
      }
    };
  }

  // 📞 НАЧАТЬ ЗВОНОК
  callBtn.onclick = async () => {
    await getAudio();
    createPeer();

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit('call-offer', offer);
  };

  // 📥 ПРИНЯТЬ ЗВОНОК
  socket.on('call-offer', async offer => {
    await getAudio();
    createPeer();

    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit('call-answer', answer);
  });

  socket.on('call-answer', async answer => {
    await peerConnection.setRemoteDescription(answer);
  });

  socket.on('ice-candidate', async candidate => {
    if (peerConnection) {
      await peerConnection.addIceCandidate(candidate);
    }
  });
});
