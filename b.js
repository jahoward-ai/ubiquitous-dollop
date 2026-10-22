// HCG redesign ("Version B") — shared header, footer, request form, and the alumni globe.
const HCG_EMAIL = 'hconsult@hamilton.edu';
const PARTNERSHIP_FORM = 'https://forms.gle/L6PbRgAhz2x7ijzN7';
const LINKEDIN = 'https://www.linkedin.com/company/hamilton-consulting-group';
const ALUMNI_CONNECTIONS = 'https://hamiltoncollege.my.site.com/HamiltonPortal/login';
// Optional: a Formspree address (https://formspree.io/f/...) sends requests straight to HCG.
const HCG_FORM_ENDPOINT = '';

const here = document.body.dataset.page;
const cur = (p) => (p === here ? ' aria-current="page"' : '');

// Top menu. Each page has a dropdown of its sections (hover on desktop, tap the arrow on phones).
const MENU = [
  { href: 'about.html', key: 'about', label: 'About', items: [['hamilton-fit', 'The Hamilton fit'], ['board', 'Executive Board'], ['governance', 'Governance'], ['membership', 'Membership']] },
  { href: 'alumni.html', key: 'alumni', label: 'Alumni', items: [['globe-map', 'Alumni globe'], ['types', 'By type of consulting'], ['connections', 'Alumni Connections']] },
  { href: 'prepare.html', key: 'prepare', label: 'Prepare', items: [['profession', 'The profession'], ['timeline', 'Recruiting timeline'], ['case', 'Case interviews'], ['presentations', 'Presentations'], ['support', 'Get help from HCG']] },
  { href: 'resources.html', key: 'resources', label: 'Resources', items: [['events', 'Events'], ['presentations', 'Presentations'], ['case-materials', 'Case materials'], ['firms', 'Firms'], ['outside', 'Outside resources']] },
  { href: 'quill.html', key: 'quill', label: 'Quill', items: [['year', 'The Quill year'], ['students', 'For students'], ['organizations', 'For organizations'], ['skills', 'Skills you build'], ['work', 'Past engagements']] },
  { href: 'join.html', key: 'join', label: 'Join HCG', cta: true, items: [['ways', 'Ways to participate'], ['questions', 'Common questions'], ['request', 'Ask for anything']] },
];
document.querySelector('[data-top]').outerHTML = `
<header class="top dark"><div class="wrap">
  <a class="logo" href="index.html" aria-label="Hamilton Consulting Group home"><img src="assets/hcg-wordmark-white.png" alt="Hamilton Consulting Group"></a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
  <nav class="menu" id="menu" aria-label="Main">
    ${MENU.map((m, n) => `<div class="dd${m.cta ? ' dd-cta' : ''}">
      <a class="dd-main${m.cta ? ' btn' : ''}" href="${m.href}"${cur(m.key)}>${m.label}</a>
      <button class="dd-toggle" type="button" aria-expanded="false" aria-controls="dd-${n}" aria-label="Show ${m.label} sections"><span aria-hidden="true">⌄</span></button>
      <div class="dd-panel" id="dd-${n}">${m.items.map(([id, t]) => `<a href="${m.href}#${id}">${t}</a>`).join('')}</div>
    </div>`).join('')}
  </nav>
</div></header>`;

