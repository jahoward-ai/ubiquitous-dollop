// Folder that holds this script = the site root. Lets every page use the same links,
// whether the site is served from a domain root, a GitHub Pages subfolder, or a local file.
const ROOT = document.currentScript ? new URL('.', document.currentScript.src).href : '/';
const page = document.body.dataset.page || document.querySelector('[data-page]')?.dataset.page || '';

// ---- Settings HCG may want to change ------------------------------------------------
const HCG_EMAIL = 'hconsult@hamilton.edu';
const PARTNERSHIP_FORM = 'https://forms.gle/L6PbRgAhz2x7ijzN7';
const LINKEDIN = 'https://www.linkedin.com/company/hamilton-consulting-group';
// Optional: paste a Formspree form address here (e.g. 'https://formspree.io/f/abcdwxyz') to
// have the request form send messages straight to HCG's inbox. Left empty, the form prepares
// the message and opens it in Gmail, Outlook, or the visitor's email app instead.
const HCG_FORM_ENDPOINT = '';
// -------------------------------------------------------------------------------------

const header = document.querySelector('[data-site-header]');
if (header) {
  const learnCurrent = ['learn', 'industry', 'recruiting', 'resources'].includes(page);
  const quillCurrent = page === 'quill' || page.startsWith('quill-');
  const current = (key) => page === key ? ' aria-current="page"' : '';
  header.className = 'site-header';
  header.innerHTML = `
    <div class="container nav">
      <a class="brand" href="${ROOT}index.html" aria-label="Hamilton Consulting Group home"><img src="${ROOT}assets/hcg-wordmark-white.png" alt="Hamilton Consulting Group"></a>
      <button class="menu-button" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-navigation"><span></span><span></span><span></span></button>
      <nav class="nav-links" id="primary-navigation" aria-label="Primary navigation">
        <a href="${ROOT}about/index.html"${current('about')}>About</a>
        <div class="nav-dropdown">
          <a class="nav-dropdown-main" href="${ROOT}learn/index.html"${learnCurrent ? ' aria-current="page"' : ''}>Learn &amp; Prepare</a>
          <button class="submenu-toggle" type="button" aria-label="Open Learn and Prepare menu" aria-expanded="false" aria-controls="learn-submenu"><span aria-hidden="true">⌄</span></button>
          <div class="submenu" id="learn-submenu">
            <a href="${ROOT}learn/index.html"${current('learn')}>Start here</a>
            <a href="${ROOT}industry/index.html"${current('industry')}>Industry Knowledge</a>
            <a href="${ROOT}recruiting/index.html#recruiting"${current('recruiting')}>Recruiting</a>
            <a href="${ROOT}recruiting/index.html#case-preparation">Case Preparation</a>
            <a href="${ROOT}resources/index.html"${current('resources')}>Presentations &amp; Resources</a>
          </div>
        </div>
        <div class="nav-dropdown">
          <a class="nav-dropdown-main" href="${ROOT}quill/index.html"${quillCurrent ? ' aria-current="page"' : ''}>Quill</a>
          <button class="submenu-toggle" type="button" aria-label="Open Quill menu" aria-expanded="false" aria-controls="quill-submenu"><span aria-hidden="true">⌄</span></button>
          <div class="submenu" id="quill-submenu">
            <a href="${ROOT}quill/index.html"${current('quill')}>Overview</a>
            <a href="${ROOT}quill/get-involved/index.html"${current('quill-get-involved')}>Get Involved</a>
            <a href="${ROOT}quill/work-with-us/index.html"${current('quill-work-with-us')}>Work With Us</a>
            <a href="${ROOT}quill/skills/index.html"${current('quill-skills')}>Skills &amp; Experience</a>
            <a href="${ROOT}quill/engagements/index.html"${current('quill-engagements')}>Past Engagements</a>
          </div>
        </div>
        <a href="${ROOT}events/index.html"${current('events')}>Events</a>
        <a href="${ROOT}outcomes/index.html"${current('outcomes')}>Alumni</a>
        <a href="${ROOT}contact/index.html"${current('contact')}>Contact</a>
        <a class="nav-cta" href="${ROOT}apply/index.html"${current('apply')}>Join HCG</a>
      </nav>
    </div>`;
}

