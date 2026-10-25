/* Общее хранилище (IndexedDB) + золотой эффект клика. Подключается и в index.html, и в admin.html */
const DB={o(){return this._p||(this._p=new Promise((ok,no)=>{const r=indexedDB.open('samarkand',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}))},
async get(k){const d=await this.o();return new Promise((ok,no)=>{const q=d.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>ok(q.result);q.onerror=()=>no(q.error)})},
async set(k,v){const d=await this.o();return new Promise((ok,no)=>{const t=d.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=ok;t.onerror=()=>no(t.error)})}};
const DEF=()=>({title:'Samarkand',sub:'Презентация',gold:'#d4af37',sand:1,grain:.55,anim:'fan',auto:0,gTitle:'Галерея',vTitle:'Видео'});
async function loadSite(){const d=(await DB.get('site'))||{};return{settings:{...DEF(),...d.settings},slides:d.slides||[],videos:d.videos||[],links:d.links||[]}}
const uid=()=>Math.random().toString(36).slice(2,9);
const U=b=>b instanceof Blob?URL.createObjectURL(b):(b||'');
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function embed(u){let m=u.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/);if(m)return'https://www.youtube.com/embed/'+m[1];m=u.match(/vimeo\.com\/(\d+)/);return m?'https://player.vimeo.com/video/'+m[1]:''}
function applyTheme(s){const r=document.documentElement.style;r.setProperty('--gold',s.gold);r.setProperty('--grain',s.grain)}
function fx(x,y,a){
  const g=document.body,r=document.createElement('i');r.className='rg';r.style.left=x+'px';r.style.top=y+'px';g.append(r);setTimeout(()=>r.remove(),850);
  for(let i=0;i<22;i++){const p=document.createElement('i');p.className='sp';p.style.left=x+'px';p.style.top=y+'px';g.append(p);
    const an=Math.random()*6.28,d=30+Math.random()*80;
    p.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(an)*d}px,${Math.sin(an)*d+30}px) scale(0)`,opacity:0}],{duration:600+Math.random()*500,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>p.remove()}
  a.classList.add('flash');setTimeout(()=>a.classList.remove('flash'),850)}
document.addEventListener('click',e=>{
  const a=e.target.closest('a,button,[data-gold]');if(!a)return;
  const b=a.getBoundingClientRect(),x=e.detail?e.clientX:b.left+b.width/2,y=e.detail?e.clientY:b.top+b.height/2;fx(x,y,a);
  const h=a.getAttribute('href');
  if(a.tagName==='A'&&h&&!h.startsWith('#')&&!a.target&&!a.download&&!e.ctrlKey&&!e.metaKey){e.preventDefault();setTimeout(()=>location.href=a.href,520)}
});
