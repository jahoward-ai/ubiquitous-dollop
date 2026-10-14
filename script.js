const page = document.body.dataset.page || '';

const header = document.querySelector('[data-site-header]');
if (header) {
  const learnCurrent = ['learn', 'industry', 'recruiting', 'resources'].includes(page);
  const quillCurrent = page === 'quill' || page.startsWith('quill-');
  const current = (key) => page === key ? ' aria-current="page"' : '';
  header.className = 'site-header';
  header.innerHTML = `
    <div class="container nav">
      <a class="brand" href="/" aria-label="Hamilton Consulting Group home"><img src="/assets/hcg-wordmark-white.png" alt="Hamilton Consulting Group"></a>
      <button class="menu-button" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-navigation"><span></span><span></span><span></span></button>
      <nav class="nav-links" id="primary-navigation" aria-label="Primary navigation">
        <a href="/about/"${current('about')}>About</a>
        <div class="nav-dropdown">
          <a class="nav-dropdown-main" href="/learn/"${learnCurrent ? ' aria-current="page"' : ''}>Learn &amp; Prepare</a>
          <button class="submenu-toggle" type="button" aria-label="Open Learn and Prepare menu" aria-expanded="false" aria-controls="learn-submenu"><span aria-hidden="true">⌄</span></button>
          <div class="submenu" id="learn-submenu">
            <a href="/learn/"${current('learn')}>Overview</a>
            <a href="/industry/"${current('industry')}>Industry Knowledge</a>
            <a href="/recruiting/#recruiting"${current('recruiting')}>Recruiting</a>
            <a href="/recruiting/#case-preparation">Case Preparation</a>
            <a href="/resources/"${current('resources')}>Resources</a>
          </div>
        </div>
        <div class="nav-dropdown">
          <a class="nav-dropdown-main" href="/quill/"${quillCurrent ? ' aria-current="page"' : ''}>Quill</a>
          <button class="submenu-toggle" type="button" aria-label="Open Quill menu" aria-expanded="false" aria-controls="quill-submenu"><span aria-hidden="true">⌄</span></button>
          <div class="submenu" id="quill-submenu">
            <a href="/quill/"${current('quill')}>Overview</a>
            <a href="/quill/get-involved/"${current('quill-get-involved')}>Get Involved</a>
            <a href="/quill/work-with-us/"${current('quill-work-with-us')}>Work With Us</a>
            <a href="/quill/skills/"${current('quill-skills')}>Skills &amp; Experience</a>
            <a href="/quill/engagements/"${current('quill-engagements')}>Past Engagements</a>
          </div>
        </div>
        <a href="/events/"${current('events')}>Events</a>
        <a href="/outcomes/"${current('outcomes')}>Hamilton in Consulting</a>
        <a class="nav-cta" href="/apply/"${current('apply')}>Join HCG</a>
      </nav>
    </div>`;
}

const footer = document.querySelector('[data-site-footer]');
if (footer) {
  footer.className = 'site-footer';
  footer.innerHTML = `<div class="container footer-grid"><img src="/assets/hcg-wordmark-white.png" alt="Hamilton Consulting Group"><div class="footer-links"><a href="/contact/">Contact</a><a href="mailto:hconsult@hamilton.edu">hconsult@hamilton.edu</a><a href="https://www.linkedin.com/company/hamilton-consulting-group" target="_blank" rel="noopener noreferrer">LinkedIn</a></div><p>© <span data-year></span> Hamilton Consulting Group.</p></div>`;
}

const menuButton = document.querySelector('.menu-button');
const submenuButtons = [...document.querySelectorAll('.submenu-toggle')];

const closeSubmenus = (focusTrigger = false) => {
  const openButton = document.querySelector('.submenu-toggle[aria-expanded="true"]');
  document.querySelectorAll('.nav-dropdown').forEach((item) => item.classList.remove('submenu-open'));
  submenuButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
  if (focusTrigger) openButton?.focus();
};

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

submenuButtons.forEach((button) => button.addEventListener('click', (event) => {
  event.stopPropagation();
  const dropdown = button.closest('.nav-dropdown');
  const open = button.getAttribute('aria-expanded') !== 'true';
  closeSubmenus();
  dropdown?.classList.toggle('submenu-open', open);
  button.setAttribute('aria-expanded', String(open));
}));

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

document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', closeMobileMenu));
document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });

if (window.location.hash) {
  const scrollToHash = () => {
    const target = document.querySelector(window.location.hash);
    if (target) window.requestAnimationFrame(() => target.scrollIntoView());
  };
  window.addEventListener('load', scrollToHash, { once: true });
  document.fonts?.ready.then(scrollToHash);
}

