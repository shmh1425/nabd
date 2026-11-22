(() => {
  const ar = () => document.documentElement.lang !== 'en';
  const time = document.querySelector('[data-live-time]');
  const date = document.querySelector('[data-live-date]');
  const temperature = document.querySelector('[data-temperature]');
  function tick() {
    const now = new Date();
    const locale = ar() ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB';
    if (time) time.textContent = new Intl.DateTimeFormat(locale, {hour:'2-digit',minute:'2-digit',hour12:true}).format(now);
    if (date) date.textContent = new Intl.DateTimeFormat(locale, {day:'numeric',month:'long',year:'numeric'}).format(now);
  }
  tick(); setInterval(tick, 1000);
  if (!temperature) return;
  const weather = temperature.parentElement;
  const button = document.createElement('button');
  button.type = 'button';
  button.style.cssText = 'border:0;background:none;color:inherit;padding:0;display:flex;align-items:center;gap:5px;font:inherit;cursor:pointer';
  while (weather.firstChild) button.append(weather.firstChild);
  weather.append(button);
  const dialog = document.createElement('dialog');
  dialog.style.cssText = 'max-width:340px;border:0;border-radius:20px;padding:24px;text-align:center;color:#006858';
  dialog.innerHTML = '<h2></h2><p style="line-height:1.8"></p><p><a href="https://open-meteo.com/" target="_blank" rel="noopener">Weather data by Open-Meteo</a></p><button type="button" data-allow></button> <button type="button" data-dismiss></button>';
  document.body.append(dialog);
  let coords = null, busy = false;
  function label() { button.title = ar() ? 'عرض الحرارة حسب موقعك' : 'Show local temperature'; button.setAttribute('aria-label', button.title); }
  label(); new MutationObserver(label).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
  function message(text) { dialog.querySelector('p').textContent = text; }
  async function refresh() {
    if (!coords || busy) return;
    busy = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const query = new URLSearchParams({latitude:coords.latitude.toFixed(2),longitude:coords.longitude.toFixed(2),current:'temperature_2m',temperature_unit:'celsius'});
      const response = await fetch('https://api.open-meteo.com/v1/forecast?' + query, {signal:controller.signal});
      if (!response.ok) throw new Error('Weather unavailable');
      const data = await response.json();
      if (!Number.isFinite(data.current?.temperature_2m)) throw new Error('Invalid weather');
      temperature.textContent = Math.round(data.current.temperature_2m) + '°C';
      dialog.close();
    } catch {
      temperature.textContent = '—°C';
      message(ar() ? 'تعذر تحميل الحرارة. تحقق من الإنترنت ثم أعد المحاولة.' : 'Weather unavailable. Check your connection and try again.');
    } finally { clearTimeout(timer); busy = false; }
  }
  button.onclick = () => {
    dialog.querySelector('h2').textContent = ar() ? 'الطقس في موقعك' : 'Local weather';
    message(ar() ? 'نعرض الحرارة الحالية بالسيليزي. عند الموافقة، يطلب المتصفح موقعك ونرسل إحداثيات مقربة إلى Open-Meteo لجلب الطقس، دون حفظ موقعك.' : 'Show current Celsius temperature. With your permission, rounded location coordinates are sent to Open-Meteo to fetch weather. Your location is not saved.');
    dialog.querySelector('[data-allow]').textContent = ar() ? 'عرض حرارة موقعي' : 'Use my location';
    dialog.querySelector('[data-dismiss]').textContent = ar() ? 'إغلاق' : 'Close';
    dialog.showModal();
  };
  dialog.querySelector('[data-dismiss]').onclick = () => dialog.close();
  dialog.querySelector('[data-allow]').onclick = () => {
    if (busy) return;
    if (!navigator.geolocation) { message(ar() ? 'الموقع غير متاح في هذا المتصفح.' : 'Location is unavailable in this browser.'); return; }
    message(ar() ? 'جارٍ تحديد الموقع وجلب الحرارة…' : 'Getting location and weather…');
    navigator.geolocation.getCurrentPosition(position => { coords = position.coords; refresh(); }, () => {
      temperature.textContent = '—°C';
      message(ar() ? 'لم نتمكن من تحديد الموقع. اسمح بالوصول للموقع ثم حاول مجددًا. قد يتطلب ذلك فتح الموقع عبر HTTPS أو localhost.' : 'Location unavailable. Allow location access and retry. HTTPS or localhost may be required.');
    }, {enableHighAccuracy:false,timeout:10000,maximumAge:300000});
  };
  setInterval(refresh, 600000);
})();
