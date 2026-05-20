// ========================
// Hero Canvas: Particle Network
// ========================
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;
  const COUNT = 80;
  const ACCENT = [124, 110, 245];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 2 + 1;
    this.a  = Math.random() * 0.6 + 0.2;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${p.a})`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${(1 - dist / 140) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); });
})();

// ========================
// Typewriter Effect
// ========================
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = [
    'fast web apps.',
    'clean APIs.',
    'pixel-perfect UIs.',
    'open-source tools.',
    'scalable backends.',
  ];
  let wi = 0, ci = 0, deleting = false, wait = 0;

  function tick() {
    const word = words[wi];
    if (deleting) {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci <= 0) { deleting = false; wi = (wi + 1) % words.length; wait = 500; }
    } else {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci >= word.length) { deleting = true; wait = 1800; }
    }
    const speed = deleting ? 45 : 80;
    setTimeout(tick, wait || speed);
    wait = 0;
  }
  setTimeout(tick, 800);
})();

// ========================
// Navigation: scroll + mobile toggle
// ========================
(function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links  = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  toggle && toggle.addEventListener('click', () => {
    links.classList.toggle('mobile-open');
  });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('mobile-open'));
  });
})();

// ========================
// Scroll Reveal
// ========================
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
})();

// ========================
// Counter Animation
// ========================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el    = e.target;
        const end   = parseInt(el.dataset.count, 10);
        const dur   = 1600;
        const start = performance.now();
        function step(now) {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(ease * end);
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

// ========================
// Skills bar animation
// ========================
(function initSkillBars() {
  const fills = document.querySelectorAll('.tb-fill[data-w]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => io.observe(f));
})();

// ========================
// Demo 1: Animations
// ========================
(function initAnimDemo() {
  const btn  = document.getElementById('runAnimations');
  const box1 = document.getElementById('animBox1');
  const box2 = document.getElementById('animBox2');
  const box3 = document.getElementById('animBox3');
  const box4 = document.getElementById('animBox4');
  if (!btn) return;

  const classes = ['anim-fade', 'anim-slide', 'anim-scale', 'anim-spin'];
  const boxes   = [box1, box2, box3, box4];

  function reset() {
    boxes.forEach((b, i) => {
      b.classList.remove(classes[i]);
      void b.offsetWidth;
    });
  }

  btn.addEventListener('click', () => {
    reset();
    requestAnimationFrame(() => {
      boxes.forEach((b, i) => b.classList.add(classes[i]));
    });
  });

  // Auto-run once visible
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      reset();
      requestAnimationFrame(() => {
        boxes.forEach((b, i) => b.classList.add(classes[i]));
      });
      io.disconnect();
    }
  }, { threshold: 0.5 });
  io.observe(document.getElementById('demoAnimations'));
})();

// ========================
// Demo 2: Sorting Visualizer
// ========================
(function initSortDemo() {
  const container = document.getElementById('sortBars');
  const shuffleBtn = document.getElementById('shuffleBars');
  const sortBtn    = document.getElementById('sortBarsBtn');
  if (!container) return;

  const N = 20;
  let arr = [], sorting = false;

  function randomArr() {
    return Array.from({ length: N }, () => Math.floor(Math.random() * 90) + 10);
  }

  function render(highlights = {}) {
    container.innerHTML = '';
    arr.forEach((v, i) => {
      const bar = document.createElement('div');
      bar.className = 'sort-bar';
      bar.style.height = v + '%';
      if (highlights[i] === 'comparing') bar.classList.add('comparing');
      if (highlights[i] === 'sorted')    bar.classList.add('sorted');
      container.appendChild(bar);
    });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function bubbleSort() {
    sorting = true;
    sortBtn.disabled = shuffleBtn.disabled = true;
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        render({ [j]: 'comparing', [j + 1]: 'comparing' });
        await sleep(60);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    const done = {};
    arr.forEach((_, i) => { done[i] = 'sorted'; });
    render(done);
    sorting = false;
    sortBtn.disabled = shuffleBtn.disabled = false;
  }

  arr = randomArr();
  render();

  shuffleBtn.addEventListener('click', () => {
    if (sorting) return;
    arr = randomArr();
    render();
  });

  sortBtn.addEventListener('click', () => {
    if (sorting) return;
    bubbleSort();
  });
})();

// ========================
// Demo 4: Theme Toggle
// ========================
(function initThemeDemo() {
  const btn   = document.getElementById('toggleTheme');
  const card  = document.getElementById('themeCard');
  if (!btn) return;
  let dark = false;
  btn.addEventListener('click', () => {
    dark = !dark;
    card.classList.toggle('dark-preview', dark);
    btn.textContent = dark ? 'Toggle Light Mode' : 'Toggle Dark Mode';
  });
})();

// ========================
// Demo 3: Alumni Chat
// ========================
(function initChatDemo() {
  const messages = document.getElementById('chatMessages');
  const input = document.getElementById('chatInput');
  const send = document.getElementById('chatSend');
  if (!messages || !input || !send) return;

  const replies = [
    'Great question! The next alumni meetup is this Saturday at 5 PM.',
    'Mentorship sign-ups are open. I can share the form if you want.',
    'You can browse alumni profiles by graduation year or industry.',
    'Thanks for reaching out! I will get you the details shortly.',
  ];
  let replyIndex = 0;

  function addMessage(text, role) {
    const row = document.createElement('div');
    row.className = `chat-message ${role}`;
    const bubble = document.createElement('span');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
    return row;
  }

  function addTyping() {
    const row = addMessage('Typing...', 'bot');
    row.classList.add('typing');
    return row;
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    input.focus();

    const typingRow = addTyping();
    setTimeout(() => {
      if (typingRow && typingRow.parentNode) typingRow.remove();
      const reply = replies[replyIndex % replies.length];
      replyIndex += 1;
      addMessage(reply, 'bot');
    }, 600);
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });
})();

// ========================
// Demo 5: Job Tracker
// ========================
(function initTrackerDemo() {
  const status = document.getElementById('trackerStatus');
  const card = document.getElementById('trackerActive');
  const btn = document.getElementById('trackerAdvance');
  if (!status || !card || !btn) return;

  const stages = [
    { label: 'Screening', className: '' },
    { label: 'Technical', className: 'stage-warn' },
    { label: 'Final Round', className: '' },
    { label: 'Offer Pending', className: 'stage-success' },
  ];
  let index = 0;

  function applyStage() {
    const stage = stages[index];
    status.textContent = stage.label;
    card.classList.remove('stage-warn', 'stage-success');
    if (stage.className) card.classList.add(stage.className);
  }

  btn.addEventListener('click', () => {
    index = (index + 1) % stages.length;
    applyStage();
  });

  applyStage();
})();

// ========================
// Contact Form
// ========================
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitText = document.getElementById('submitText');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    submitText.textContent = 'Sending…';
    setTimeout(() => {
      submitText.textContent = 'Send Message';
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1200);
  });
})();
