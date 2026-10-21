// HCG redesign ("Version B") — shared header, footer, request form, and the alumni globe.
const HCG_EMAIL = 'hconsult@hamilton.edu';
const PARTNERSHIP_FORM = 'https://forms.gle/L6PbRgAhz2x7ijzN7';
const LINKEDIN = 'https://www.linkedin.com/company/hamilton-consulting-group';
const ALUMNI_CONNECTIONS = 'https://hamiltoncollege.my.site.com/HamiltonPortal/login';
// Optional: a Formspree address (https://formspree.io/f/...) sends requests straight to HCG.
const HCG_FORM_ENDPOINT = '';

const here = document.body.dataset.page;
const cur = (p) => (p === here ? ' aria-current="page"' : '');

document.querySelector('[data-top]').outerHTML = `
<header class="top${here === 'home' ? ' dark' : ''}"><div class="wrap">
  <a class="logo" href="index.html" aria-label="Hamilton Consulting Group home"><img src="assets/hcg-wordmark-${here === 'home' ? 'white' : 'blue'}.png" alt="Hamilton Consulting Group"></a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
  <nav class="menu" id="menu" aria-label="Main">
    <a href="about.html"${cur('about')}>About</a>
    <a href="quill.html"${cur('quill')}>Quill</a>
    <a href="alumni.html"${cur('alumni')}>Alumni</a>
    <a href="prepare.html"${cur('prepare')}>Prepare</a>
    <a href="resources.html"${cur('resources')}>Resources</a>
    <a class="btn" href="join.html"${cur('join')}>Join HCG</a>
  </nav>
</div></header>`;

document.querySelector('[data-foot]').outerHTML = `
<footer class="foot"><div class="wrap">
  <div class="cols">
    <div><img src="assets/hcg-wordmark-white.png" alt="Hamilton Consulting Group"><p style="margin-top:1rem">Hamilton College’s student consulting group.</p><p class="mail">${HCG_EMAIL}</p></div>
    <nav aria-label="The group"><h2>The group</h2><a href="about.html">About &amp; board</a><a href="alumni.html">Alumni globe</a><a href="join.html">Join HCG</a><a href="${PARTNERSHIP_FORM}" target="_blank" rel="noopener">Partnership application</a><a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a></nav>
    <nav aria-label="Quill"><h2>Quill</h2><a href="quill.html#students">For students</a><a href="quill.html#organizations">For organizations</a><a href="quill.html#work">Past engagements</a></nav>
    <nav aria-label="Prepare"><h2>Prepare</h2><a href="prepare.html#profession">The profession</a><a href="prepare.html#timeline">Recruiting timeline</a><a href="prepare.html#case">Case interviews</a><a href="resources.html">Presentations &amp; resources</a><a href="resources.html#case-materials">Case book &amp; library</a></nav>
  </div>
  <div class="base"><span>© ${new Date().getFullYear()} Hamilton Consulting Group</span><a href="join.html#request">Contact HCG</a></div>
</div></footer>`;

// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) toggle.click(); });