// Dropdown behavior: open on hover with a grace period (so moving the pointer into the
// panel never closes it), one open at a time, Escape closes, arrow button for touch/keyboard.
(() => {
  const dds = [...document.querySelectorAll('.menu .dd')];
  const wide = matchMedia('(min-width: 861px)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const set = (dd, open) => { dd.classList.toggle('open', open); dd.querySelector('.dd-toggle').setAttribute('aria-expanded', String(open)); };
  const only = (dd) => dds.forEach((o) => set(o, o === dd));
  dds.forEach((dd) => {
    let t;
    dd.addEventListener('mouseenter', () => { if (wide.matches && fine.matches) { clearTimeout(t); only(dd); } });
    dd.addEventListener('mouseleave', () => { if (wide.matches && fine.matches) t = setTimeout(() => set(dd, false), 300); });
    dd.querySelector('.dd-toggle').addEventListener('click', (e) => { e.stopPropagation(); if (dd.classList.contains('open')) set(dd, false); else only(dd); });
    dd.querySelector('.dd-main').addEventListener('click', (e) => {
      // Touch screens at desktop width: first tap opens the dropdown, second follows the link.
      if (wide.matches && !fine.matches && !dd.classList.contains('open')) { e.preventDefault(); only(dd); }
    });
    dd.addEventListener('focusout', (e) => { if (!dd.contains(e.relatedTarget)) set(dd, false); });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.menu .dd')) dds.forEach((d) => set(d, false)); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') dds.forEach((d) => set(d, false)); });
})();

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
menu.addEventListener('click', (e) => { if (e.target.closest('a') && menu.classList.contains('open') && !e.defaultPrevented) toggle.click(); });

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
  const mark = intro.querySelector('.intro-mark');
  svg.setAttribute('viewBox', sig.viewBox);
  svg.innerHTML = sig.paths.map((p) => `<path d="${p.d}" pathLength="${p.len}" style="stroke-dasharray:${p.len};stroke-dashoffset:${p.len}"></path>`).join('');
  const paths = [...svg.querySelectorAll('path')];
  const total = sig.paths.reduce((s, p) => s + p.len, 0);

  let done = false; let stop = false; let burst = null;
  const finishCover = () => { intro.classList.add('from-burst'); intro.classList.remove('writing'); };
  const skip = () => {
    if (done) return;
    stop = true; done = true;
    burst?.remove();
    svg.classList.add('settle'); pen.style.opacity = '0';
    intro.classList.remove('writing');
  };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) => addEventListener(ev, skip, { once: true, passive: true }));

  // Pen: follows the outline, but glides toward each new point so it never jumps.
  const penBox = () => { const r = pen.getBoundingClientRect(); return [r.width || 100, (r.width || 100) * (2342 / 2383)]; };
  const toLocal = (pathEl, at) => {
    const pt = pathEl.getPointAtLength(at);
    const m = pathEl.getScreenCTM(); const box = intro.getBoundingClientRect();
    return [m.a * pt.x + m.c * pt.y + m.e - box.left, m.b * pt.x + m.d * pt.y + m.f - box.top];
  };
  let penX = null; let penY = null;
  const movePen = (x, y, snap) => {
    if (penX === null || snap) { penX = x; penY = y; } else { penX += (x - penX) * 0.45; penY += (y - penY) * 0.45; }
    const [pw, ph] = penBox();
    pen.style.transform = `translate(${(penX - pw * 0.03).toFixed(1)}px, ${(penY - ph * 0.97).toFixed(1)}px) rotate(-4deg)`;
  };

  // "HCG" bursts into specks that fly out, then gather into the Hamilton Consulting Group wordmark.
  const explode = () => {
    const box = intro.getBoundingClientRect();
    const W = Math.round(box.width); const H = Math.round(box.height);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const sample = (draw, gap) => {
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d'); draw(x);
      const d = x.getImageData(0, 0, W, H).data; const pts = [];
      for (let y = 0; y < H; y += gap) for (let xx = 0; xx < W; xx += gap) if (d[(y * W + xx) * 4 + 3] > 110) pts.push([xx, y]);
      return pts;
    };
    // Where the letters are now.
    const r = svg.getBoundingClientRect(); const vb = sig.viewBox.split(' ').map(Number);
    const sc = Math.min(r.width / vb[2], r.height / vb[3]);
    const ox = r.left - box.left + (r.width - vb[2] * sc) / 2 - vb[0] * sc;
    const oy = r.top - box.top + (r.height - vb[3] * sc) / 2 - vb[1] * sc;
    const from = sample((x) => { x.setTransform(sc, 0, 0, sc, ox, oy); x.fillStyle = '#fff'; sig.paths.forEach((p) => x.fill(new Path2D(p.d))); }, 2);
    // Where the wordmark will be.
    const mr = mark.getBoundingClientRect();
    const to = sample((x) => x.drawImage(mark, mr.left - box.left, mr.top - box.top, mr.width, mr.height), W < 600 ? 2 : 3);
    if (!from.length || !to.length) { svg.classList.add('settle'); finishCover(); return; }
    const N = Math.min(to.length, 2600); const stepT = to.length / N;
    const cx = from.reduce((s, p) => s + p[0], 0) / from.length; const cy = from.reduce((s, p) => s + p[1], 0) / from.length;
    const parts = Array.from({ length: N }, (_, i) => {
      const [tx, ty] = to[Math.floor(i * stepT)];
      const [sx, sy] = from[Math.floor(Math.random() * from.length)];
      const a = Math.atan2(sy - cy, sx - cx) + (Math.random() - .5) * 1.4;
      const dist = 40 + Math.random() * 150;
      return { sx, sy, bx: sx + Math.cos(a) * dist, by: sy + Math.sin(a) * dist - 20, tx, ty, d: Math.random() * 180, gold: Math.random() < .45 };
    });
    burst = document.createElement('canvas'); burst.className = 'intro-burst';
    burst.width = W * ratio; burst.height = H * ratio; intro.appendChild(burst);
    const bx = burst.getContext('2d'); bx.setTransform(ratio, 0, 0, ratio, 0, 0);
    svg.style.transition = 'none'; svg.style.opacity = '0';
    const easeOut = (k) => 1 - Math.pow(1 - k, 3);
    const easeInOut = (k) => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
    const OUT = 420; const IN = 900; const FADE = 380; const t0 = performance.now();
    let covered = false;
    const frame = (now) => {
      if (stop) return;
      const t = now - t0;
      bx.clearRect(0, 0, W, H);
      const alpha = t < OUT + IN ? 1 : Math.max(0, 1 - (t - OUT - IN) / FADE);
      parts.forEach((p) => {
        let x; let y;
        if (t < OUT) { const k = easeOut(t / OUT); x = p.sx + (p.bx - p.sx) * k; y = p.sy + (p.by - p.sy) * k; }
        else { const k = easeInOut(Math.max(0, Math.min(1, (t - OUT - p.d) / (IN - p.d)))); x = p.bx + (p.tx - p.bx) * k; y = p.by + (p.ty - p.by) * k; }
        bx.fillStyle = p.gold ? `rgba(233,210,150,${alpha})` : `rgba(255,255,255,${alpha})`;
        bx.fillRect(x, y, 1.7, 1.7);
      });
      if (!covered && t > OUT + IN - 250) { covered = true; finishCover(); }
      if (t < OUT + IN + FADE) requestAnimationFrame(frame); else { burst.remove(); burst = null; done = true; }
    };
    requestAnimationFrame(frame);
  };

  // No pen: "HCG" fades in fully drawn, holds briefly, then bursts into the wordmark.
  pen.style.display = 'none';
  paths.forEach((p) => { p.style.strokeDashoffset = '0'; });
  svg.classList.add('appear');
  requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.add('inked')));
  setTimeout(() => { if (!stop) explode(); }, 1300);
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