const footer = document.querySelector('[data-site-footer]');
if (footer) {
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container footer-columns">
      <div class="footer-brand"><img src="${ROOT}assets/hcg-wordmark-white.png" alt="Hamilton Consulting Group"><p>A student organization at Hamilton College.</p><p class="footer-email">${HCG_EMAIL}</p></div>
      <nav aria-label="Learn and prepare"><h2>Learn &amp; Prepare</h2><a href="${ROOT}industry/index.html">Industry Knowledge</a><a href="${ROOT}recruiting/index.html">Recruiting &amp; Case Prep</a><a href="${ROOT}resources/index.html">Presentations &amp; Resources</a><a href="${ROOT}contact/index.html#office-hours">Casing office hours</a></nav>
      <nav aria-label="Quill"><h2>Quill</h2><a href="${ROOT}quill/index.html">Overview</a><a href="${ROOT}quill/get-involved/index.html">For students</a><a href="${ROOT}quill/work-with-us/index.html">For organizations</a><a href="${ROOT}quill/engagements/index.html">Past engagements</a></nav>
      <nav aria-label="The group"><h2>The Group</h2><a href="${ROOT}about/index.html">About &amp; Executive Board</a><a href="${ROOT}events/index.html">Events</a><a href="${ROOT}outcomes/index.html">Alumni in consulting</a><a href="${ROOT}apply/index.html">Join HCG</a><a href="${PARTNERSHIP_FORM}" target="_blank" rel="noopener noreferrer">Partnership application</a><a href="${LINKEDIN}" target="_blank" rel="noopener noreferrer">LinkedIn</a></nav>
    </div>
    <div class="container footer-base"><p>© <span data-year></span> Hamilton Consulting Group</p><a href="${ROOT}contact/index.html">Contact us</a></div>`;
}

// ---- Navigation menus -------------------------------------------------------------
// Desktop: menus open on hover with a short grace period, so moving the mouse from the
// label down into the menu never closes it. Touch screens and keyboards use the arrow
// button (or the first tap on the label).
const menuButton = document.querySelector('.menu-button');
const dropdowns = [...document.querySelectorAll('.nav-dropdown')];
const desktopNav = window.matchMedia('(min-width: 1181px)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

const setDropdown = (dropdown, open) => {
  dropdown.classList.toggle('submenu-open', open);
  dropdown.querySelector('.submenu-toggle')?.setAttribute('aria-expanded', String(open));
};

const closeSubmenus = (focusTrigger = false) => {
  const openButton = document.querySelector('.submenu-toggle[aria-expanded="true"]');
  dropdowns.forEach((dropdown) => setDropdown(dropdown, false));
  if (focusTrigger) openButton?.focus();
};

const openOnly = (dropdown) => {
  dropdowns.forEach((other) => setDropdown(other, other === dropdown));
};

dropdowns.forEach((dropdown) => {
  let closeTimer;
  dropdown.addEventListener('mouseenter', () => {
    if (!desktopNav.matches || !finePointer.matches) return;
    clearTimeout(closeTimer);
    openOnly(dropdown);
  });
  dropdown.addEventListener('mouseleave', () => {
    if (!desktopNav.matches || !finePointer.matches) return;
    closeTimer = setTimeout(() => setDropdown(dropdown, false), 300);
  });
  dropdown.querySelector('.submenu-toggle')?.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = !dropdown.classList.contains('submenu-open');
    if (open) openOnly(dropdown); else setDropdown(dropdown, false);
  });
  // On a touch screen at desktop width, the first tap on "Quill" opens its menu
  // instead of leaving the page; a second tap follows the link.
  dropdown.querySelector('.nav-dropdown-main')?.addEventListener('click', (event) => {
    if (desktopNav.matches && !finePointer.matches && !dropdown.classList.contains('submenu-open')) {
      event.preventDefault();
      openOnly(dropdown);
    }
  });
  dropdown.addEventListener('focusout', (event) => {
    if (!dropdown.contains(event.relatedTarget)) setDropdown(dropdown, false);
  });
});

const closeMobileMenu = () => {
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');
  closeSubmenus();
};

menuButton?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (!open) closeSubmenus();
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-dropdown')) closeSubmenus();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (document.querySelector('.submenu-toggle[aria-expanded="true"]')) {
    closeSubmenus(true);
    return;
  }
  if (document.body.classList.contains('menu-open')) {
    closeMobileMenu();
    menuButton?.focus();
  }
});

document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', (event) => {
  if (!event.defaultPrevented) closeMobileMenu();
}));
document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });

if (window.location.hash) {
  const scrollToHash = () => {
    let target = null;
    try { target = document.querySelector(window.location.hash); } catch { /* not an element id */ }
    if (target) window.requestAnimationFrame(() => target.scrollIntoView());
  };
  window.addEventListener('load', scrollToHash, { once: true });
  document.fonts?.ready.then(scrollToHash);
}

// ---- Presentations (listed in resources.js) ---------------------------------------
const resourceCard = (resource, compact = false) => {
  const actions = resource.public
    ? `<div class="resource-actions"><a class="button" href="${ROOT}${resource.view}" target="_blank" rel="noopener noreferrer">Open presentation (PDF)</a></div>`
    : `<div class="resource-actions"><a class="text-link" href="${ROOT}contact/index.html#archive">Request this resource</a></div>`;
  return `<article class="resource-card${compact ? ' compact' : ''}" id="${resource.id}"><div class="resource-meta"><span>${resource.topic}</span><time>${resource.date}</time></div><h3>${resource.title}</h3><p>${resource.description}</p>${actions}</article>`;
};

if (window.HCG_RESOURCES) {
  document.querySelectorAll('[data-resource-list]').forEach((list) => {
    const topic = list.dataset.topic;
    const resources = topic ? window.HCG_RESOURCES.filter((item) => item.topicKey === topic) : window.HCG_RESOURCES;
    list.innerHTML = resources.map((item) => resourceCard(item, list.dataset.compact === 'true')).join('');
  });

  document.querySelectorAll('[data-past-event-list]').forEach((list) => {
    list.innerHTML = window.HCG_RESOURCES.map((item) => {
      const actions = item.public
        ? `<div class="resource-actions"><a class="text-link" href="${ROOT}${item.view}" target="_blank" rel="noopener noreferrer">Open the presentation (PDF)</a></div>`
        : `<a class="text-link" href="${ROOT}contact/index.html#archive">Request the materials</a>`;
      return `<article class="past-event" id="event-${item.id}"><div><time>${item.date}</time><span>${item.topic}</span></div><div><h3>${item.title}</h3><p>${item.eventDescription}</p>${actions}</div></article>`;
    }).join('');
  });
}

// ---- Request form on the contact page ---------------------------------------------
const requestDefinitions = {
  general: { label: 'General programming', title: 'Join HCG general programming', description: 'General Membership is open to interested Hamilton students and does not require a leadership application.', subject: 'Joining HCG general programming', guidance: ['Your name and class year', 'A brief note that you would like to receive general programming updates'] },
  'office-hours': { label: 'Case preparation', title: 'Ask about casing office hours', description: 'Tell HCG what you want to practice and we will reply with the current office-hours times and format.', subject: 'Casing office hours', guidance: ['Your name and class year', 'What you would like help practicing'] },
  'case-book': { label: 'Case resource', title: 'Request the HCG case book', description: 'Tell HCG where you are in your preparation and we will reply with access to the case book.', subject: 'HCG case book access', guidance: ['Your name and class year', 'Your current stage of case preparation'] },
  'case-library': { label: 'Case resource', title: 'Request the HCG case library', description: 'Tell HCG what kind of practice you need and we will reply with access to the case library.', subject: 'HCG case library access', guidance: ['Your name and class year', 'The kind of practice material you are looking for'] },
  'practice-case': { label: 'Case resource', title: 'Request an individual practice case', description: 'Tell HCG your experience level and the skill you want to work on, and we will match you with a case.', subject: 'HCG practice case request', guidance: ['Your name and class year', 'Your experience level', 'The skill or case type you want to practice'] },
  archive: { label: 'Resources', title: 'Request a presentation or resource', description: 'Ask for a past HCG presentation, recording, or resource that is not posted on the site.', subject: 'HCG resource request', guidance: ['The resource or topic you are looking for', 'How you hope to use it'] },
  industry: { label: 'Industry Knowledge', title: 'Ask HCG an industry question', description: 'Ask about firms, industries, or consulting work, or suggest a topic for a future session.', subject: 'Industry Knowledge question', guidance: ['Your name and class year', 'The firm, industry, or consulting topic you are exploring'] },
  events: { label: 'Events', title: 'Ask about HCG programming', description: 'Ask about upcoming sessions or suggest one you would like HCG to run.', subject: 'HCG events and programming', guidance: ['Your name and class year', 'The kind of event or programming you are interested in'] },
  'quill-student': { label: 'Quill student interest', title: 'Express interest in Quill', description: 'Tell HCG that you are interested in future Quill project work. Interest does not guarantee staffing on an engagement.', subject: 'Student interest in HCG Quill', guidance: ['Your name and class year', 'Relevant interests or experience', 'Your current capacity for project work'] },
  'quill-client': { label: 'Prospective client inquiry', title: 'Discuss a potential Quill project', description: 'An inquiry begins an exploratory conversation. It does not guarantee that Quill will accept or staff a project.', subject: 'Potential HCG Quill project', guidance: ['Organization', 'Contact name and email', 'Brief description of the question or challenge', 'Anticipated timing'] }
};

const copyText = async (text, field) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    if (field) { field.focus(); field.select(); }
    try { return document.execCommand('copy'); } catch { return false; }
  }
};

const requestPage = document.querySelector('[data-request-page]');
if (requestPage) {
  const form = requestPage.querySelector('[data-request-form]');
  const topicSelect = form.querySelector('#request-topic');
  const details = form.querySelector('#request-details');
  const result = requestPage.querySelector('[data-request-result]');
  topicSelect.innerHTML = Object.entries(requestDefinitions).map(([key, item]) => `<option value="${key}">${item.title}</option>`).join('');

  const showTopic = (key, fromLink) => {
    const request = requestDefinitions[key] || requestDefinitions.general;
    if (fromLink) topicSelect.value = requestDefinitions[key] ? key : 'general';
    requestPage.querySelector('[data-request-label]').textContent = request.label;
    requestPage.querySelector('[data-request-title]').textContent = request.title;
    requestPage.querySelector('[data-request-description]').textContent = request.description;
    details.placeholder = request.guidance.filter((item) => !/name and class year/i.test(item)).join('\n') || 'Your message';
    result.hidden = true;
  };
  const keyFromLink = () => window.location.hash.slice(1) || new URLSearchParams(window.location.search).get('request') || 'general';
  showTopic(keyFromLink(), true);
  window.addEventListener('hashchange', () => { showTopic(keyFromLink(), true); requestPage.scrollIntoView(); });
  topicSelect.addEventListener('change', () => showTopic(topicSelect.value, false));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const request = requestDefinitions[topicSelect.value];
    const name = form.querySelector('#request-name').value.trim();
    const year = form.querySelector('#request-year').value.trim();
    const email = form.querySelector('#request-email').value.trim();
    const subject = `${request.subject}${name ? ` – ${name}` : ''}`;
    const body = `Hello HCG,\n\n${details.value.trim()}\n\nName: ${name}${year ? `\nClass year / organization: ${year}` : ''}\nReply to: ${email}\nTopic: ${request.title}\n\nThank you.`;

    if (HCG_FORM_ENDPOINT) {
      try {
        const response = await fetch(HCG_FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name, year, email, topic: request.title, message: details.value.trim(), _subject: subject }) });
        if (response.ok) {
          form.reset();
          result.innerHTML = '<h3>Request sent.</h3><p>HCG will reply to the email address you gave. If you do not hear back within a week, email us directly.</p>';
          result.hidden = false;
          result.focus();
          return;
        }
      } catch { /* fall through to the email options below */ }
    }

    const enc = encodeURIComponent;
    result.innerHTML = `
      <h3>Your request is ready to send.</h3>
      <p>Choose how you want to send it. Each option opens a new message to ${HCG_EMAIL} with everything filled in.</p>
      <div class="send-options">
        <a class="button" href="https://mail.google.com/mail/?view=cm&fs=1&to=${enc(HCG_EMAIL)}&su=${enc(subject)}&body=${enc(body)}" target="_blank" rel="noopener noreferrer">Send with Gmail</a>
        <a class="button" href="https://outlook.office.com/mail/deeplink/compose?to=${enc(HCG_EMAIL)}&subject=${enc(subject)}&body=${enc(body)}" target="_blank" rel="noopener noreferrer">Send with Outlook</a>
        <a class="button secondary" href="mailto:${HCG_EMAIL}?subject=${enc(subject)}&body=${enc(body)}">Use my email app</a>
      </div>
      <label class="message-preview-label" for="request-preview">Or copy the message and paste it into any email to ${HCG_EMAIL}:</label>
      <textarea id="request-preview" class="message-preview" readonly rows="8"></textarea>
      <button class="button secondary" type="button" data-copy-message>Copy message</button>
      <p class="copy-status" aria-live="polite"></p>`;
    const preview = result.querySelector('#request-preview');
    preview.value = `To: ${HCG_EMAIL}\nSubject: ${subject}\n\n${body}`;
    result.querySelector('[data-copy-message]').addEventListener('click', async () => {
      const ok = await copyText(preview.value, preview);
      result.querySelector('.copy-status').textContent = ok ? 'Message copied. Paste it into a new email.' : 'Select the text above and copy it.';
    });
    result.hidden = false;
    result.focus();
  });
}

document.querySelectorAll('[data-copy-email]').forEach((button) => button.addEventListener('click', async () => {
  const ok = await copyText(HCG_EMAIL);
  const status = button.parentElement.querySelector('[data-copy-status]') || document.querySelector('[data-copy-status]');
  if (status) status.textContent = ok ? 'Email address copied.' : `Copy this address: ${HCG_EMAIL}`;
}));
