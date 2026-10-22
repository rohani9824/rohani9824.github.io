/* Rohani98 — Reimagined Studio / standalone progressive enhancement */
(()=>{'use strict';
 const $=(q,r=document)=>r.querySelector(q),$$=(q,r=document)=>Array.from(r.querySelectorAll(q));
 const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
 const safeUrl=url=>{try{const u=new URL(url,location.href);return ['https:','http:'].includes(u.protocol)?u.href:'#'}catch{return '#'}};
 const apps=Array.isArray(window.ROHANI_APPS)?window.ROHANI_APPS:[];
 const landing={interactivewallpaper:'interactivewallpaper.html',rohaniocr:'rohaniocr.html',rohaniscreenshot:'rohaniscreenshot.html'};
 const detailUrl=a=>a.landingUrl||landing[a.id]||`app.html?id=${encodeURIComponent(a.id)}`;
 const logo=a=>({rohaniocr:'OCR',rohaniscreenshot:'▣',interactivewallpaper:'✦',maxplayer:'▶',tricalendarpro:'۳', 'voicemind-ai-pro':'AI','livecaption-x-pro':'CC',livescreentranslator:'文'})[a.id]||'R98';
 const color=a=>({cyan:'#69defa',violet:'#b8a0ff',rose:'#ffa2c6',blue:'#81b9ff'})[a.accent]||'#84e9ff';
 const heroMap={
   rohaniocr:'rohaniocr-hero.webp',
   rohaniscreenshot:'rohaniscreenshot-hero.webp',
   interactivewallpaper:'interactivewallpaper-hero.webp',
   tricalendarpro:'tricalendarpro-hero.webp',
   maxplayer:'maxplayer-hero.webp',
   'voicemind-ai-pro':'voicemind-ai-pro-hero.webp',
   'livecaption-x-pro':'livecaption-x-pro-hero.webp',
   livescreentranslator:'livescreentranslator-hero.webp'
 };
 const heroImage=a=>'assets/images/'+(heroMap[a.id]||'rohaniocr-hero.webp');
 const status=a=>a.status==='available'&&!!a.downloadUrl;
 const jump=()=>{
  const hash=location.hash;if(!hash)return;
  const el=$(hash);if(el)requestAnimationFrame(()=>el.scrollIntoView({block:'start',behavior:'auto'}));
 };
 function motion(){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;
  document.documentElement.classList.add('js-motion');
  const io=('IntersectionObserver' in window)?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('seen');io.unobserve(e.target)}}),{threshold:.055,rootMargin:'0px 0px 45px 0px'}):null;
  $$('[data-reveal]').forEach(el=>io?io.observe(el):el.classList.add('seen'));
  if(matchMedia('(pointer:fine)').matches){
   const aura=$('.cursor-aura');let tx=-300,ty=-300,x=-300,y=-300;
   document.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(aura)aura.style.opacity='.85'},{passive:true});
   document.addEventListener('pointerleave',()=>{if(aura)aura.style.opacity='0'});
   if(aura){const frame=()=>{x+=(tx-x)*.18;y+=(ty-y)*.18;aura.style.left=x+'px';aura.style.top=y+'px';requestAnimationFrame(frame)};frame()}
   document.addEventListener('pointermove',e=>{const card=e.target.closest('.shine-card');if(!card)return;const r=card.getBoundingClientRect();card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')},{passive:true});
   $$('.tilt').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const xx=(e.clientX-r.left)/r.width-.5, yy=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1100px) rotateY(${(xx*6).toFixed(2)}deg) rotateX(${(-yy*4).toFixed(2)}deg) translateY(-3px)`});
    el.addEventListener('pointerleave',()=>el.style.transform='');
   });
  }
 }
 function navigation(){
  const btn=$('#menu-toggle'),nav=$('#primary-nav');
  if(btn&&nav){btn.addEventListener('click',()=>{let open=nav.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));btn.setAttribute('aria-label',open?'بستن فهرست':'باز کردن فهرست')});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}});document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}})}
  const rail=$('.progress-rail');let ticking=false;const update=()=>{ticking=false;if(!rail)return;const max=document.documentElement.scrollHeight-innerHeight;rail.style.transform=`scaleX(${max>0?Math.max(0,Math.min(1,scrollY/max)):0})`};
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});update();
 }
 function appMarkup(a){const active=status(a);return `<article class="software-card shine-card" data-reveal>
 <a href="${esc(detailUrl(a))}" class="software-art" style="--cardcolor:${color(a)}25" aria-label="جزئیات ${esc(a.name)}"><img class="software-cover-image" src="${heroImage(a)}" loading="lazy" alt="تصویر گرافیکی معرفی ${esc(a.name)}"><span class="software-cover-glint" aria-hidden="true"></span></a>
 <div class="software-body"><div class="software-meta"><span>${a.platform==='android'?'ANDROID':'WINDOWS'} / ${esc(a.category)}</span><span class="${active?'flag-ready':'flag-pending'}">${active?'● منتشر شده':'◌ در دست توسعه'}</span></div>
 <h3>${esc(a.name)}</h3><p>${esc(a.tagline||a.summary)}</p>
 <div class="software-foot"><span class="muted">${active?'نسخه '+esc(a.version):'به‌زودی'}</span><a href="${esc(detailUrl(a))}">مشاهده جزئیات ←</a></div></div></article>`}
 function observeLater(target){if(!target)return;const elements=$$('[data-reveal]',target);if('IntersectionObserver'in window){const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('seen');o.unobserve(e.target)}}),{threshold:.05});elements.forEach(e=>o.observe(e))}else elements.forEach(e=>e.classList.add('seen'))}
 function featured(){const target=$('#home-apps');if(!target)return;let list=apps.filter(a=>status(a)).slice(0,3);target.innerHTML=list.map(a=>`<a class="product-sample surface shine-card" style="--cardglow:${color(a)}" href="${esc(detailUrl(a))}" data-reveal><div class="product-symbol"><img src="${heroImage(a)}" loading="lazy" alt="تصویر گرافیکی ${esc(a.name)}"></div><span class="eyebrow">OFFICIAL RELEASE / ${esc(a.version)}</span><h3>${esc(a.name)}</h3><p>${esc(a.tagline)}</p></a>`).join('');observeLater(target)}
 function catalog(){const target=$('#app-results');if(!target)return;let filter='all';const buttons=$$('[data-filter]'),search=$('#app-search'),sort=$('#app-sort'),count=$('#app-count'),empty=$('#catalog-empty');
  const update=()=>{
   const q=(search?.value||'').trim().toLocaleLowerCase('fa');
   let list=apps.filter(a=>(filter==='all'||a.platform===filter)&&[a.name,a.tagline,a.category,a.summary].join(' ').toLocaleLowerCase('fa').includes(q));
   if(sort?.value==='available')list.sort((a,b)=>Number(status(b))-Number(status(a)));
   if(sort?.value==='name')list.sort((a,b)=>a.name.localeCompare(b.name,'fa'));
   if(sort?.value==='latest')list.sort((a,b)=>Number(status(b))-Number(status(a))||a.name.localeCompare(b.name));
   target.innerHTML=list.map(appMarkup).join('');observeLater(target);
   if(count)count.textContent=`نمایش ${list.length} برنامه از ${apps.length} برنامه`;
   if(empty)empty.classList.toggle('show',!list.length);
  };
  buttons.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));update()}));
  search?.addEventListener('input',update);sort?.addEventListener('change',update);update();
 }
 function appDetails(){let target=$('#app-detail');if(!target)return;const id=new URLSearchParams(location.search).get('id');const a=apps.find(x=>x.id===id);if(!a){target.innerHTML=`<div class="surface" style="padding:40px"><h1>برنامه پیدا نشد</h1><p>این برنامه در فهرست وجود ندارد.</p><a class="btn btn-primary" href="apps.html">بازگشت به برنامه‌ها</a></div>`;return}
  document.title=`${a.name} | Rohani98`;let ready=status(a);
  target.innerHTML=`<div class="detail-layout"><div class="glass detail-head shine-card" data-reveal><span class="eyebrow">SOFTWARE DOSSIER / R98</span><h1>${esc(a.name)}</h1><p>${esc(a.tagline)}</p><div class="pills"><span class="pill">${a.platform==='android'?'اندروید':'ویندوز'}</span><span class="pill">${esc(a.category)}</span><span class="pill">${ready?'منتشر شده':'در دست توسعه'}</span></div><a class="btn btn-primary" href="${ready?safeUrl(a.downloadUrl):'apps.html'}" ${ready?'target="_blank" rel="noopener noreferrer"':''}>${ready?'دریافت نسخه '+esc(a.version):'بازگشت به فهرست'}</a></div><div class="glass detail-art detail-art-photo" data-reveal><img src="${heroImage(a)}" alt="تصویر گرافیکی ${esc(a.name)}" loading="eager"><small>ROHANI98 / SOFTWARE STUDIO</small></div></div>
  <div class="detail-bottom"><section class="surface detail-info" data-reveal><span class="eyebrow">ABOUT PRODUCT</span><h2>معرفی و قابلیت‌ها</h2><p>${esc(a.description)}</p><ul class="feature-tags">${(a.features||[]).map(f=>`<li>${esc(f)}</li>`).join('')}</ul></section><aside class="glass detail-download" data-reveal><span class="eyebrow">DOWNLOAD CONTROL</span><h2>اطلاعات دریافت</h2><div class="file-stat"><span>نسخه</span><strong>${esc(a.version||'—')}</strong></div><div class="file-stat"><span>حجم</span><strong>${esc(a.size||'—')}</strong></div><div class="file-stat"><span>سیستم‌عامل</span><strong>${a.platform==='android'?'Android':'Windows'}</strong></div><div class="file-stat"><span>وضعیت</span><strong>${ready?'آماده دانلود':'هنوز منتشر نشده'}</strong></div>${ready?`<a class="btn btn-primary" href="${safeUrl(a.downloadUrl)}" target="_blank" rel="noopener noreferrer">⬇ دانلود نرم‌افزار</a>`:'<p>نسخه عمومی هنوز منتشر نشده است و لینک دانلود فعالی ندارد.</p>'}<p class="help-note">با کلیک روی دکمه، فایل نصب رسمی برنامه دریافت می‌شود.</p></aside></div>
  <section class="surface extra-info" data-reveal><h2>راهنمای نصب</h2><ol>${(a.installation||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p class="muted">نیازمندی‌ها: ${(a.requirements||[]).map(esc).join(' • ')}</p></section>`;
  observeLater(target);
 }
 function contact(){const form=$('#custom-order');if(!form)return;const preview=$('#order-summary'),message=$('#order-feedback');const id=id=>document.getElementById(id);
  const read=id=>String(document.getElementById(id)?.value||'').trim();
  if(new URLSearchParams(location.search).get('type')==='accounting'){
   const sel=id('software');if(sel)sel.value='نرم‌افزار حسابداری اختصاصی';
  }
  function build(){const features=$$('input[name="feature"]:checked',form).map(x=>x.value);return `سفارش نرم‌افزار اختصاصی | Rohani98\n\n`+
   `نام مشتری: ${read('customer')||'—'}\nشماره تماس: ${read('phone')||'—'}\nشرکت/مجموعه: ${read('company')||'—'}\nشهر/ولایت: ${read('city')||'—'}\n`+
   `نوع کسب‌وکار: ${read('business')||'—'}\nنوع نرم‌افزار: ${read('software')||'—'}\nپلتفرم: ${read('platform')||'—'}\nتعداد کاربران: ${read('users')||'—'}\n`+
   `امکانات: ${features.length?features.join('، '):'تعیین نشده'}\nبودجه تقریبی: ${read('budget')||'تعیین نشده'}\nزمان مورد انتظار: ${read('deadline')||'تعیین نشده'}\n\nشرح سفارش:\n${read('details')||'—'}`}
  function update(){if(preview)preview.textContent=build()}
  const validate=()=>{if(!read('customer')||!read('phone')||!read('software')||!read('details')){message.textContent='لطفاً نام، شماره تماس، نوع نرم‌افزار و شرح سفارش را تکمیل کنید.';form.reportValidity();return false}message.textContent='';return true};
  form.addEventListener('input',update);form.addEventListener('change',update);update();
  id('send-wa')?.addEventListener('click',()=>{if(!validate())return;window.open('https://wa.me/93706404348?text='+encodeURIComponent(build()),'_blank','noopener,noreferrer');message.textContent='واتساپ باز شد؛ برای ارسال نهایی پیام را خودتان تأیید کنید.'});
  id('send-tg')?.addEventListener('click',()=>{if(!validate())return;window.open('https://t.me/share/url?url='+encodeURIComponent('https://rohani9824.github.io/contact.html')+'&text='+encodeURIComponent(build()),'_blank','noopener,noreferrer');message.textContent='صفحه اشتراک تلگرام باز شد؛ گیرنده را در تلگرام انتخاب کنید.'});
  id('send-email')?.addEventListener('click',()=>{if(!validate())return;window.open('https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent('afghanvafanorzahi@gmail.com')+'&su='+encodeURIComponent('سفارش نرم‌افزار اختصاصی Rohani98')+'&body='+encodeURIComponent(build()),'_blank','noopener,noreferrer');message.textContent='پیش‌نویس Gmail باز شد؛ برای ارسال نهایی روی Send کلیک کنید.'});
  id('copy-order')?.addEventListener('click',async()=>{if(!validate())return;try{await navigator.clipboard.writeText(build());message.textContent='متن سفارش کپی شد.'}catch{message.textContent='کپی خودکار ممکن نبود؛ متن سفارش را از بخش پیش‌نمایش انتخاب و کپی کنید.'}});
 }
 function init(){navigation();if($('#home-apps'))featured();if($('#app-results'))catalog();if($('#app-detail'))appDetails();if($('#custom-order'))contact();motion();jump()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