// ---- Slide viewers (prepare.html) --------------------------------------------------
// Arrows, keyboard arrows (when the viewer has focus), and swipe; next slide is preloaded.
document.querySelectorAll('[data-deck]').forEach((deck) => {
  const n = +deck.dataset.count; const base = deck.dataset.base;
  const titles = JSON.parse(deck.dataset.titles || '[]');
  const img = deck.querySelector('.deck-stage img'); const count = deck.querySelector('.deck-count');
  const prev = deck.querySelector('[data-prev]'); const next = deck.querySelector('[data-next]');
  const src = (i) => `${base}${String(i + 1).padStart(2, '0')}.jpg?v=2`;
  let i = 0;
  const show = (k) => {
    i = Math.max(0, Math.min(n - 1, k));
    img.src = src(i);
    img.alt = `Slide ${i + 1} of ${n}${titles[i] ? `: ${titles[i]}` : ''}`;
    count.textContent = `${i + 1} / ${n}`;
    prev.disabled = i === 0; next.disabled = i === n - 1;
    if (i + 1 < n) { const pre = new Image(); pre.src = src(i + 1); }
  };
  prev.addEventListener('click', () => show(i - 1));
  next.addEventListener('click', () => show(i + 1));
  deck.querySelector('.deck-stage').addEventListener('click', () => show(i + 1 < n ? i + 1 : 0));
  deck.tabIndex = 0;
  deck.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1); }
  });
  let x0 = null;
  deck.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  deck.addEventListener('touchend', (e) => {
    if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
  });
  show(0);
});

// ---- Events timeline: mark each event as upcoming or past from today's date -------
document.querySelectorAll('[data-timeline] li[data-date]').forEach((li) => {
  const end = new Date(`${li.dataset.date}T23:59:59`);
  const upcoming = end >= new Date();
  li.classList.add(upcoming ? 'upcoming' : 'past');
  if (upcoming) li.querySelector('time')?.insertAdjacentHTML('beforeend', ' <span class="tag">Upcoming</span>');
});

// ---- Quill page: a strand of quill-like lines running down the whole page -----------
// A bundle of fine curves that weaves left and right from top to bottom, twisting like
// the quill's mesh. Redrawn when the page height changes.
(() => {
  const svg = document.querySelector('[data-strand]');
  if (!svg) return;
  const main = svg.parentElement;
  const draw = () => {
    const W = main.clientWidth; const H = main.scrollHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.style.height = `${H}px`;
    const lines = 24; const steps = Math.ceil(H / 40);
    const swing = Math.min(W * 0.32, 420); const width = Math.min(W * 0.12, 150);
    let out = '';
    for (let i = 0; i < lines; i += 1) {
      const k = i / (lines - 1) - 0.5;
      let d = '';
      for (let j = 0; j <= steps; j += 1) {
        const y = (j / steps) * H;
        const t = y / 900; // one full weave roughly every 900px of page
        const center = W * 0.62 + Math.sin(t * Math.PI * 1.2) * swing;
        const twist = Math.cos(t * Math.PI * 2.4 + k * 0.6);
        const x = center + k * width * twist;
        d += `${j ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      const a = (0.10 + 0.14 * (1 - Math.abs(k) * 2)).toFixed(3);
      out += `<path d="${d}" style="stroke-opacity:${a}"></path>`;
    }
    svg.innerHTML = out;
  };
  draw();
  let last = main.scrollHeight;
  addEventListener('resize', draw);
  new ResizeObserver(() => { if (Math.abs(main.scrollHeight - last) > 40) { last = main.scrollHeight; draw(); } }).observe(main);
})();
