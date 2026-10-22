/* ROHANI98 NEON GALAXY · enhancements only; no changes to order or download business logic */
(()=>{'use strict';
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine=window.matchMedia('(pointer:fine)');
  const $=(q,root=document)=>root.querySelector(q);
  const $all=(q,root=document)=>Array.from(root.querySelectorAll(q));
  function boot(){
    // Subtle animated point field, paused while tab hidden and disabled for reduced motion.
    if(!reduce.matches){
      const canvas=document.createElement('canvas');canvas.className='ng-particle-canvas';canvas.setAttribute('aria-hidden','true');
      document.body.prepend(canvas);
      const ctx=canvas.getContext('2d',{alpha:true});
      if(ctx){
        let width=0,height=0,raf=0,particles=[];
        function resize(){
          const dpr=Math.min(window.devicePixelRatio||1,1.5);
          width=window.innerWidth;height=window.innerHeight;
          canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
          canvas.style.width=width+'px';canvas.style.height=height+'px';
          ctx.setTransform(dpr,0,0,dpr,0,0);
          const count=Math.min(55,Math.max(20,Math.round(width*height/19500)));
          particles=Array.from({length:count},(_,i)=>({x:Math.random()*width,y:Math.random()*height,
            r:Math.random()*1.5+.4,dy:(Math.random()*.17+.06),dx:(Math.random()-.5)*.12,
            alpha:Math.random()*.45+.2,hue:[189,214,278,313,155][i%5]}));
        }
        function frame(){
          ctx.clearRect(0,0,width,height);
          for(const p of particles){
            p.y-=p.dy;p.x+=p.dx;
            if(p.y < -6){p.y=height+6;p.x=Math.random()*width}
            if(p.x>width+7)p.x=-7;if(p.x< -7)p.x=width+7;
            ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
            ctx.fillStyle=`hsla(${p.hue},100%,77%,${p.alpha})`;ctx.shadowBlur=11;ctx.shadowColor=`hsla(${p.hue},100%,65%,.42)`;ctx.fill();
          }
          ctx.shadowBlur=0;
          if(!document.hidden)raf=requestAnimationFrame(frame);
        }
        resize();frame();
        let scheduled=false;
        window.addEventListener('resize',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;resize()})}},{passive:true});
        document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else{cancelAnimationFrame(raf);frame()}});
      }
    }
    if(fine.matches&&!reduce.matches){
      const aura=document.createElement('div');aura.className='ng-mouse-aura';aura.setAttribute('aria-hidden','true');document.body.appendChild(aura);
      let x=-400,y=-400,tx=-400,ty=-400;
      document.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;aura.style.opacity='.8'},{passive:true});
      document.addEventListener('pointerleave',()=>aura.style.opacity='0');
      (function follow(){x+=(tx-x)*.18;y+=(ty-y)*.18;aura.style.left=x+'px';aura.style.top=y+'px';requestAnimationFrame(follow)})();
      const art=$('.ng-hero-art'),laptop=$('#ng-laptop');
      if(art&&laptop){
        art.addEventListener('pointermove',e=>{const r=art.getBoundingClientRect();
          const px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
          laptop.style.transform=`rotateY(${(-8+px*7).toFixed(2)}deg) rotateX(${(3-py*5).toFixed(2)}deg) rotateZ(-1deg)`;
        },{passive:true});
        art.addEventListener('pointerleave',()=>laptop.style.transform='');
      }
      $all('.ng-feature-tile,.ng-industry-tile,.ng-confidence-grid article').forEach(card=>{
        card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();
          card.style.setProperty('--x',`${(e.clientX-r.left)/r.width*100}%`);
          card.style.setProperty('--y',`${(e.clientY-r.top)/r.height*100}%`);
        },{passive:true});
      });
    }
    // Demo dashboard controls: clearly labelled illustrative data.
    const dash=$('.ng-dashboard-sidebar');
    if(dash){
      const tabs=$all(':scope > span',dash);
      const scenarios=[
        {name:'روند فروش نمایشی',a:'۱۲۸',b:'۲۴۸',c:'۹۶۰',curve:[160,136,145,95,112,74,93,55,65,22],color:'#37ebff'},
        {name:'خرید و فروش (نمونه)',a:'۸۶',b:'۱۵۷',c:'۷۴۲',curve:[110,155,122,118,68,102,73,62,29,44],color:'#ff86d7'},
        {name:'انبار و موجودی (نمونه)',a:'۵۲',b:'۹۶',c:'۱٬۲۴۰',curve:[126,130,95,113,88,106,62,59,44,24],color:'#44f6b5'},
        {name:'حساب مشتریان (نمونه)',a:'۶۰',b:'۳۰۲',c:'۹۶۰',curve:[153,132,114,98,112,79,94,49,41,18],color:'#ffbd61'},
        {name:'گزارش‌های تصویری (نمونه)',a:'۹۴',b:'۲۴۸',c:'۸۷۰',curve:[144,150,102,94,116,70,86,42,54,29],color:'#b78aff'},
        {name:'تنظیمات و مدیریت (نمونه)',a:'۱۲۸',b:'۲۴۸',c:'۹۶۰',curve:[134,112,109,92,106,67,81,57,36,28],color:'#6bddff'}
      ];
      tabs.forEach((span,i)=>{
        const btn=document.createElement('button');btn.type='button';btn.textContent=span.textContent;
        btn.className=span.className;btn.setAttribute('aria-label',`نمایش ${span.textContent.trim()} در داشبورد نمونه`);
        btn.setAttribute('aria-pressed',String(i===0));span.replaceWith(btn);
        btn.addEventListener('click',()=>{
          const data=scenarios[i],path=$('#ng-chart-path'),area=$('#ng-chart-area');
          const pts=data.curve.map((v,j)=>`${j===0?'M':'L'}${[0,60,110,160,215,265,315,365,420,500][j]} ${v}`).join(' ');
          if(path){path.setAttribute('d',pts);path.setAttribute('stroke',data.color);path.style.animation='none';path.style.strokeDashoffset='0'}
          if(area){area.setAttribute('d',pts+' L500 180 L0 180 Z');}
          const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
          set('ng-chart-title',data.name);set('ng-metric-a',data.a);set('ng-metric-b',data.b);set('ng-metric-c',data.c);
          $all('button',dash).forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-pressed',String(b===btn))});
        });
      });
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
