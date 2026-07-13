(() => {
  'use strict';

  const EVENT = {
    title: "Aishwarya & Laxmi Narayen — Engagement Ceremony",
    startISO: "2026-09-13T09:00:00+05:30",
    endISO: "2026-09-13T10:00:00+05:30",
    location: "Panigraha Kalyana Mandapam, 9/A, Aryagowda Rd, Gokulam Colony, Ramakrishnapuram, West Mambalam, Chennai, Tamil Nadu 600033",
    description: "Join us in celebrating the Engagement Ceremony of Aishwarya & Laxmi Narayen."
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  document.getElementById('qr-open').addEventListener('click', () => {
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
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
      text: "You're invited! Aishwarya & Laxmi Narayen's Engagement Ceremony — 13th September 2026, 9:00 AM IST, Chennai.",
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

})();
