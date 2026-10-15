// Offline cache: everything is precached on first visit. Bump VERSION when files change.
const VERSION='cn26-v2';
const ASSETS=['./','./index.html','./js/app.js','./js/globe.min.js','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
 // network-first for the page (fresh itinerary when online, 4s cap), cache-first for static assets
 if(req.mode==='navigate'){e.respondWith(Promise.race([fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put('./index.html',cp));return r}),new Promise((_,j)=>setTimeout(j,4000))]).catch(()=>caches.match('./index.html',{ignoreSearch:true})));return;}
 e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp))}return r})));});