// Section nav: highlight the section in view
const localLinks = [...document.querySelectorAll('.local a')];
if (localLinks.length && 'IntersectionObserver' in window) {
  const byId = new Map(localLinks.map((a) => [a.hash.slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        localLinks.forEach((a) => a.classList.remove('on'));
        byId.get(en.target.id)?.classList.add('on');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  byId.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
}

// Firm bars: tooltip on hover/focus
document.querySelectorAll('.bars li').forEach((li) => {
  const track = li.querySelector('.track-bar');
  const show = () => {
    if (track.querySelector('.tip')) return;
    const tip = document.createElement('span');
    tip.className = 'tip';
    tip.textContent = li.dataset.tip;
    tip.style.left = li.querySelector('.fill').style.width;
    tip.style.transform = 'translateX(-50%)';
    track.appendChild(tip);
  };
  const hide = () => track.querySelector('.tip')?.remove();
  li.addEventListener('mouseenter', show); li.addEventListener('mouseleave', hide);
  li.addEventListener('focusin', show); li.addEventListener('focusout', hide);
});

// ---- Request form (join.html#request) -----------------------------------------------
const topics = {
  general: ['Join general programming', 'Joining HCG general programming', 'Your class year, and that you would like event updates'],
  'office-hours': ['Casing office hours', 'Casing office hours', 'What you would like help practicing'],
  'case-book': ['Request the HCG case book', 'HCG case book access', 'Your current stage of case preparation'],
  'case-library': ['Request the HCG case library', 'HCG case library access', 'The kind of practice material you are looking for'],
  'practice-case': ['Request a practice case', 'HCG practice case request', 'Your experience level and the skill or case type you want to practice'],
  archive: ['Request a presentation or resource', 'HCG resource request', 'The resource or topic you are looking for'],
  events: ['Ask about events', 'HCG events and programming', 'The kind of event you are interested in'],
  'quill-student': ['Express interest in Quill', 'Student interest in HCG Quill', 'Relevant interests or experience, and your current capacity for project work'],
  'quill-client': ['Discuss a potential Quill project', 'Potential HCG Quill project', 'Your organization, the question or challenge, and anticipated timing'],
  other: ['Something else', 'Question for HCG', 'Your question'],
};
const form = document.querySelector('[data-request]');
if (form) {
  const sel = form.querySelector('#r-topic');
  const details = form.querySelector('#r-details');
  const result = document.querySelector('[data-result]');
  sel.innerHTML = Object.entries(topics).map(([k, t]) => `<option value="${k}">${t[0]}</option>`).join('');
  const fromHash = () => {
    const key = location.hash.replace('#request-', '');
    if (location.hash.startsWith('#request-') && topics[key]) { sel.value = key; }
    details.placeholder = topics[sel.value][2];
  };
  fromHash();
  if (location.hash.startsWith('#request-')) addEventListener('load', () => document.getElementById('request').scrollIntoView(), { once: true });
  addEventListener('hashchange', () => { fromHash(); if (location.hash.startsWith('#request')) document.getElementById('request').scrollIntoView(); });
  sel.addEventListener('change', () => { details.placeholder = topics[sel.value][2]; result.hidden = true; });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const t = topics[sel.value];
    const name = form.querySelector('#r-name').value.trim();
    const email = form.querySelector('#r-email').value.trim();
    const year = form.querySelector('#r-year').value.trim();
    const subject = `${t[1]} – ${name}`;
    const body = `Hello HCG,\n\n${details.value.trim()}\n\nName: ${name}${year ? `\nClass year / organization: ${year}` : ''}\nReply to: ${email}\n\nThank you.`;
    if (HCG_FORM_ENDPOINT) {
      try {
        const r = await fetch(HCG_FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name, email, year, topic: t[0], message: details.value.trim(), _subject: subject }) });
        if (r.ok) { form.reset(); result.innerHTML = '<h3>Request sent.</h3><p>HCG will reply by email.</p>'; result.hidden = false; result.focus(); return; }
      } catch { /* fall back to email options */ }
    }
    const enc = encodeURIComponent;
    result.innerHTML = `<h3>Ready to send.</h3><p>Pick how to send it. Each opens a new email to ${HCG_EMAIL} with your request filled in.</p>
      <div class="actions" style="margin-top:1rem">
        <a class="btn" target="_blank" rel="noopener" href="https://mail.google.com/mail/?view=cm&fs=1&to=${enc(HCG_EMAIL)}&su=${enc(subject)}&body=${enc(body)}">Gmail</a>
        <a class="btn" target="_blank" rel="noopener" href="https://outlook.office.com/mail/deeplink/compose?to=${enc(HCG_EMAIL)}&subject=${enc(subject)}&body=${enc(body)}">Outlook</a>
        <a class="btn ghost" href="mailto:${HCG_EMAIL}?subject=${enc(subject)}&body=${enc(body)}">Email app</a>
      </div>
      <label for="r-preview" style="display:block;margin-top:1.25rem;font-weight:600;font-size:.88rem">Or copy it into any email:</label>
      <textarea id="r-preview" class="preview" readonly></textarea>
      <button class="btn ghost" type="button" data-copy>Copy message</button> <span class="note" aria-live="polite" data-copied></span>`;
    const pv = result.querySelector('#r-preview');
    pv.value = `To: ${HCG_EMAIL}\nSubject: ${subject}\n\n${body}`;
    result.querySelector('[data-copy]').addEventListener('click', async () => {
      let ok = true;
      try { await navigator.clipboard.writeText(pv.value); } catch { pv.select(); try { ok = document.execCommand('copy'); } catch { ok = false; } }
      result.querySelector('[data-copied]').textContent = ok ? 'Copied.' : 'Select the text and copy it.';
    });
    result.hidden = false;
    result.focus();
  });
}

