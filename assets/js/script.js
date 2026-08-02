(() => {
  'use strict';

  const EVENT = {
    title: "Aishwarya & Laxmi Narayen — Engagement Celebration",
    startISO: "2026-09-13T09:00:00+05:30",
    endISO: "2026-09-13T10:00:00+05:30",
    location: "Panigraha Kalyana Mandapam, 9/A, Aryagowda Rd, Gokulam Colony, Ramakrishnapuram, West Mambalam, Chennai, Tamil Nadu 600033",
    description: "Join us for the Engagement Celebration of Aishwarya & Laxmi Narayen."
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- */
  /* Randomize name order in a few spots, independently, each load     */
  /* ---------------------------------------------------------------- */
  function maybeSwapNames(idFirst, idSecond) {
    const first = document.getElementById(idFirst);
    const second = document.getElementById(idSecond);
    if (!first || !second) return;
    if (Math.random() < 0.5) {
      const tmp = first.textContent;
      first.textContent = second.textContent;
      second.textContent = tmp;
    }
  }
  maybeSwapNames('envelope-name-a', 'envelope-name-b');
  maybeSwapNames('hero-name-first', 'hero-name-second');
  maybeSwapNames('footer-name-first', 'footer-name-second');

  /* ---------------------------------------------------------------- */
  /* Envelope intro                                                    */
  /* ---------------------------------------------------------------- */
  const envelopeScreen = document.getElementById('envelope-screen');
  const invitation = document.getElementById('invitation');

  function openInvitation() {
    if (envelopeScreen.classList.contains('opening')) return;
    envelopeScreen.classList.add('opening');
    invitation.classList.add('visible');
    startPetals();
    scheduleMusicKickoff();
    setTimeout(() => {
      envelopeScreen.classList.add('opened');
    }, 750);
  }

  envelopeScreen.addEventListener('click', openInvitation);
  envelopeScreen.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openInvitation();
  });

  /* ---------------------------------------------------------------- */
  /* Scroll reveal                                                     */
  /* ---------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach((el) => io.observe(el));

  /* ---------------------------------------------------------------- */
  /* Countdown                                                         */
  /* ---------------------------------------------------------------- */
  const target = new Date(EVENT.startISO).getTime();
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function tickCountdown() {
    const diff = target - Date.now();
    if (diff <= 0) {
      els.days.textContent = '00';
      els.hours.textContent = '00';
      els.mins.textContent = '00';
      els.secs.textContent = '00';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent = pad(mins);
    els.secs.textContent = pad(secs);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------------------------------------------------------------- */
  /* Add to calendar (.ics download)                                   */
  /* ---------------------------------------------------------------- */
  function toICSDate(iso) {
    const d = new Date(iso);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  document.getElementById('add-calendar').addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aishwarya and Laxmi Narayen//Engagement//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@engagement-invite`,
      `DTSTAMP:${toICSDate(new Date().toISOString())}`,
      `DTSTART:${toICSDate(EVENT.startISO)}`,
      `DTEND:${toICSDate(EVENT.endISO)}`,
      `SUMMARY:${EVENT.title}`,
      `DESCRIPTION:${EVENT.description}`,
      `LOCATION:${EVENT.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aishwarya-laxminarayen-engagement.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Event added to your calendar file ✓');
  });

  /* ---------------------------------------------------------------- */
  /* Directions + copy address                                         */
  /* ---------------------------------------------------------------- */
  const mapsQuery = encodeURIComponent(EVENT.location);
  document.getElementById('get-directions').href =
    `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

  document.getElementById('copy-address').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EVENT.location);
      showToast('Address copied ✓');
    } catch {
      showToast('Copy failed — please copy manually');
    }
  });

  /* ---------------------------------------------------------------- */
  /* QR lightbox                                                       */
  /* ---------------------------------------------------------------- */
  const lightbox = document.getElementById('qr-lightbox');
  const qrOpen = document.getElementById('qr-open');
  function openQrLightbox() {
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  qrOpen.addEventListener('click', openQrLightbox);
  qrOpen.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openQrLightbox();
    }
  });
  document.getElementById('qr-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  /* ---------------------------------------------------------------- */
  /* Share                                                              */
  /* ---------------------------------------------------------------- */
  document.getElementById('share-btn').addEventListener('click', async () => {
    const shareData = {
      title: EVENT.title,
      text: "You're invited! Aishwarya & Laxmi Narayen's Engagement Celebration — 13th September 2026, 9:00 AM IST, Chennai.",
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Invitation link copied ✓');
      } catch {
        showToast('Unable to share on this device');
      }
    }
  });

  /* ---------------------------------------------------------------- */
  /* Toast                                                              */
  /* ---------------------------------------------------------------- */
  let toastTimer;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  /* ---------------------------------------------------------------- */
  /* Falling petals                                                     */
  /* ---------------------------------------------------------------- */
  function startPetals() {
    if (prefersReducedMotion) return;
    const layer = document.getElementById('petals-layer');
    let count = 0;
    const spawner = setInterval(() => {
      if (count++ > 60) { clearInterval(spawner); return; }
      spawnPetal(layer);
    }, 900);
    // seed a few immediately
    for (let i = 0; i < 4; i++) setTimeout(() => spawnPetal(layer), i * 300);
  }

  function spawnPetal(layer) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const left = Math.random() * 100;
    const fallDuration = 8 + Math.random() * 6;
    const swayDuration = 2 + Math.random() * 2;
    const size = 8 + Math.random() * 8;
    petal.style.left = `${left}vw`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
    layer.appendChild(petal);
    setTimeout(() => petal.remove(), fallDuration * 1000 + 200);
  }

  /* ---------------------------------------------------------------- */
  /* Background music (local file, pre-trimmed to the 0s-33s clip so   */
  /* the browser's native loop repeats it with no runtime seeking)     */
  /* ---------------------------------------------------------------- */
  const musicToggle = document.getElementById('music-toggle');
  const bgMusic = document.getElementById('bg-music');
  let musicPlaying = false;
  let musicStarted = false;
  let musicKickoffScheduled = false;
  let suppressRetryUntilKickoff = false;

  bgMusic.addEventListener('play', () => {
    musicPlaying = true;
    musicStarted = true;
    musicToggle.classList.add('playing');
  });
  bgMusic.addEventListener('pause', () => {
    musicPlaying = false;
    musicToggle.classList.remove('playing');
  });

  function playMusic() {
    const p = bgMusic.play();
    if (p && typeof p.catch === 'function') p.catch(() => { /* blocked; retried on next gesture */ });
  }

  // Waits 1s after the envelope tap before starting playback, so the
  // music kicks in once the invitation is actually opening rather than
  // the instant the envelope is touched.
  function scheduleMusicKickoff() {
    if (musicKickoffScheduled) return;
    musicKickoffScheduled = true;
    suppressRetryUntilKickoff = true;
    setTimeout(() => {
      suppressRetryUntilKickoff = false;
      playMusic();
    }, 1000);
  }

  musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
      bgMusic.pause();
    } else {
      playMusic();
    }
  });

  // Some Android browsers can silently block the first play() attempt
  // depending on how the gesture was dispatched. Retry on every
  // subsequent tap/click until playback actually starts — but not
  // during the 0.5s kickoff window itself, otherwise this listener
  // (which also sees the envelope-tap click as it bubbles to document)
  // would fire play() immediately and defeat the intended delay.
  function retryMusicOnGesture() {
    if (musicStarted) {
      document.removeEventListener('click', retryMusicOnGesture);
      document.removeEventListener('touchend', retryMusicOnGesture);
      return;
    }
    if (suppressRetryUntilKickoff) return;
    if (envelopeScreen.classList.contains('opening')) playMusic();
  }
  document.addEventListener('click', retryMusicOnGesture);
  document.addEventListener('touchend', retryMusicOnGesture, { passive: true });

})();
