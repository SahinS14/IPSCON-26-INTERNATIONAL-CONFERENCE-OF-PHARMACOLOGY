document.documentElement.classList.add('js');
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const uiIcon = (name) =>
  `<svg class="icon" aria-hidden="true" focusable="false"><use href="#ui-${name}"/></svg>`;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.08 },
);
$$('.reveal').forEach((e, i) => {
  e.style.transitionDelay = `${(i % 3) * 50}ms`;
  observer.observe(e);
});
let paused = false;
$('#motion-toggle')?.addEventListener('click', (e) => {
  paused = !paused;
  document.body.classList.toggle('motion-paused', paused);
  e.currentTarget.setAttribute('aria-pressed', String(paused));
  e.currentTarget.innerHTML = paused
    ? uiIcon('play') + ' Resume motion'
    : uiIcon('pause') + ' Pause motion';
});
const menu = $('.menu-toggle'),
  nav = $('#navigation');
function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
  menu.innerHTML = uiIcon('menu');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menu.innerHTML = uiIcon(open ? 'close' : 'menu');
});
$$('nav a').forEach((a) => a.addEventListener('click', closeMenu));
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu();
    menu.focus();
  }
});
let scheduled = false;
addEventListener(
  'scroll',
  () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      $('.read-progress').style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      scheduled = false;
    });
  },
  { passive: true },
);
const delegateRates = {
  early: [
    ['Student', 3000],
    ['Resident', 3600],
    ['IPS member', 4500],
    ['Non-IPS member', 5000],
    ['International delegate', 8000],
  ],
  regular: [
    ['Student', 4000],
    ['Resident', 5000],
    ['IPS member', 7000],
    ['Non-IPS member', 7500],
    ['International delegate', 12000],
  ],
  late: [
    ['Student', 4500],
    ['Resident', 6000],
    ['IPS member', 8000],
    ['Non-IPS member', 9000],
    ['International delegate', 15000],
  ],
  spot: [
    ['Indian delegate', 10000],
    ['International delegate', 15000],
  ],
};
function showFee() {
  $('#fee').textContent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number($('#category').value));
}
$('#category').addEventListener('change', showFee);
$('#rate-window').addEventListener('change', (e) => {
  const old = $('#category').selectedOptions[0]?.textContent;
  const rows = delegateRates[e.target.value];
  $('#category').replaceChildren(
    ...rows.map(([label, value]) => {
      const option = document.createElement('option');
      option.textContent = label;
      option.value = String(value);
      option.selected = label === old;
      return option;
    }),
  );
  showFee();
});
$('#year').textContent = new Date().getFullYear();
const impactArticles = $$('[data-impact]');
let impactActive = -1,
  impactFrame = 0,
  impactValue = 0;