const resourceCard = (resource, compact = false) => {
  const actions = resource.public
    ? `<div class="resource-actions"><a class="text-link" href="${resource.view}" target="_blank" rel="noopener noreferrer">View presentation</a><a class="text-link" href="${resource.download}" download>Download PDF</a></div>`
    : `<div class="resource-actions"><a class="text-link" href="${resource.details}">View resource details</a><a class="text-link" href="/contact/?request=archive">Ask about access</a></div>`;
  return `<article class="resource-card${compact ? ' compact' : ''}" id="${resource.id}"><div class="resource-meta"><span>${resource.topic}</span><time>${resource.date}</time></div><h3>${resource.title}</h3><p>${resource.description}</p><p class="access-note"><strong>Access:</strong> ${resource.access}</p>${actions}</article>`;
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
        ? `<div class="resource-actions"><a class="text-link" href="${item.view}" target="_blank" rel="noopener noreferrer">View presentation</a><a class="text-link" href="${item.download}" download>Download PDF</a><a class="text-link" href="/resources/#${item.id}">Resource details</a></div>`
        : `<a class="text-link" href="/resources/#${item.id}">Presentation and access details</a>`;
      return `<article class="past-event" id="event-${item.id}"><div><time>${item.date}</time><span>${item.topic}</span></div><div><h3>${item.title}</h3><p>${item.eventDescription}</p>${actions}</div></article>`;
    }).join('');
  });
}

const requestDefinitions = {
  general: { label: 'General programming', title: 'Join HCG general programming', description: 'General Membership is open to interested Hamilton students and does not require a leadership application.', subject: 'Joining HCG general programming', guidance: ['Your name and class year', 'A brief note that you would like to receive general programming updates'] },
  'office-hours': { label: 'Case preparation', title: 'Ask about casing office hours', description: 'Ask HCG for the current office-hours format and any available participation details.', subject: 'Casing office hours', guidance: ['Your name and class year', 'What you would like help practicing'] },
  'case-book': { label: 'Case resource', title: 'Request the HCG case book', description: 'Ask HCG to confirm the current case-book contents, access conditions, and whether it fits your preparation needs.', subject: 'HCG case book access', guidance: ['Your name and class year', 'Your current stage of case preparation'] },
  'case-library': { label: 'Case resource', title: 'Request the HCG case library', description: 'Ask HCG to confirm the current case-library contents, access conditions, and whether it fits your preparation needs.', subject: 'HCG case library access', guidance: ['Your name and class year', 'The kind of practice material you are looking for'] },
  'practice-case': { label: 'Case resource', title: 'Request an individual practice case', description: 'Ask whether an individual practice case is available for your current preparation level.', subject: 'HCG practice case request', guidance: ['Your name and class year', 'Your experience level', 'The skill or case type you want to practice'] },
  archive: { label: 'Resources', title: 'Ask about a presentation or resource', description: 'Use this route for a resource that is not publicly available in the archive.', subject: 'HCG resource question', guidance: ['The resource or topic you are looking for', 'How you hope to use it'] },
  industry: { label: 'Industry Knowledge', title: 'Ask HCG an industry-learning question', description: 'Ask about HCG programming or guidance related to firms, industries, and consulting work.', subject: 'Industry Knowledge question', guidance: ['Your name and class year', 'The firm, industry, or consulting topic you are exploring'] },
  events: { label: 'Events', title: 'Ask about HCG programming', description: 'Use this route when no upcoming schedule is posted and you want to ask about future programming.', subject: 'HCG events and programming', guidance: ['Your name and class year', 'The kind of event or programming you are interested in'] },
  'quill-student': { label: 'Quill student interest', title: 'Express interest in Quill', description: 'Tell HCG that you are interested in future Quill project work. Interest does not guarantee staffing on an engagement.', subject: 'Student interest in HCG Quill', guidance: ['Your name and class year', 'Relevant interests or experience', 'Your current capacity for project work'] },
  'quill-client': { label: 'Prospective client inquiry', title: 'Discuss a potential Quill project', description: 'An inquiry begins an exploratory conversation. It does not guarantee that Quill will accept or staff a project.', subject: 'Potential HCG Quill project', guidance: ['Organization', 'Contact name and email', 'Brief description of the question or challenge', 'Anticipated timing'] }
};

const requestPage = document.querySelector('[data-request-page]');
if (requestPage) {
  const key = new URLSearchParams(window.location.search).get('request') || 'general';
  const request = requestDefinitions[key] || requestDefinitions.general;
  requestPage.querySelector('[data-request-label]').textContent = request.label;
  requestPage.querySelector('[data-request-title]').textContent = request.title;
  requestPage.querySelector('[data-request-description]').textContent = request.description;
  requestPage.querySelector('[data-request-guidance]').innerHTML = request.guidance.map((item) => `<li>${item}</li>`).join('');
  const body = `Hello HCG,\n\n${request.guidance.map((item) => `${item}:`).join('\n')}\n\nThank you.`;
  const emailAction = requestPage.querySelector('[data-email-action]');
  emailAction.href = `mailto:hconsult@hamilton.edu?subject=${encodeURIComponent(request.subject)}&body=${encodeURIComponent(body)}`;
  emailAction.textContent = 'Open email to HCG';
}

document.querySelectorAll('[data-copy-email]').forEach((button) => button.addEventListener('click', async () => {
  const email = 'hconsult@hamilton.edu';
  const status = document.querySelector('[data-copy-status]');
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    const field = document.createElement('textarea');
    field.value = email;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    document.execCommand('copy');
    field.remove();
  }
  if (status) status.textContent = 'Email address copied.';
}));
