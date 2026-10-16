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

// ---- Quill page: fan of blue lines (inspired by McKinsey's binder cover) ------------
// Each line runs from a point along the top edge to a point along the bottom edge in
// reverse order, so the lines cross into a pinched, twisting ribbon.
document.querySelectorAll('[data-line-fan]').forEach((svg) => {
  const draw = () => {
    const w = svg.clientWidth; const h = svg.clientHeight;
    if (!w || !h) return;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const n = 46;
    const mix = (a, b, t) => Math.round(a + (b - a) * t);
    let out = '';
    for (let i = 0; i < n; i += 1) {
      const t = i / (n - 1);
      const x1 = w * (0.42 + 0.56 * t);            // top: wide band on the right
      const x2 = w * (0.52 - 0.42 * t);            // bottom: narrower band, reversed
      const y2 = h * (1.02 - 0.12 * Math.sin(Math.PI * t));
      const c = `rgb(${mix(110, 10, t)},${mix(150, 52, t)},${mix(240, 170, t)})`;
      out += `<line x1="${x1.toFixed(1)}" y1="-4" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c}"/>`;
    }
    svg.innerHTML = out;
  };
  draw();
  addEventListener('resize', draw);
});