// ---- Homepage intro: layers drift at different speeds as you scroll -----------------
// The quill moves slowest of all, the wordmark a little, so the cover feels layered.
const driftLayers = [...document.querySelectorAll('[data-drift]')];
if (driftLayers.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;
  const update = () => {
    const y = Math.min(window.scrollY, window.innerHeight * 1.2);
    driftLayers.forEach((el) => {
      const speed = Number(el.dataset.drift) || 0;
      const fade = el.hasAttribute('data-fade') ? Math.max(0, 1 - y / (window.innerHeight * 0.7)) : 1;
      el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
      el.style.opacity = fade.toFixed(3);
    });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// ---- Homepage opening: quill writes "HCG", the ink bursts into dust, cover settles ----
(() => {
  const intro = document.querySelector('.intro.writing');
  const fxIntro = document.querySelector('.intro');
  if (!fxIntro) return;
  const canvas = fxIntro.querySelector('.intro-fx');
  const pen = fxIntro.querySelector('.intro-pen');
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0; let H = 0;
  const size = () => {
    W = fxIntro.clientWidth; H = fxIntro.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const GOLD = [201, 173, 106]; const WHITE = [255, 255, 255];

  // Gentle dust that keeps drifting behind the cover.
  let ambient = []; let ambientOn = false; let visible = true;
  const seedAmbient = () => {
    const n = Math.round(Math.min(90, (W * H) / 14000));
    ambient = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .5, vy: -(Math.random() * .25 + .06), vx: (Math.random() - .5) * .12, a: Math.random() * .45 + .12, c: Math.random() < .55 ? GOLD : WHITE, tw: Math.random() * Math.PI * 2 }));
  };
  let bursts = [];
  const loop = () => {
    if (!ambientOn) return;
    if (visible) {
      ctx.clearRect(0, 0, W, H);
      const t = performance.now() / 1000;
      ambient.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        const a = p.a * (.65 + .35 * Math.sin(t * 1.3 + p.tw));
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      bursts = bursts.filter((p) => p.life > 0);
      bursts.forEach((p) => {
        p.vx *= .965; p.vy = p.vy * .965 - .012; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${Math.max(0, p.life).toFixed(3)})`;
        ctx.fillRect(p.x, p.y, p.s, p.s);
      });
    }
    requestAnimationFrame(loop);
  };
  const startAmbient = () => {
    if (ambientOn || reduce) return;
    seedAmbient(); ambientOn = true; requestAnimationFrame(loop);
  };
  if ('IntersectionObserver' in window) new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(fxIntro);
  addEventListener('resize', () => { size(); if (ambientOn) seedAmbient(); });

  if (!intro) { startAmbient(); return; }

  let done = false;
  const reveal = () => { if (done) return; done = true; intro.classList.remove('writing'); pen.style.opacity = '0'; startAmbient(); };
  const skip = () => { if (!done) { stopWriting = true; ctx.clearRect(0, 0, W, H); reveal(); } };
  let stopWriting = false;
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) => addEventListener(ev, skip, { once: true, passive: true }));

  (async () => {
    try { await Promise.race([document.fonts.load('200px "Great Vibes"'), wait(1500)]); } catch { /* use fallback */ }
    if (stopWriting) return;
    // Draw "HCG" once off-screen; the visible canvas reveals it left to right.
    const fs = Math.min(W * 0.3, H * 0.42, 300);
    const off = document.createElement('canvas'); off.width = W; off.height = H;
    const o = off.getContext('2d');
    o.font = `${fs}px "Great Vibes", "Snell Roundhand", "Apple Chancery", cursive`;
    o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillStyle = '#fff';
    o.fillText('HCG', W / 2, H / 2);
    const tw = o.measureText('HCG').width;
    const left = W / 2 - tw / 2 - fs * 0.05; const right = W / 2 + tw / 2 + fs * 0.05;
    const penW = pen.getBoundingClientRect().width || 110;
    const penH = penW * (2342 / 2383);
    pen.style.opacity = '1';
    const dur = 1900; const t0 = performance.now();
    await new Promise((resolve) => {
      const step = (now) => {
        if (stopWriting) { resolve(); return; }
        const k = Math.min(1, (now - t0) / dur);
        const p = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const x = left + (right - left) * p;
        const y = H / 2 - fs * 0.05 + Math.sin(p * Math.PI * 7) * fs * 0.2;
        ctx.clearRect(0, 0, W, H);
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, x, H); ctx.clip();
        ctx.shadowColor = 'rgba(201,173,106,.7)'; ctx.shadowBlur = 14; ctx.drawImage(off, 0, 0, W, H);
        ctx.restore();
        // The quill's tip is its bottom-left corner.
        pen.style.transform = `translate(${(x - penW * 0.03).toFixed(1)}px, ${(y - penH * 0.97).toFixed(1)}px) rotate(-6deg)`;
        if (k < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
    if (stopWriting) return;
    await wait(260);
    // Burst: turn every few inked pixels into a particle flying outward.
    const img = o.getImageData(0, 0, W, H).data;
    const gap = W < 600 ? 3 : 4;
    for (let y = 0; y < H; y += gap) {
      for (let x = 0; x < W; x += gap) {
        if (img[(y * W + x) * 4 + 3] > 120) {
          const ang = Math.atan2(y - H / 2, x - W / 2) + (Math.random() - .5) * 1.2;
          const sp = Math.random() * 4.5 + 1;
          bursts.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1, life: 1, decay: Math.random() * .012 + .008, s: Math.random() * 2.4 + 1.2, c: Math.random() < .5 ? GOLD : WHITE });
        }
      }
    }
    pen.style.transition = 'opacity .5s ease'; pen.style.opacity = '0';
    ambientOn = false; seedAmbient(); ambientOn = true; requestAnimationFrame(loop);
    await wait(380);
    reveal();
  })();
})();
