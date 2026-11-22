(() => {
  const ar = document.documentElement.lang !== 'en';
  const value = new URLSearchParams(location.search).get('scenario');
  const state = ['moderate','critical'].includes(value) ? value : 'good';
  const t = (a,e) => ar ? a : e;
  const content = {
    good: [
      [t('اشرب الماء بانتظام','Drink water regularly'),t('وزّع شرب الماء خلال اليوم. التزم بتوجيهات طبيبك إذا كنت تتبع حدًا معينًا للسوائل.','Drink throughout the day. Follow your clinician’s advice if you have a fluid restriction.')],
      [t('تحرّك على قدر استطاعتك','Move at a comfortable pace'),t('ابدأ بالمشي الخفيف وزد النشاط تدريجيًا. توقف إذا شعرت بدوار أو ألم أو ضيق نفس غير معتاد.','Start with gentle walking and increase gradually. Stop if you feel dizzy, have pain or unusual breathlessness.')],
      [t('اختر وجبة متوازنة','Choose balanced meals'),t('نوّع بين الخضار والفواكه والحبوب الكاملة، وقلل الأطعمة شديدة الملوحة.','Include vegetables, fruit and whole grains, and limit very salty foods.')]
    ],
    moderate: [
      [t('توقف وخذ استراحة','Stop and rest'),t('اجلس بهدوء وتجنب المجهود أثناء مراجعة القراءات.','Sit quietly and avoid exertion while your readings are reviewed.')],
      [t('تواصل مع مختص صحي','Contact a healthcare professional'),t('اطلب تقييمًا للقراءات غير المعتادة، خاصة إذا استمرت أو كانت مختلفة عن معدلك المعتاد.','Seek assessment of unusual readings, especially if they persist or differ from your usual levels.')],
      [t('انتبه للأعراض','Watch for symptoms'),t('عند ضيق نفس شديد أو ألم صدر أو إغماء، اطلب مساعدة طارئة فورًا.','For severe breathlessness, chest pain or fainting, seek emergency help immediately.')]
    ],
    critical: [
      [t('اطلب مساعدة عاجلة','Seek urgent help'),t('تستدعي هذه القراءات تقييمًا طبيًا عاجلًا. تواصل مع خدمات الطوارئ المحلية.','These readings call for urgent medical assessment. Contact local emergency services.')],
      [t('لا تواصل النشاط','Stop activity'),t('ابقَ في وضع مريح، واطلب من شخص قريب البقاء معك. لا تقد السيارة بنفسك إذا كنت متوعكًا.','Stay in a comfortable position and ask someone to stay with you. Do not drive yourself if unwell.')],
      [t('لا تؤخر طلب المساعدة','Do not delay getting help'),t('لا تنتظر تحسن الأرقام أو تكرار القياس عند وجود ألم صدر أو ضيق نفس شديد أو إغماء.','Do not wait for improved readings or repeated checks if you have chest pain, severe breathlessness or fainting.')]
    ]
  };
  document.querySelectorAll('.advice').forEach((card,index) => {
    card.querySelector('h2').textContent=content[state][index][0];
    card.querySelector('p').textContent=content[state][index][1];
    if(state!=='good') {
      card.querySelector('svg').innerHTML='<path d="M25 7a4 4 0 0 1 6 0l21 36a4 4 0 0 1-3 6H7a4 4 0 0 1-3-6Z"/><path d="M28 19v13m0 7v1"/>';
    }
  });
  if(state!=='good') {
    const summary=document.querySelector('.health-summary');
    const urgent=state==='critical';
    summary.style.background=urgent?'#fff0ee':'#fff7e4';
    summary.style.borderColor=urgent?'#edaaa3':'#ecd29a';
    summary.querySelector('h2').textContent=urgent?t('حالة تستدعي المساعدة العاجلة','Urgent attention required'):t('مؤشرات تحتاج إلى المتابعة','Readings need follow-up');
    summary.querySelector('p').textContent=urgent?t('اطلب المساعدة الطبية ولا تواصل النشاط.','Seek medical help and stop activity.'):t('خذ استراحة وتواصل مع مختص صحي لتقييم القراءات.','Rest and contact a healthcare professional to review the readings.');
    summary.querySelector('.mini-wave').style.display='none';
    const icon=summary.querySelector('.success');
    icon.textContent='!';icon.style.background=urgent?'#c53638':'#b48328';icon.style.borderColor=urgent?'#f1bab4':'#f0dfa8';
  }
  const source=document.createElement('a');
  source.href='https://www.nhs.uk/symptoms/shortness-of-breath/';source.target='_blank';source.rel='noopener';
  source.textContent=t('معلومات صحية: متى تطلب المساعدة؟','Health information: when to seek help');
  source.style.cssText='display:block;text-align:center;font-size:11px;color:#59796c;margin:18px 0 0';
  document.querySelector('.advice-grid').after(source);
})();
