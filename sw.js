// Offline cache. Bump VERSION (and ?v= in index.html / main.js / src/globe.js) when files change.
// HTML + JS: network-first (cache only as offline fallback). Images: cache-first, exact URL (so ?v= busts).
// Precache bypasses the HTTP cache (cache:'reload') so a fresh worker can never store stale files.
const VERSION='cn26-v4';
const ASSETS=['./','./index.html','./js/main.js?v=4','./js/globe3d.min.js?v=4','./img/earth-2k.jpg?v=4','./img/earth-cn.jpg?v=4','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(VERSION).then(c=>Promise.all(ASSETS.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>{if(r.ok)return c.put(u,r)}).catch(()=>{})))));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
const put=(key,r)=>{if(r&&r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put(key,cp))}return r};
const netFirst=(req,key,ms)=>new Promise((res,rej)=>{let done=false;const fb=()=>caches.match(key).then(h=>h||caches.match(key,{ignoreSearch:true})).then(h=>{if(!done&&h){done=true;res(h)}});
 const t=setTimeout(fb,ms);fetch(req,{cache:'no-cache'}).then(r=>{clearTimeout(t);put(key,r);if(!done){done=true;res(r)}}).catch(()=>{clearTimeout(t);fb().then(()=>{if(!done)rej(new Error('offline'))})});});
self.addEventListener('fetch',e=>{const req=e.request;const u=new URL(req.url);if(req.method!=='GET'||u.origin!==location.origin)return;
 if(req.mode==='navigate'){e.respondWith(netFirst(req,'./index.html',4000));return;}
 if(/\.(js|webmanifest|html)$/.test(u.pathname)){e.respondWith(netFirst(req,req,8000));return;}
 e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>put(req,r))));});
