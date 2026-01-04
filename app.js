/* ======================================
   APP.JS – SISTEM TERINTEGRASI (FINAL)
   SADARI + ACCORDION + CHAT (BOT + DOKTER)
====================================== */

(() => {

  /* ========= SADARI ========= */
  const steps = [
    { title: 'Observasi Visual', body: 'Berdiri di depan cermin dan amati perubahan bentuk, warna, atau lekukan pada payudara.' },
    { title: 'Angkat Lengan', body: 'Angkat kedua lengan dan perhatikan adanya tarikan kulit atau perbedaan bentuk.' },
    { title: 'Periksa Puting', body: 'Amati perubahan arah puting atau cairan yang keluar.' },
    { title: 'Perabaan', body: 'Raba seluruh payudara dengan gerakan memutar menggunakan bantalan jari.' },
    { title: 'Periksa Ketiak', body: 'Periksa area ketiak dan catat bila ada benjolan.' }
  ];

  const contentEl = document.getElementById('step-content');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  let current = 0;
  function renderStep(i) {
    const s = steps[i];
    contentEl.innerHTML = `<h4>${s.title}</h4><p>${s.body}</p>`;
    prevBtn.disabled = i === 0;
    progressBar.style.width = ((i + 1) / steps.length * 100) + '%';
    progressText.textContent = `Langkah ${i + 1} dari ${steps.length}`;
  }
  renderStep(current);

  prevBtn.onclick = () => { if (current > 0) renderStep(--current); };
  nextBtn.onclick = () => {
    if (current < steps.length - 1) renderStep(++current);
    else contentEl.innerHTML = `<p><b>Selesai.</b> Jika ada perubahan mencurigakan, segera konsultasi ke dokter.</p>`;
  };

  /* ========= ACCORDION ========= */
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.onclick = () => {
      const body = btn.nextElementSibling;
      const open = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.accordion-header').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.hidden = true;
      });
      btn.setAttribute('aria-expanded', !open);
      body.hidden = open;
    };
  });

  /* ========= CHAT SYSTEM ========= */
  const chatWindow = document.getElementById("chat-window");
  const qaForm = document.getElementById("qa-form");
  const questionInput = document.getElementById("question");
  const connectBtn = document.getElementById("connect-btn");
  const doctorDot = document.getElementById("doctor-dot");
  const doctorText = document.getElementById("doctor-text");

  const WS_URL = "wss://example.com"; // ganti jika ada backend
  let socket = null;
  let doctorOnline = false;

  function setDoctorStatus(status) {
    doctorOnline = status;
    doctorDot.className = status ? "dot online" : "dot offline";
    doctorText.textContent = status
      ? "Dokter online"
      : "Dokter tidak tersedia (Chatbot aktif)";
  }

  function addMessage(who, text) {
    const div = document.createElement("div");
    div.className = `chat ${who}`;
    div.textContent = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  /* ========= CHATBOT LOGIC ========= */
  function chatbotReply(msg) {
    msg = msg.toLowerCase();
    if (msg.includes("benjolan")) return "Benjolan tidak selalu kanker, tapi perlu diperiksa jika tidak hilang.";
    if (msg.includes("sadari")) return "SADARI dilakukan sebulan sekali, 7–10 hari setelah haid.";
    if (msg.includes("nyeri")) return "Nyeri biasanya hormonal, namun bila menetap sebaiknya konsultasi.";
    if (msg.includes("kanker")) return "Deteksi dini sangat meningkatkan peluang kesembuhan.";
    return "Terima kasih. Jika ragu, sebaiknya konsultasi langsung ke tenaga medis.";
  }

  /* ========= WEBSOCKET ========= */
  function connectDoctor() {
    try {
      socket = new WebSocket(WS_URL);
      socket.onopen = () => setDoctorStatus(true);
      socket.onclose = () => setDoctorStatus(false);
      socket.onerror = () => setDoctorStatus(false);
      socket.onmessage = e => addMessage("bot", e.data);
    } catch {
      setDoctorStatus(false);
    }
  }

  connectBtn.onclick = () => {
    addMessage("bot", "Mencoba menghubungkan ke dokter...");
    connectDoctor();
  };

  /* ========= FORM SUBMIT ========= */
  qaForm.onsubmit = (e) => {
    e.preventDefault();
    const msg = questionInput.value.trim();
    if (!msg) return;

    addMessage("user", msg);

    if (doctorOnline && socket.readyState === 1) {
      socket.send(msg);
    } else {
      setTimeout(() => addMessage("bot", chatbotReply(msg)), 600);
    }

    qaForm.reset();
  };

  /* ========= GREETING ========= */
  setTimeout(() => {
    setDoctorStatus(false);
    addMessage("bot", "Halo 👋 Saya asisten edukasi kesehatan payudara. Silakan ajukan pertanyaan Anda.");
  }, 500);

})();
