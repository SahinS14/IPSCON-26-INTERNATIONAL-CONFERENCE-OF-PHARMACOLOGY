const registrationMenu = document.querySelector('.menu-toggle');
const registrationNavigation = document.querySelector('#navigation');
const registrationMenuIcon = (name) => `<svg class="icon" aria-hidden="true" focusable="false"><use href="#ui-${name}" /></svg>`;
function closeRegistrationMenu() {
  registrationNavigation.classList.remove('open');
  registrationMenu.setAttribute('aria-expanded', 'false');
  registrationMenu.setAttribute('aria-label', 'Open navigation');
  registrationMenu.innerHTML = registrationMenuIcon('menu');
}
registrationMenu.addEventListener('click', () => {
  const open = registrationNavigation.classList.toggle('open');
  registrationMenu.setAttribute('aria-expanded', String(open));
  registrationMenu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  registrationMenu.innerHTML = registrationMenuIcon(open ? 'close' : 'menu');
});
registrationNavigation.addEventListener('click', closeRegistrationMenu);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && registrationNavigation.classList.contains('open')) {
    closeRegistrationMenu();
    registrationMenu.focus();
  }
});