function activateImpact(index) {
  if (index === impactActive) return;
  impactActive = index;
  impactArticles.forEach((el, i) => el.classList.toggle('is-current', i === index));
  $('.impact-index').textContent = `0${index + 1} / 0${impactArticles.length}`;
  $('#impact-label').textContent = impactArticles[index].dataset.impactLabel;
  $('.impact-line i').style.transform = `translateX(${index * 100}%)`;
  cancelAnimationFrame(impactFrame);
  const target = Number(impactArticles[index].dataset.impact);
  if (!Number.isFinite(target)) {
    $('#impact-number').textContent = '∞';
    impactValue = 0;
    return;
  }
  if (reduced.matches || paused) {
    impactValue = target;
    $('#impact-number').textContent = target;
    return;
  }
  const from = impactValue,
    start = performance.now();
  function count(now) {
    const p = Math.min((now - start) / 850, 1),
      eased = 1 - Math.pow(1 - p, 3);
    impactValue = from + (target - from) * eased;
    $('#impact-number').textContent = Math.round(impactValue);
    if (p < 1) impactFrame = requestAnimationFrame(count);
  }
  impactFrame = requestAnimationFrame(count);
}
const impactObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) activateImpact(impactArticles.indexOf(entry.target));
    }
  },
  { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
);
impactArticles.forEach((el) => impactObserver.observe(el));
impactArticles[0].classList.add('is-current');
const eventTabs = $$('[role="tab"][aria-controls^="event-panel"]');
function selectEvent(button, focus = false) {
  const closing = button.getAttribute('aria-selected') === 'true';
  eventTabs.forEach((tab) => {
    const selected = tab === button && !closing;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = tab === button ? 0 : -1;
    $('#' + tab.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) button.focus();
  const panel = $('#' + button.getAttribute('aria-controls'));
  if (!closing && !reduced.matches)
    panel.animate([{ opacity: 0.3 }, { opacity: 1 }], {
      duration: 200,
      easing: 'cubic-bezier(.23,1,.32,1)',
    });
}
eventTabs.forEach((tab, index) => {
  tab.setAttribute('aria-selected', 'false');
  tab.tabIndex = index === 0 ? 0 : -1;
  $('#' + tab.getAttribute('aria-controls')).hidden = true;
  tab.addEventListener('click', () => selectEvent(tab));
  tab.addEventListener('keydown', (e) => {
    let next;
    if (e.key === 'ArrowRight') next = (index + 1) % eventTabs.length;
    if (e.key === 'ArrowLeft') next = (index - 1 + eventTabs.length) % eventTabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = eventTabs.length - 1;
    if (next !== undefined) {
      e.preventDefault();
      eventTabs.forEach((t, i) => (t.tabIndex = i === next ? 0 : -1));
      eventTabs[next].focus();
    }
  });
});
const memberTabs = $$('[role="tab"][aria-controls^="member-panel"]');
let memberActive = 0;
function setMember(index, focus = false) {
  memberActive = (index + memberTabs.length) % memberTabs.length;
  memberTabs.forEach((tab, i) => {
    const selected = i === memberActive;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    $('#' + tab.getAttribute('aria-controls')).hidden = !selected;
  });
  const tab = memberTabs[memberActive];
  if (focus) tab.focus({ preventScroll: true });
  tab.scrollIntoView({
    behavior: reduced.matches ? 'instant' : 'smooth',
    block: 'nearest',
    inline: 'nearest',
  });
  $('#member-position').textContent = `0${memberActive + 1} / 07`;
  const panel = $('#' + tab.getAttribute('aria-controls'));
  if (!reduced.matches)
    panel.animate(
      [
        { opacity: 0.2, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 250, easing: 'cubic-bezier(.23,1,.32,1)' },
    );
}
memberTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setMember(index));
  tab.addEventListener('keydown', (e) => {
    let next;
    if (e.key === 'ArrowRight') next = index + 1;
    if (e.key === 'ArrowLeft') next = index - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = memberTabs.length - 1;
    if (next !== undefined) {
      e.preventDefault();
      setMember(next, true);
    }
  });
});
$('#member-previous').addEventListener('click', () => setMember(memberActive - 1));
$('#member-next').addEventListener('click', () => setMember(memberActive + 1));
const aboutTabs = $$('[role="tab"][aria-controls^="about-panel"]');
let aboutActive = 0;
const aboutYears = ['1921', '1966', '1969', '2026'];
function setAbout(index, focus = false) {
  aboutActive = (index + aboutTabs.length) % aboutTabs.length;
  aboutTabs.forEach((tab, i) => {
    const selected = i === aboutActive;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    $('#' + tab.getAttribute('aria-controls')).hidden = !selected;
  });
  $$('[data-about-image]').forEach((image, i) =>
    image.classList.toggle('is-active', i === aboutActive),
  );
  $('#about-year').textContent = aboutYears[aboutActive];
  $('#about-position').textContent = `0${aboutActive + 1} / 04`;
  if (focus) aboutTabs[aboutActive].focus();
  if (!reduced.matches)
    $('#about-panel-' + aboutActive).animate(
      [
        { opacity: 0.3, transform: 'translateY(7px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 250, easing: 'cubic-bezier(.23,1,.32,1)' },
    );
}
aboutTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setAbout(index));
  tab.addEventListener('keydown', (e) => {
    let next;
    if (e.key === 'ArrowRight') next = index + 1;
    if (e.key === 'ArrowLeft') next = index - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = aboutTabs.length - 1;
    if (next !== undefined) {
      e.preventDefault();
      setAbout(next, true);
    }
  });
});
$('#about-previous').addEventListener('click', () => setAbout(aboutActive - 1));
$('#about-next').addEventListener('click', () => setAbout(aboutActive + 1));
const historyDialog = $('#history-dialog');
$('#open-history').addEventListener('click', () => {
  historyDialog.showModal();
  historyDialog.scrollTop = 0;
});
$('#open-objectives').addEventListener('click', () => {
  historyDialog.showModal();
  $('.history-dialog-content article:last-child').scrollIntoView({
    block: 'start',
    behavior: 'instant',
  });
});
$('#close-history').addEventListener('click', () => historyDialog.close());
historyDialog.addEventListener('click', (e) => {
  if (e.target === historyDialog) {
    const box = historyDialog.getBoundingClientRect();
    if (
      e.clientX < box.left ||
      e.clientX > box.right ||
      e.clientY < box.top ||
      e.clientY > box.bottom
    )
      historyDialog.close();
  }
});
const eventCountdown = document.querySelector('[data-event-start]');
if (eventCountdown) {
  const eventStart = Date.parse(eventCountdown.dataset.eventStart);
  let countdownTimer;
  function updateCountdown() {
    const remaining = Math.max(0, Math.floor((eventStart - Date.now()) / 1000));
    const values = {
      days: Math.floor(remaining / 86400),
      hours: Math.floor(remaining / 3600) % 24,
      minutes: Math.floor(remaining / 60) % 60,
      seconds: remaining % 60,
    };
    for (const [unit, value] of Object.entries(values))
      eventCountdown.querySelector(`[data-countdown="${unit}"]`).textContent = String(
        value,
      ).padStart(2, '0');
    eventCountdown.querySelector('.countdown-units').hidden = remaining === 0;
    eventCountdown.querySelector('.countdown-complete').hidden = remaining !== 0;
    if (remaining === 0) clearInterval(countdownTimer);
  }
  if (Number.isFinite(eventStart)) {
    updateCountdown();
    if (eventStart > Date.now())
      countdownTimer = setInterval(() => {
        if (!document.hidden) updateCountdown();
      }, 1000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) updateCountdown();
    });
  } else eventCountdown.hidden = true;
}
const teamCards = $$('[data-team-card]');
let teamIndex = 0;
function showTeam(index) {
  teamIndex = (index + teamCards.length) % teamCards.length;
  teamCards.forEach((card, i) => {
    const offset = (i - teamIndex + teamCards.length) % teamCards.length;
    card.dataset.offset = offset;
    card.setAttribute('aria-hidden', String(offset !== 0));
    card.inert = offset !== 0;
  });
  $('#team-position').textContent =
    String(teamIndex + 1).padStart(2, '0') + ' / ' + String(teamCards.length).padStart(2, '0');
}
$('#team-prev').addEventListener('click', () => showTeam(teamIndex - 1));
$('#team-next').addEventListener('click', () => showTeam(teamIndex + 1));
showTeam(0);
$('.team-deck').addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    showTeam(teamIndex + 1);
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    showTeam(teamIndex - 1);
  }
});
$('#contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form),
    topic = data.get('topic'),
    recipient = topic === 'Abstract submission' ? 'ipswbpvpi@gmail.com' : 'helpdesk@ipswb.com';
  const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
  location.href = `mailto:${recipient}?subject=${encodeURIComponent('IPSCON ’26 enquiry: ' + topic)}&body=${encodeURIComponent(body)}`;
  $('#contact-feedback').hidden = false;
  $('#contact-feedback').textContent =
    'Your email app will open with the enquiry. Send it there to contact our team.';
});
const backTop = $('#back-top');
function syncBackTop() {
  backTop.hidden = scrollY < 600;
}
addEventListener('scroll', syncBackTop, { passive: true });
syncBackTop();
backTop.addEventListener('click', () => {
  scrollTo({ top: 0, behavior: reduced.matches ? 'instant' : 'smooth' });
  $('.brand')?.focus({ preventScroll: true });
});
