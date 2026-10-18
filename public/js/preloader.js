(() => {
  const loader = document.getElementById('conference-preloader');
  if (!loader) return;
  loader.hidden = false;
  let done = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const minimum = new Promise((resolve) => setTimeout(resolve, reduced ? 250 : 2400));
  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(fallback);
    loader.classList.add('is-complete');
    loader.setAttribute('aria-hidden', 'true');
    setTimeout(() => loader.remove(), 300);
  };
  const fallback = setTimeout(finish, reduced ? 1500 : 4000);
  addEventListener('pageshow', (event) => {
    if (event.persisted) finish();
  });
  addEventListener('keydown', finish, { once: true });
  loader.addEventListener('pointerdown', finish, { once: true });
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      const image = document.querySelector('.conference-presenter');
      const imageReady = image?.decode ? image.decode().catch(() => {}) : Promise.resolve();
      const video = document.getElementById('kolkata-intro');
      const filmReady =
        !video || video.readyState >= 2 || video.error
          ? Promise.resolve()
          : new Promise((resolve) => {
              video.addEventListener('loadeddata', resolve, { once: true });
              video.addEventListener('error', resolve, { once: true });
            });
      Promise.all([
        minimum,
        imageReady,
        document.fonts ? document.fonts.ready : Promise.resolve(),
        filmReady,
      ]).then(() => requestAnimationFrame(() => requestAnimationFrame(finish)));
    },
    { once: true },
  );
})();
