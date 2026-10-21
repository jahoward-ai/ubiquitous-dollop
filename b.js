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

// ---- Homepage opening: the quill signs "HCG", then the cover settles in -------------
// The pen follows the real outline of each letter (assets/hcg-signature.js), so it moves
// the way a hand would. Fine moving lines in the background echo the quill's line art.
(() => {
  const intro = document.querySelector('.intro');
  if (!intro) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Background: two slow ribbons of fine lines, drawn on a canvas.
  const canvas = intro.querySelector('.intro-lines');
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0; let H = 0; let visible = true;
  const size = () => {
    W = intro.clientWidth; H = intro.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const ribbons = [
    { y: .30, amp: .10, waves: 1.3, speed: .07, lines: 26, spread: .16, color: '255,255,255', alpha: .07 },
    { y: .74, amp: .08, waves: 1.0, speed: -.05, lines: 22, spread: .14, color: '201,173,106', alpha: .09 },
  ];
  const drawLines = (t) => {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    ribbons.forEach((r) => {
      for (let i = 0; i < r.lines; i += 1) {
        const k = i / (r.lines - 1);
        ctx.strokeStyle = `rgba(${r.color},${(r.alpha * (.45 + .55 * Math.sin(Math.PI * k))).toFixed(3)})`;
        ctx.beginPath();
        for (let x = -20; x <= W + 20; x += 16) {
          const u = x / W;
          const twist = Math.sin(u * Math.PI * 2 * r.waves + t * r.speed * 6 + k * 2.2);
          const y = H * (r.y + r.amp * Math.sin(u * Math.PI * 2 * r.waves + t * r.speed * 4) + (k - .5) * r.spread * twist);
          if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    });
  };
  size(); drawLines(0);
  if ('IntersectionObserver' in window) new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(intro);
  addEventListener('resize', () => { size(); drawLines(performance.now() / 1000); });
  if (!reduce) {
    const loop = (now) => { if (visible) drawLines(now / 1000); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  // The signature.
  if (!intro.classList.contains('writing') || !window.HCG_SIGNATURE) { intro.classList.remove('writing'); return; }
  const sig = window.HCG_SIGNATURE;
  const svg = intro.querySelector('.intro-sign');
  const pen = intro.querySelector('.intro-pen');
  svg.setAttribute('viewBox', sig.viewBox);
  svg.innerHTML = sig.paths.map((p) => `<path d="${p.d}" pathLength="${p.len}" style="stroke-dasharray:${p.len};stroke-dashoffset:${p.len}"></path>`).join('');
  const paths = [...svg.querySelectorAll('path')];
  const total = sig.paths.reduce((s, p) => s + p.len, 0);

  let done = false; let stop = false;
  const reveal = () => {
    if (done) return; done = true;
    pen.style.opacity = '0';
    svg.classList.add('settle');
    setTimeout(() => intro.classList.remove('writing'), 350);
  };
  const skip = () => { if (!done) { stop = true; svg.classList.add('settle'); done = true; pen.style.opacity = '0'; intro.classList.remove('writing'); } };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) => addEventListener(ev, skip, { once: true, passive: true }));

  const penBox = () => { const r = pen.getBoundingClientRect(); return [r.width || 100, (r.width || 100) * (2342 / 2383)]; };
  const introBox = () => intro.getBoundingClientRect();
  const placePen = (pathEl, at) => {
    const pt = pathEl.getPointAtLength(at);
    const m = pathEl.getScreenCTM(); const box = introBox();
    const x = m.a * pt.x + m.c * pt.y + m.e - box.left;
    const y = m.b * pt.x + m.d * pt.y + m.f - box.top;
    const [pw, ph] = penBox();
    pen.style.transform = `translate(${(x - pw * 0.03).toFixed(1)}px, ${(y - ph * 0.97).toFixed(1)}px) rotate(-4deg)`;
  };

  const DURATION = 3000; // whole signature, in ms
  const start = performance.now() + 250;
  pen.style.opacity = '.5';
  placePen(paths[0], 0);
  const step = (now) => {
    if (stop) return;
    const k = Math.max(0, Math.min(1, (now - start) / DURATION));
    const eased = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    let left = eased * total;
    paths.forEach((p, i) => {
      const len = sig.paths[i].len;
      const drawn = Math.max(0, Math.min(len, left));
      p.style.strokeDashoffset = String(len - drawn);
      if (drawn > 0 && drawn < len) placePen(p, drawn);
      left -= len;
    });
    if (k < 1) requestAnimationFrame(step);
    else { svg.classList.add('inked'); pen.style.opacity = '0'; setTimeout(reveal, 900); }
  };
  requestAnimationFrame(step);
})();

// ---- Scroll reveal for [data-reveal] blocks ----------------------------------------
(() => {
  const blocks = [...document.querySelectorAll('[data-reveal]')];
  if (!blocks.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('shown'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  blocks.forEach((b) => io.observe(b));
})();
