(() => {
  const track = document.querySelector('.story-track'),
    stage = document.querySelector('.story-stage');
  const opening = document.querySelector('#kolkata-intro'),
    story = document.querySelector('.hero-image-story');
  if (!track || !stage || !opening || !story) return;
  const conference = story.querySelector('.conference-frame'),
    heritage = story.querySelector('.heritage-frame');
  const conferenceVideo = conference.querySelector('video'),
    heritageImage = heritage.querySelector('img');
  let targetTime = 0;
  function seekConference() {
    if (
      !conferenceVideo ||
      conferenceVideo.seeking ||
      !Number.isFinite(conferenceVideo.duration) ||
      conferenceVideo.readyState < 2
    )
      return;
    if (Math.abs(conferenceVideo.currentTime - targetTime) > 1 / 60)
      conferenceVideo.currentTime = targetTime;
  }
  conferenceVideo?.addEventListener('loadeddata', () => {
    seekConference();
    schedule();
  });
  conferenceVideo?.addEventListener('seeked', seekConference);
  conferenceVideo?.addEventListener('error', () => conference.classList.add('video-unavailable'));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const buttons = [...document.querySelectorAll('[data-hero-step]')];
  const meter = document.querySelector('.hero-film-progress i'),
    title = document.querySelector('.story-scene-title');
  let raf = 0,
    finished = false,
    inView = false,
    progress = 0,
    displayedProgress = 0,
    playPending = false;
  const paused = () => document.body.classList.contains('motion-paused');
  const clamp = (n) => Math.max(0, Math.min(1, n));
  opening.muted = true;
  opening.loop = false;
  function render() {
    raf = 0;
    const inset = document.querySelector('header')?.offsetHeight || 0;
    const distance = Math.max(1, track.offsetHeight - stage.offsetHeight);
    progress = reduced.matches ? 0 : clamp((inset - track.getBoundingClientRect().top) / distance);
    if (!paused()) displayedProgress = progress;
    const p = displayedProgress;
    if (!reduced.matches && !paused() && p > 0.025) finished = true;
    const continuation = !reduced.matches && finished;
    stage.classList.toggle('continuation-active', continuation);
    if (continuation) {
      stage.classList.add('film-playing');
      opening.pause();
    } else if (
      paused() ||
      reduced.matches ||
      !inView ||
      document.hidden ||
      document.getElementById('conference-preloader')
    ) {
      opening.pause();
      if (reduced.matches) stage.classList.remove('film-playing');
    } else if (!finished && !playPending) {
      playPending = true;
      opening
        .play()
        .catch(() => {
          if (!stage.classList.contains('continuation-active'))
            stage.classList.remove('film-playing');
        })
        .finally(() => {
          playPending = false;
        });
    }
    const raw = clamp((p - 0.44) / 0.18),
      blend = raw * raw * (3 - 2 * raw);
    stage.classList.toggle('heritage-active', continuation && blend > 0.5);
    if (!paused() || reduced.matches) {
      conference.style.opacity = String(1 - blend);
      heritage.style.opacity = String(blend);
      if (conferenceVideo) {
        const duration = Number.isFinite(conferenceVideo.duration) ? conferenceVideo.duration : 0;
        targetTime = reduced.matches
          ? 0
          : Math.max(0, duration - 1 / 30) * clamp((p - 0.025) / 0.49);
        if (!document.hidden && inView) seekConference();
      }
      heritageImage.style.transform = reduced.matches
        ? 'none'
        : `translate3d(0,${(1 - clamp((p - 0.42) / 0.58)) * 6}%,0) scale(${1.025 - clamp((p - 0.42) / 0.58) * 0.025})`;
    }
    const chapter = p < 0.53 ? 0 : 1;
    buttons.forEach((button, i) => {
      if (continuation && i === chapter) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
      button.querySelector('i').style.transform = `scaleX(${clamp(p * 2 - i)})`;
    });
    if (title)
      title.textContent = continuation
        ? chapter === 0
          ? 'A MEETING OF MINDS'
          : 'KOLKATA · A LIVING HERITAGE'
        : 'INTERNATIONAL CONFERENCE OF PHARMACOLOGY';
    if (meter) meter.style.transform = `scaleX(${p})`;
  }
  function schedule() {
    if (!raf) raf = requestAnimationFrame(render);
  }
  opening.addEventListener('playing', () => stage.classList.add('film-playing'));
  opening.addEventListener('ended', () => {
    finished = true;
    schedule();
  });
  opening.addEventListener('error', () => {
    finished = true;
    schedule();
  });
  function goToChapter(index, keyboard = false) {
    if (reduced.matches) {
      (index === 0 ? conference : heritage).scrollIntoView({
        behavior: 'instant',
        block: 'center',
      });
      return;
    }
    const inset = document.querySelector('header')?.offsetHeight || 0;
    const start = scrollY + track.getBoundingClientRect().top - inset;
    const distance = Math.max(1, track.offsetHeight - stage.offsetHeight);
    scrollTo({
      top: start + [0.12, 0.77][index] * distance,
      behavior: keyboard ? 'instant' : 'smooth',
    });
  }
  buttons.forEach((button, index) =>
    button.addEventListener('click', (event) => goToChapter(index, event.detail === 0)),
  );
  document.querySelector('.story-explore')?.addEventListener('click', (event) => {
    event.preventDefault();
    goToChapter(0, event.detail === 0);
  });
  new IntersectionObserver(
    (entries) => {
      inView = entries[0].isIntersecting;
      document.body.classList.toggle('hero-in-view', inView);
      schedule();
    },
    { threshold: 0 },
  ).observe(stage);
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) opening.pause();
    schedule();
  });
  new MutationObserver(schedule).observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
    childList: true,
  });
  reduced.addEventListener('change', schedule);
  schedule();
})();
