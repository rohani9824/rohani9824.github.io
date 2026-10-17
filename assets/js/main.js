(() => {
  'use strict';
  const config = window.ROHANI_CONFIG || {};
  const apps = Array.isArray(window.ROHANI_APPS) ? window.ROHANI_APPS : [];
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => [...root.querySelectorAll(s)];
  const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const icons = {
    arrow:'<path d="M19 12H5m7 7-7-7 7-7"/>',
    external:'<path d="M14 4h6v6m0-6-9 9"/><path d="M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M5 17v3h14v-3"/>',
    mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0m-7 7v5m-4 0h8"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 4h3m3 0h2m-8 4h3"/>',
    play:'<path d="M8 5v14l11-7z"/>',
    captions:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M6 11h5m-5 4h8m1-4h3"/>',
    scan:'<path d="M7 3H5a2 2 0 0 0-2 2v2m14-4h2a2 2 0 0 1 2 2v2M3 17v2a2 2 0 0 0 2 2h2m14-4v2a2 2 0 0 1-2 2h-2M7 12h10m-8-4h6m-6 8h6"/>',
    sparkles:'<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zm7 12 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    windows:'<path d="M3 5 11 4v8H3zm10-1 8-1v9h-8zM3 14h8v8l-8-1zm10 0h8v9l-8-1z"/>',
    android:'<rect x="5" y="9" width="14" height="11" rx="2"/><path d="M7 9a5 5 0 0 1 10 0M8 3 6 1m10 2 2-2M2 11v6m20-6v6M8 20v2m8-2v2M9 7h.01M15 7h.01"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    check:'<path d="m5 12 5 5L20 7"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    shield:'<path d="m12 2 9 4v6c0 6-4 9-9 10-5-1-9-4-9-10V6z"/><path d="m8 12 3 3 5-5"/>',
    copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.5 2.5 0 1 1 4.3 2c-1.2 1.1-2.1 1.4-2.1 3M12 18h.01"/>',
    layers:'<path d="m12 2 9 5-9 5-9-5zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    close:'<path d="M5 5l14 14M19 5 5 19"/>',
    chevron:'<path d="m7 10 5 5 5-5"/>'
  };
  const icon = (name,cls='') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${icons[name]||icons.layers}</svg>`;
  const isValidURL = url => {
    if (!url || typeof url !== 'string') return false;
    if (/^https:\/\//i.test(url)) return true;
    return /^(?:\.\/|assets\/)[\w./%()-]+$/i.test(url);
  };
  const platformName = p => p === 'android' ? 'اندروید' : 'ویندوز';
  const platformIcon = p => icon(p === 'android' ? 'android' : 'windows');
  const pageLink = id => `app.html?id=${encodeURIComponent(id)}`;
  function toast(msg) {
    let el = $('#site-toast');
    if (!el) {el = document.createElement('div');el.id='site-toast';el.className='toast';el.setAttribute('role','status');document.body.append(el);}
    el.textContent=msg;el.classList.add('show');
    clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('show'),3500);
  }
  function appCard(a) {
    return `<article class="app-card" data-aos><div class="app-cover tone-${escapeHTML(a.accent)}"><span class="cover-orbit orbit-a"></span><span class="cover-orbit orbit-b"></span><div class="cover-icon">${icon(a.icon)}</div><span class="cover-pattern"></span><span class="cover-id">R / 98 &nbsp; • &nbsp; SOFTWARE</span></div>
      <div class="app-card-body"><div class="app-chips"><span class="chip chip-platform">${platformIcon(a.platform)} ${platformName(a.platform)}</span><span class="chip chip-muted">${escapeHTML(a.category)}</span></div>
      <h3>${escapeHTML(a.name)}</h3><p>${escapeHTML(a.tagline)}</p>
      <div class="card-bottom"><span class="status-text">${icon(a.downloadUrl && isValidURL(a.downloadUrl) ? 'check' : 'clock')} ${a.downloadUrl && isValidURL(a.downloadUrl) ? 'آماده دانلود' : 'منتظر فایل دانلود'}</span><a class="link-arrow" href="${pageLink(a.id)}" aria-label="جزئیات ${escapeHTML(a.name)}">جزئیات ${icon('arrow')}</a></div></div></article>`;
  }
  function bootNavigation() {
    const btn=$('#menu-toggle'), nav=$('#primary-nav');
    if (btn && nav) {
      btn.addEventListener('click',()=>{const open = !nav.classList.contains('is-open');nav.classList.toggle('is-open',open);btn.setAttribute('aria-expanded',String(open));btn.innerHTML=icon(open?'close':'menu');});
      $$('.nav-link',nav).forEach(x=>x.addEventListener('click',()=>{nav.classList.remove('is-open');btn.setAttribute('aria-expanded','false');btn.innerHTML=icon('menu');}));
      document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('is-open');btn.setAttribute('aria-expanded','false');btn.innerHTML=icon('menu');}});
    }
    const page = document.body.dataset.page;
    $$('.nav-link').forEach(x=>{if(x.dataset.nav===page || (page==='app' && x.dataset.nav==='apps')) x.classList.add('active');});
    const year=$('#year');if(year)year.textContent=String(new Date().getFullYear());
  }
  function home() {
    const grid=$('#featured-apps');if(grid)grid.innerHTML=apps.filter(x=>x.featured).slice(0,3).map(appCard).join('');
    const count=$('#app-count');if(count)count.textContent=String(apps.length).padStart(2,'0');
    const win=$('#windows-count');if(win)win.textContent=String(apps.filter(x=>x.platform==='windows').length).padStart(2,'0');
    const and=$('#android-count');if(and)and.textContent=String(apps.filter(x=>x.platform==='android').length).padStart(2,'0');
  }
  function catalog() {
    const list=$('#apps-list'), search=$('#catalog-search'), filters=$$('[data-filter]'), count=$('#results-count'), sort=$('#catalog-sort'), empty=$('#empty-results');
    if(!list)return;
    let filter='all';
    const render=()=>{
      let result=apps.filter(a=>(filter==='all'||a.platform===filter) && `${a.name} ${a.category} ${a.tagline}`.toLowerCase().includes((search?.value||'').trim().toLowerCase()));
      if(sort?.value==='name')result=result.sort((a,b)=>a.name.localeCompare(b.name));
      if(sort?.value==='platform')result=result.sort((a,b)=>a.platform.localeCompare(b.platform));
      list.innerHTML=result.map(appCard).join('');
      if(count)count.textContent=`${result.length.toLocaleString('fa-IR')} برنامه`;
      if(empty)empty.hidden=result.length>0;
    };
    filters.forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.filter;filters.forEach(x=>{x.classList.toggle('selected',x===btn);x.setAttribute('aria-pressed',String(x===btn));});render();}));
    search?.addEventListener('input',render);sort?.addEventListener('change',render);
    const q=new URLSearchParams(location.search).get('platform');
    const target=filters.find(b=>b.dataset.filter===q);
    if(target)target.click();else render();
  }
  function details() {
    const el=$('#app-details');if(!el)return;
    const id=new URLSearchParams(location.search).get('id');
    const a=apps.find(x=>x.id===id);
    if(!a){el.innerHTML=`<div class="not-found glass"><span class="eyebrow">۴۰۴ / برنامه پیدا نشد</span><h1>این برنامه در فهرست وجود ندارد.</h1><a class="btn btn-primary" href="apps.html">${icon('arrow')} بازگشت به برنامه‌ها</a></div>`;return;}
    document.title=`${a.name} | Rohani98`;
    const valid=isValidURL(a.downloadUrl);
    el.innerHTML=`<div class="crumb"><a href="index.html">خانه</a><span>/</span><a href="apps.html">برنامه‌ها</a><span>/</span><strong>${escapeHTML(a.name)}</strong></div>
      <div class="details-grid"><div class="details-main"><span class="eyebrow">${icon('layers')} معرفی نرم‌افزار / ROHANI98</span><h1>${escapeHTML(a.name)}</h1><p class="details-lead">${escapeHTML(a.tagline)}</p><div class="detail-tags"><span class="chip">${platformIcon(a.platform)} ${platformName(a.platform)}</span><span class="chip">${escapeHTML(a.category)}</span></div>
      <div class="details-copy glass"><h2>درباره این برنامه</h2><p>${escapeHTML(a.description)}</p><h3>قابلیت‌ها</h3><ul class="feature-list">${(a.features||[]).map(f=>`<li>${icon('check')} ${escapeHTML(f)}</li>`).join('')}</ul></div></div>
      <aside class="details-side"><div class="detail-art app-cover tone-${escapeHTML(a.accent)}"><span class="cover-orbit orbit-a"></span><span class="cover-orbit orbit-b"></span><div class="cover-icon">${icon(a.icon)}</div><span class="cover-id">R / 98 &nbsp; • &nbsp; SOFTWARE</span></div>
      <div class="download-panel glass"><div class="mini-label">وضعیت انتشار</div><strong class="${valid?'ready':'waiting'}">${valid?'آماده دانلود':'فایل دانلود هنوز ثبت نشده'}</strong><div class="spec"><span>سیستم‌عامل</span><b>${platformName(a.platform)}</b></div><div class="spec"><span>نسخه</span><b>${escapeHTML(a.version||'—')}</b></div><div class="spec"><span>حجم فایل</span><b>${escapeHTML(a.size||'—')}</b></div>
      ${valid ? `<a class="btn btn-primary btn-block" href="${escapeHTML(a.downloadUrl)}" target="_blank" rel="noopener noreferrer">${icon('download')} دانلود برنامه</a>`:`<button class="btn btn-disabled btn-block" disabled>${icon('clock')} دانلود به‌زودی</button>`}
      <p class="panel-note">${valid?'فایل را فقط از لینک رسمی این صفحه دریافت کنید.':'برای فعال کردن دانلود، لینک فایل واقعی را در assets/js/apps.js ثبت کنید.'}</p></div></aside></div>`;
  }
  function contact() {
    const mail=$('#contact-email'), github=$('#github-link'), telegram=$('#telegram-link');
    if(mail){if(config.contactEmail){mail.textContent=config.contactEmail;mail.href=`mailto:${config.contactEmail}`;} else {mail.textContent='ایمیل هنوز ثبت نشده';mail.removeAttribute('href');mail.classList.add('not-set');}}
    if(github){if(isValidURL(config.githubUrl)){github.href=config.githubUrl;}else{github.hidden=true;}}
    if(telegram){if(isValidURL(config.contactTelegram)){telegram.href=config.contactTelegram;}else{telegram.hidden=true;}}
    const form=$('#contact-form');if(!form)return;
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(!form.reportValidity())return;
      const name=$('#sender-name').value.trim(),subject=$('#sender-subject').value.trim(),message=$('#sender-message').value.trim();
      const text=`نام: ${name}\nموضوع: ${subject}\n\n${message}`;
      if(config.contactEmail){location.href=`mailto:${encodeURIComponent(config.contactEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;toast('برنامه ایمیل شما برای ارسال پیام باز می‌شود.');}
      else {
        try{await navigator.clipboard.writeText(text);toast('پیام کپی شد. برای ارسال، ابتدا ایمیل سایت را تنظیم کنید.');}
        catch {$('#message-preview').hidden=false;$('#message-preview').value=text;$('#message-preview').focus();toast('متن پیام را از کادر زیر کپی کنید.');}
      }
    });
  }
  function reveal() {
    const list=$$('[data-aos]');
    if(!('IntersectionObserver' in window)){list.forEach(el=>el.classList.add('visible'));return;}
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:.06});
    list.forEach(el=>obs.observe(el));
  }
  document.addEventListener('DOMContentLoaded',()=>{
    bootNavigation();
    const page=document.body.dataset.page;
    if(page==='home')home();
    if(page==='apps')catalog();
    if(page==='app')details();
    if(page==='contact')contact();
    reveal();
  });
})();
