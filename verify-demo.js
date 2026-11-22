(() => {
  const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'ar';
  const arabic = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = arabic ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar]').forEach(el => el.textContent = el.dataset[lang]);
  document.querySelector('.logo').href = 'index.html?lang=' + lang;
  const button = document.querySelector('#fingerprint');
  const status = document.querySelector('.waiting');
  const progress = document.querySelector('#scan-progress');
  const ring = document.querySelector('.scan-ring circle');
  const next = document.querySelector('#continue');
  button.setAttribute('aria-label', arabic ? 'اضغط مطولًا لمحاكاة قراءة البصمة' : 'Press and hold to simulate fingerprint scanning');
  let frame = null, start = 0, complete = false, pointer = null, keyboard = false;
  function cancel() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; pointer = null; keyboard = false;
    button.classList.remove('reading');
    if (!complete) {
      ring.style.strokeDashoffset = '100';
      progress.textContent = '';
      status.textContent = arabic ? 'بانتظار بصمتك…' : 'Waiting for your fingerprint…';
    }
  }
  function advance(now) {
    const percent = Math.min(100, (now - start) / 25);
    ring.style.strokeDashoffset = String(100 - percent);
    progress.textContent = Math.floor(percent) + '%';
    if (percent < 100) { frame = requestAnimationFrame(advance); return; }
    frame = null; complete = true;
    button.classList.remove('reading'); button.classList.add('complete');
    status.textContent = arabic ? 'اكتملت المحاكاة، أهلًا بك!' : 'Demo scan complete. Welcome!';
    next.querySelector('b').textContent = arabic ? 'متابعة' : 'Continue';
  }
  function begin() {
    if (complete || frame !== null) return;
    start = performance.now();
    button.classList.add('reading');
    status.textContent = arabic ? 'جارٍ محاكاة القراءة… استمر بالضغط' : 'Simulating scan… keep holding';
    frame = requestAnimationFrame(advance);
  }
  button.addEventListener('pointerdown', event => {
    if (event.button !== 0 || pointer !== null || keyboard) return;
    pointer = event.pointerId;
    button.setPointerCapture(pointer); begin();
  });
  button.addEventListener('pointerup', event => { if (event.pointerId === pointer) cancel(); });
  button.addEventListener('pointercancel', cancel);
  button.addEventListener('lostpointercapture', cancel);
  button.addEventListener('contextmenu', event => event.preventDefault());
  button.addEventListener('keydown', event => {
    if (event.key === 'Escape') { cancel(); return; }
    if (![' ', 'Enter'].includes(event.key)) return;
    event.preventDefault();
    if (event.repeat || pointer !== null) return;
    keyboard = true; begin();
  });
  button.addEventListener('keyup', event => {
    if ([' ', 'Enter'].includes(event.key)) { event.preventDefault(); if (keyboard) cancel(); }
  });
  button.addEventListener('blur', cancel);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); });
  next.onclick = () => { cancel(); location.href = 'checkup.html?lang=' + lang; };
})();
