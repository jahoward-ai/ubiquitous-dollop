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
<header class="top"><div class="wrap">
  <a class="logo" href="index.html" aria-label="Hamilton Consulting Group home"><img src="../assets/hcg-wordmark-blue.png" alt="Hamilton Consulting Group"></a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
  <nav class="menu" id="menu" aria-label="Main">
    <a href="prepare.html"${cur('prepare')}>Prepare</a>
    <a href="quill.html"${cur('quill')}>Quill</a>
    <a href="alumni.html"${cur('alumni')}>Alumni</a>
    <a href="about.html"${cur('about')}>About</a>
    <a class="btn" href="join.html"${cur('join')}>Join HCG</a>
  </nav>
</div></header>`;

document.querySelector('[data-foot]').outerHTML = `
<footer class="foot"><div class="wrap">
  <div class="cols">
    <div><img src="../assets/hcg-wordmark-white.png" alt="Hamilton Consulting Group"><p style="margin-top:1rem">Hamilton College’s student consulting group.</p><p class="mail">${HCG_EMAIL}</p></div>
    <nav aria-label="Prepare"><h2>Prepare</h2><a href="prepare.html#profession">The profession</a><a href="prepare.html#timeline">Recruiting timeline</a><a href="prepare.html#case">Case interviews</a><a href="prepare.html#support">Office hours &amp; case book</a></nav>
    <nav aria-label="Quill"><h2>Quill</h2><a href="quill.html#students">For students</a><a href="quill.html#organizations">For organizations</a><a href="quill.html#work">Past engagements</a></nav>
    <nav aria-label="The group"><h2>The group</h2><a href="about.html">About &amp; board</a><a href="alumni.html">Alumni globe</a><a href="join.html">Join HCG</a><a href="${PARTNERSHIP_FORM}" target="_blank" rel="noopener">Partnership application</a><a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a></nav>
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

// ---- Alumni globe (alumni.html) -----------------------------------------------------
const globeEl = document.getElementById('globe');
if (globeEl) {
  const places = window.HCG_MAP || [];
  const origin = { name: 'Hamilton College', lat: 43.0526, lng: -75.4060 };
  const list = document.querySelector('[data-places]');
  list.innerHTML = places.map((p, i) => `<li><button type="button" data-i="${i}">${p.city}</button><span>${p.count} ${p.count === 1 ? p.unit : p.unit + 's'}</span></li>`).join('');

  const start = async () => {
    if (!window.Globe || !window.topojson) throw new Error('globe library unavailable');
    const world = await fetch('data/countries-110m.json').then((r) => r.json());
    const countries = window.topojson.feature(world, world.objects.countries).features;
    // The hexagon map library cannot process North Korea's detailed outline (it throws),
    // so that one country uses a simplified outline that looks the same at this dot size.
    const nk = countries.find((c) => c.id === '408');
    if (nk) nk.geometry = { type: 'Polygon', coordinates: [[[124.3, 40.0], [125.0, 40.6], [126.9, 41.8], [128.1, 42.0], [129.7, 42.4], [130.6, 42.4], [129.9, 41.0], [129.2, 40.7], [127.5, 39.6], [128.3, 38.6], [127.0, 38.3], [126.1, 37.7], [125.3, 37.7], [124.7, 38.1], [125.3, 38.6], [125.1, 39.6], [124.3, 40.0]]] };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const size = () => { const w = globeEl.clientWidth; return [w, Math.min(w, 640)]; };
    const [w, h] = size();
    const globe = window.Globe({ animateIn: !reduce })(globeEl)
      .width(w).height(h)
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true).atmosphereColor('#7f9fe0').atmosphereAltitude(0.16)
      .hexPolygonsData(countries).hexPolygonResolution(3).hexPolygonMargin(0.35)
      .hexPolygonColor(() => 'rgba(214, 223, 239, 0.55)')
      .pointsData([...places, { ...origin, count: 0, city: origin.name, origin: true }])
      .pointLat('lat').pointLng('lng')
      .pointColor((d) => (d.origin ? '#ffffff' : '#c9ad6a'))
      .pointAltitude((d) => (d.origin ? 0.01 : 0.02 + d.count * 0.025))
      .pointRadius((d) => (d.origin ? 0.5 : 0.55))
      .pointLabel((d) => (d.origin ? 'Hamilton College, Clinton, NY' : `${d.city}: ${d.count} ${d.count === 1 ? d.unit : d.unit + 's'}`))
      .arcsData(places.map((p) => ({ startLat: origin.lat, startLng: origin.lng, endLat: p.lat, endLng: p.lng })))
      .arcColor(() => ['rgba(255,255,255,0.15)', '#c9ad6a'])
      .arcStroke(0.5)
      .arcDashLength(reduce ? 1 : 0.5).arcDashGap(reduce ? 0 : 0.25).arcDashAnimateTime(reduce ? 0 : 2600)
      .pointOfView({ lat: 38, lng: -78, altitude: 1.9 });
    globe.globeMaterial().color.set('#0b2a6f');
    const controls = globe.controls();
    controls.enableZoom = false;
    controls.autoRotate = !reduce;
    controls.autoRotateSpeed = 0.35;
    addEventListener('resize', () => { const [nw, nh] = size(); globe.width(nw).height(nh); });
    list.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const p = places[+b.dataset.i];
      controls.autoRotate = false;
      globe.pointOfView({ lat: p.lat, lng: p.lng, altitude: 1.2 }, 1200);
    });
    globeEl.querySelector('.globe-fallback')?.remove();
  };
  start().catch(() => {
    const fb = globeEl.querySelector('.globe-fallback');
    if (fb) fb.textContent = 'The 3D globe could not load in this browser. The list beside it shows the same locations.';
  });
}
