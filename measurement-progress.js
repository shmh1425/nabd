(() => {
  // Timed interface simulation; no device readings or health records are generated.
  const rows = [...document.querySelectorAll('.progress-list li')];
  const next = document.querySelector('#next');
  const arabic = document.documentElement.lang !== 'en';
  const status = document.createElement('p');
  status.className = 'measurement-status';
  status.setAttribute('role', 'status');
  document.querySelector('.progress-list').after(status);
  const durations = [1600, 1400, 2200, 1200];
  let index = 0, timer;
  next.disabled = true;
  rows.forEach(row => {
    row.classList.add('queued');
    const icon = row.querySelector('.state');
    icon.className = 'state pending'; icon.textContent = '';
    icon.setAttribute('aria-label', arabic ? 'بانتظار البدء' : 'Waiting');
  });
  function startStep() {
    const row = rows[index];
    row.classList.remove('queued'); row.classList.add('active');
    row.setAttribute('aria-busy', 'true');
    row.querySelector('.state').setAttribute('aria-label', arabic ? 'جارٍ التنفيذ' : 'In progress');
    status.textContent = (arabic ? 'جارٍ ' : 'In progress: ') + row.querySelector('.text').textContent;
    timer = setTimeout(() => {
      row.classList.remove('active'); row.classList.add('done');
      row.setAttribute('aria-busy', 'false');
      const icon = row.querySelector('.state');
      icon.className = 'state'; icon.textContent = '✓';
      icon.setAttribute('aria-label', arabic ? 'مكتمل' : 'Complete');
      index++;
      if (index < rows.length) { startStep(); return; }
      document.querySelector('.measuring-title').textContent = arabic ? 'اكتمل قياس المؤشرات الحيوية' : 'Vital signs check complete';
      document.querySelector('.measuring-sub').textContent = arabic ? 'يمكنك الآن المتابعة للاطلاع على النتائج.' : 'You can now continue to view your results.';
      status.textContent = arabic ? 'اكتملت جميع الخطوات' : 'All steps complete';
      next.disabled = false;
    }, durations[index]);
  }
  startStep();
  window.addEventListener('pagehide', () => clearTimeout(timer));
  window.addEventListener('pageshow', event => { if (event.persisted && index < rows.length) startStep(); });
})();
