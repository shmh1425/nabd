(() => {
  const ar = document.documentElement.lang !== 'en';
  const t = (a,e) => ar ? a : e;
  const popup = document.createElement('dialog');
  popup.setAttribute('aria-labelledby','scenario-title');
  popup.style.cssText='max-width:380px;width:92%;border:1px solid #d8eee4;border-radius:25px;padding:25px;text-align:start;color:#174f40';
  popup.innerHTML=`<h2 id="scenario-title" style="font-size:23px;margin:0 0 12px">${t('جرّب تجربة نبض','Explore NABD')}</h2><p style="font-size:15px;line-height:1.9">${t('منصة نبض حاليًا نموذج أولي ببيانات تجريبية. عند تطوير الجهاز الحقيقي وربطه بالمنصة، ستأتي المؤشرات من أجهزة القياس مباشرة. اختر الآن حالة لتجربة شكل النتائج والتنبيهات.','NABD is currently a prototype using sample data. When the real device is developed and connected, readings will come directly from its sensors. Choose a scenario to explore results and alerts.')}</p><div class="scenario-options" style="display:grid;gap:10px;margin:20px 0"></div><button type="button" class="scenario-cancel" style="background:transparent;color:#587a6e;padding:8px 0">${t('العودة للإرشادات','Back to instructions')}</button>`;
  const options=[['good',t('حالة جيدة','Good condition'),'#00866a','#e5f7ee'],['moderate',t('حالة متوسطة','Moderate condition'),'#93651a','#fff5da'],['critical',t('حالة خطيرة','Critical condition'),'#b43f3d','#fff0ee']];
  for(const [value,label,color,bg] of options){
    const button=document.createElement('button');button.type='button';button.textContent=label;
    button.style.cssText=`text-align:start;border:1px solid ${color}44;background:${bg};color:${color};border-radius:15px;padding:14px 18px;font:inherit;font-weight:700;cursor:pointer`;
    button.onclick=()=>{ location.href='measuring.html?lang='+(ar?'ar':'en')+'&scenario='+value; };
    popup.querySelector('.scenario-options').append(button);
  }
  popup.querySelector('.scenario-cancel').onclick=()=>popup.close();
  document.body.append(popup);
  document.querySelector('#start').onclick=()=>popup.showModal();
})();
