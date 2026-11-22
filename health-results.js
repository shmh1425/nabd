(() => {
  // Fixture values until a measurement device supplies real readings.
  const selected = new URLSearchParams(location.search).get('scenario');
  const scenario = ['good','moderate','critical'].includes(selected) ? selected : 'good';
  const low = scenario !== 'good';
  const fixtures = {good:{systolic:118,diastolic:76,pulse:72,oxygen:97},moderate:{systolic:132,diastolic:86,pulse:105,oxygen:94},critical:{systolic:170,diastolic:110,pulse:130,oxygen:88}};
  const reading = fixtures[scenario];
  const ar = document.documentElement.lang !== 'en';
  const t = (a,e) => ar ? a : e;
  const root = document.querySelector('#health-results');
  root.innerHTML = `<article class="health-card"><header class="health-head"><h2>${t('ضغط الدم','Blood pressure')}</h2><span class="health-badge ${low?'low':''}">${low?t('منخفض','Low'):t('طبيعي','Normal')}</span></header><div class="bp-values"><div class="bp-number"><strong>${reading.systolic}</strong><small>${t('انقباضي','Systolic')}</small></div><span class="bp-divider">/</span><div class="bp-number"><strong>${reading.diastolic}</strong><small>${t('انبساطي','Diastolic')}</small></div></div><div class="metric-unit">mmHg</div><div class="bp-bars"><div class="bp-row"><span>${t('انقباضي','Systolic')}</span><div class="bp-track" role="meter" aria-label="${t('الضغط الانقباضي','Systolic pressure')}" aria-valuemin="0" aria-valuemax="200" aria-valuenow="${reading.systolic}"><div class="bp-fill" data-fill="${reading.systolic/200*100}"></div></div><b>${reading.systolic}</b></div><div class="bp-row"><span>${t('انبساطي','Diastolic')}</span><div class="bp-track" role="meter" aria-label="${t('الضغط الانبساطي','Diastolic pressure')}" aria-valuemin="0" aria-valuemax="200" aria-valuenow="${reading.diastolic}"><div class="bp-fill" data-fill="${reading.diastolic/200*100}"></div></div><b>${reading.diastolic}</b></div></div></article><article class="health-card"><header class="health-head"><h2>${t('معدل النبض','Heart rate')}</h2><span class="health-badge">${t('طبيعي','Normal')}</span></header><div class="metric-layout"><strong class="pulse-reading">${reading.pulse}<small>${t('نبضة / دقيقة','beats / minute')}</small></strong><svg class="pulse-graph" viewBox="0 0 200 60" fill="none" aria-hidden="true"><path d="M0 32H35l8-9 9 19 13-35 13 47 10-22h32l8-9 9 19 13-35 13 47 10-22h27" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></svg></div></article><article class="health-card"><header class="health-head"><h2>${t('الأكسجين في الدم','Blood oxygen')}</h2><span class="health-badge">${t('طبيعي','Normal')}</span></header><div class="metric-layout"><div class="oxygen-visual" role="meter" aria-label="${t('تشبع الأكسجين','Oxygen saturation')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${reading.oxygen}"><svg class="oxygen-ring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="49" fill="none" stroke="#dbece5" stroke-width="10"/><circle class="ring-value" cx="60" cy="60" r="49" pathLength="100" fill="none" stroke="#009b7e" stroke-width="10"/></svg><div class="oxygen-value">${reading.oxygen}%<small>SpO₂</small></div></div><p class="oxygen-caption">${t('نسبة تشبع الأكسجين<br>في الدم','Blood oxygen<br>saturation')}</p></div></article>`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    root.querySelectorAll('[data-fill]').forEach(el => el.style.width = Math.min(100,Math.max(0,Number(el.dataset.fill))) + '%');
    root.querySelector('.ring-value').style.strokeDashoffset = String(100 - Math.min(100,Math.max(0,reading.oxygen)));
  }));
  // Visual ranges for these fixture readings; not a diagnostic classifier.
  const gauge = (value, min, max, label, ranges, ticks) => {
    const position = Math.max(0, Math.min(100, (value-min)/(max-min)*100));
    const box = document.createElement('div'); box.className='range-gauge';
    box.innerHTML=`<div class="range-heading"><span>${label}</span><b>${value}</b></div><div class="range-track" role="img" aria-label="${label}: ${value}"><div class="range-colors">${ranges.map(([width,color])=>`<span style="flex:${width};background:${color}"></span>`).join('')}</div><span class="range-marker" style="left:${position}%"><i></i></span></div><div class="range-ticks">${ticks.map(tick=>`<span style="left:${(parseFloat(tick)-min)/(max-min)*100}%">${tick}</span>`).join('')}</div>`;
    return box;
  };
  const green='#00a581',yellow='#f5c342',red='#e66b59';
  const cards=root.querySelectorAll('.health-card');
  // Each pressure component gets its own scale and pointer.
  const bars=root.querySelector('.bp-bars'); bars.innerHTML='';
  bars.append(gauge(reading.systolic,60,180,t('انقباضي','Systolic'),[[30,yellow],[30,green],[20,yellow],[40,red]],['60','90','120','140','180']));
  bars.append(gauge(reading.diastolic,40,120,t('انبساطي','Diastolic'),[[20,yellow],[20,green],[10,yellow],[30,red]],['40','60','80','90','120']));
  cards[1].append(gauge(reading.pulse,40,140,t('مؤشر النبض','Heart rate indicator'),[[20,yellow],[40,green],[20,yellow],[20,red]],['40','60','100','120','140']));
  cards[2].append(gauge(reading.oxygen,85,100,t('مؤشر الأكسجين','Oxygen indicator'),[[7,red],[3,yellow],[5,green]],['85%','92%','95%','100%']));
  const legend=document.createElement('div'); legend.className='range-legend';
  legend.innerHTML=`<span><i style="background:${green}"></i>${t('ضمن النطاق','In range')}</span><span><i style="background:${yellow}"></i>${t('يحتاج انتباه','Attention')}</span><span><i style="background:${red}"></i>${t('خارج النطاق','Out of range')}</span>`;
  root.append(legend);
  const stateText = scenario==='good'?t('ضمن النطاق','In range'):scenario==='moderate'?t('يحتاج انتباه','Attention'):t('خارج النطاق','Out of range');
  root.querySelectorAll('.health-badge').forEach(badge=>{badge.textContent=stateText;badge.style.background=scenario==='critical'?'#ffebe7':scenario==='moderate'?'#fff1cc':'#d8f2e8';badge.style.color=scenario==='critical'?'#aa3934':scenario==='moderate'?'#8d6419':'#007b60';});
  if (low) {
    const alert = document.createElement('dialog'); alert.className='report-alert'+(scenario==='critical'?' urgent':'');
    alert.setAttribute('aria-labelledby','pressure-alert-title');
    alert.innerHTML=`<div class="warning-emblem" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 8a4 4 0 0 1 6.8 0l16 27a4 4 0 0 1-3.4 6H8a4 4 0 0 1-3.4-6Z"/><path d="M24 18v10"/><circle cx="24" cy="34" r="1.5" fill="currentColor" stroke="none"/></svg></div><h2 id="pressure-alert-title">${(scenario==='critical'?t('تنبيه: حالة تستدعي الانتباه العاجل','Alert: urgent attention needed'):t('تنبيه: بعض المؤشرات خارج النطاق','Some indicators are outside the range'))}</h2><p>${(scenario==='critical'?t('تظهر قراءات غير طبيعية تستدعي طلب المساعدة الطبية وعدم متابعة النشاط.','These abnormal readings that call for medical help and stopping activity.'):t('تحتاج بعض المؤشرات إلى المتابعة. توقف عن المجهود وتواصل مع مختص صحي لتقييم القراءات.','Some indicators need attention. Stop exertion and contact a healthcare professional to review your readings.'))}</p><button>${t('عرض التقرير','View report')}</button>`;
    document.body.append(alert); alert.querySelector('button').onclick=()=>alert.close(); alert.showModal();
    const next=document.querySelector('#recommendations');
    next.querySelector('span').textContent=t('عرض الإرشادات','View guidance');
    next.onclick=()=>location.href='recommendations.html?scenario='+scenario+'&lang='+(ar?'ar':'en');
  }
})();
