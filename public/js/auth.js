const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const portrait = $('.portrait-stack');
let switching = false;
function updatePortrait(focused = document.activeElement) {
  const email = $('#email'),
    password = $('#password');
  if (!email || !password || !portrait) return;
  const privateEntry =
    (focused === password || focused === $('.password-toggle')) && password.type === 'password';
  const emailValid = Boolean(email.value) && email.validity.valid;
  portrait.dataset.reaction = privateEntry ? 'privacy' : focused === email ? 'email' : 'welcome';
  const label = privateEntry
    ? 'I’ll give you some privacy.'
    : (focused === password || focused === $('.password-toggle')) && password.type === 'text'
      ? 'Password is visible.'
      : emailValid
        ? 'Email format looks good.'
        : 'Welcome to IPSCON ’26';
  if ($('#portrait-status').textContent !== label) $('#portrait-status').textContent = label;
}
function validateField(input) {
  let error = '';
  if (!input.value.trim())
    error =
      input.tagName === 'SELECT'
        ? 'Please select your role.'
        : `Please enter your ${input.id.includes('email') ? 'email address' : input.id === 'password' ? 'password' : input.id.replace('-', ' ')}.`;
  else if (input.type === 'email' && !input.validity.valid) error = 'Enter a valid email address.';
  else if (
    input.id === 'password' &&
    document.body.dataset.auth === 'signup' &&
    input.value.length < 8
  )
    error = 'Use at least 8 characters for your password.';
  input.setAttribute('aria-invalid', String(Boolean(error)));
  input.closest('.field').querySelector('.field-error').textContent = error;
  return !error;
}
function mountForm() {
  $('.password-toggle').addEventListener('click', (e) => {
    const show = $('#password').type === 'password';
    $('#password').type = show ? 'text' : 'password';
    e.currentTarget.setAttribute('aria-pressed', String(show));
    e.currentTarget.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    updatePortrait(e.currentTarget);
  });
  $$('.field input,.field select').forEach((input, i) => {
    const error = input.closest('.field').querySelector('.field-error');
    error.id = `field-error-${i}`;
    input.setAttribute(
      'aria-describedby',
      error.id + (input.id === 'password' && $('#password-help') ? ' password-help' : ''),
    );
    input.addEventListener('blur', () => {
      if (input.value || input.getAttribute('aria-invalid') === 'true') validateField(input);
      requestAnimationFrame(() => updatePortrait());
    });
    input.addEventListener('focus', () => updatePortrait(input));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validateField(input);
      $('#form-message').hidden = true;
      updatePortrait(input);
    });
  });
  if (document.body.dataset.auth === 'signup')
    $('#password').addEventListener('input', (e) => {
      const v = e.target.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (v.length >= 12) score++;
      if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
      if (/\d/.test(v) && /[^a-zA-Z0-9]/.test(v)) score++;
      $$('.password-strength i').forEach(
        (bar, i) =>
          (bar.style.background =
            i < score ? (score <= 1 ? '#a3462e' : score === 2 ? '#b18c47' : '#315e47') : '#e0e5d9'),
      );
      $('#password-help').textContent = !v
        ? 'Use at least 8 characters, with a mix of letters, numbers or symbols.'
        : v.length < 8
          ? 'Add more characters — use at least 8.'
          : score < 3
            ? 'Good start. A longer password with mixed characters is stronger.'
            : 'Strong password length and character variety.';
    });
  $('#account-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [...e.currentTarget.querySelectorAll('input:not([type=checkbox]),select')];
    const results = fields.map(validateField);
    if (results.some((v) => !v)) {
      fields[results.indexOf(false)].focus();
      return;
    }
    if (document.body.dataset.auth === 'login') {
      sessionStorage.setItem('delegate-email', $('#email').value);
      sessionStorage.setItem('delegate-preview', 'true');
      location.assign('dashboard.html');
      return;
    }
    $('#form-message').hidden = false;
    $('#form-message').textContent = 'For account assistance, contact helpdesk@ipswb.com.';
  });
  const dialog = $('#recovery-dialog');
  $('#forgot-password')?.addEventListener('click', () => {
    dialog.showModal();
    $('#recovery-email').value = $('#email').value;
    $('#recovery-message').hidden = true;
  });
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        dialog.close();
    }
  });
  $('#recovery-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateField($('#recovery-email'))) {
      $('#recovery-email').focus();
      return;
    }
    $('#recovery-message').hidden = false;
    $('#recovery-message').textContent = 'For password assistance, contact helpdesk@ipswb.com.';
  });
  $('.switch-auth a').addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    switchPage(e.currentTarget.href, true);
  });
  $$('[data-provider]').forEach((button) =>
    button.addEventListener('click', () => {
      const message = $('#form-message');
      message.hidden = false;
      message.textContent = 'For account assistance, contact helpdesk@ipswb.com.';
    }),
  );
  updatePortrait();
}
async function switchPage(href, push) {
  if (switching) return;
  switching = true;
  try {
    const response = await fetch(href, { cache: 'no-store' });
    if (!response.ok) throw new Error('Page unavailable');
    const next = new DOMParser().parseFromString(await response.text(), 'text/html');
    const mode = next.body.dataset.auth;
    if (!['login', 'signup'].includes(mode)) throw new Error('Unknown account page');
    document.body.classList.add('panel-switching');
    const form = $('.auth-form-wrap');
    const exit = reduced.matches
      ? null
      : form.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 90,
          easing: 'cubic-bezier(.23,1,.32,1)',
          fill: 'forwards',
        });
    if (exit) await exit.finished;
    document.body.dataset.auth = mode;
    $('.auth-panel').innerHTML = next.querySelector('.auth-panel').innerHTML;
    $('#recovery-dialog').replaceWith(next.querySelector('#recovery-dialog'));
    document.title = next.title;
    if (push) history.pushState({ auth: mode }, '', href);
    mountForm();
    await $('.auth-form-wrap').animate(
      reduced.matches
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { opacity: 0, transform: 'translateY(6px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
      { duration: reduced.matches ? 100 : 180, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'both' },
    ).finished;
    const heading = $('.form-heading h2');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  } catch (error) {
    location.assign(href);
  } finally {
    switching = false;
    document.body.classList.remove('panel-switching');
  }
}
addEventListener('popstate', () => switchPage(location.href, false));
mountForm();
fetch(
  new URL(document.body.dataset.auth === 'login' ? 'signup.html' : 'login.html', location.href),
).catch(() => {});
