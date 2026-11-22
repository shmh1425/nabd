(() => {
  const language=()=>document.documentElement.lang==='en'?'en':'ar';
  const current=()=>{try{return sessionStorage.getItem('nabd-user')}catch{return null}};
  const logout=()=>{sessionStorage.removeItem('nabd-user');location.replace('index.html?lang='+language());};
  window.nabdStation={current,logout};
  if(location.pathname.endsWith('/walk.html'))return;
  const top=document.createElement('div');top.className='station-toolbar';
  const name=document.createElement('span');
  const button=document.createElement('button');button.className='station-logout';button.type='button';
  button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 4H5v16h5m5-12 4 4-4 4m-6-4h10"/></svg>';
  const update=()=>{const en=language()==='en';name.textContent=current()?(en?'Signed in: ':'المستخدم: ')+current():(en?'Shared NABD station':'محطة نبض المشتركة');button.title=en?'Sign out':'تسجيل الخروج';button.setAttribute('aria-label',button.title);};
  button.onclick=logout;top.append(name,button);document.querySelector('.status').after(top);update();
  new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('nabd-session',update);
})();
