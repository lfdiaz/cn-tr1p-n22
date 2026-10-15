const esc=t=>String(t).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const taxiBtn=(name,addr,zh)=>`<button type="button" class="taxi" data-n="${esc(name)}" data-a="${esc(addr)}" data-z="${esc(zh)}">🚕 Show driver</button>`;
const I={flight:'<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" fill="currentColor"/>',
hotel:'<path d="M3 20V5h2v9h7V8h6a3 3 0 0 1 3 3v9h-2v-3H5v3zm5-7a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/>',
transfer:'<path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zm2.2-1h9.6l-1-3H8.2zM7.5 15a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor"/>',
activity:'<path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill="currentColor"/>',
gap:'<path d="M12 3l10 18H2zm-1 6v6h2V9zm0 8v2h2v-2z" fill="currentColor"/>',
bday:'<path d="M12 2c1 1.3 1.5 2.3 1.5 3a1.5 1.5 0 0 1-3 0c0-.7.5-1.7 1.5-3zM11 8h2v3h5a2 2 0 0 1 2 2v2.5c-1 0-1.5-.8-2.5-.8s-1.5.8-2.5.8-1.5-.8-2.5-.8-1.5.8-2.5.8-1.5-.8-2.5-.8S5 15.5 4 15.5V13a2 2 0 0 1 2-2h5zM4 17.3c1 0 1.5-.8 2.5-.8s1.5.8 2.5.8 1.5-.8 2.5-.8 1.5.8 2.5.8 1.5-.8 2.5-.8 1.5.8 2.5.8V21H4z" fill="currentColor"/>',
train:'<path d="M12 2c4 0 7 .5 7 4v9.5a3.5 3.5 0 0 1-3.5 3.5L17 20.5V21h-2l-2-2h-2l-2 2H7v-.5L8.5 19A3.5 3.5 0 0 1 5 15.5V6c0-3.5 3-4 7-4zM7 7v4h10V7zm1.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill="currentColor"/>',
note:'<path d="M5 3h10l4 4v14H5zm9 1.5V8h3.5zM8 12h8v1.5H8zm0 3h8v1.5H8z" fill="currentColor"/>'};
const COPY='<svg viewBox="0 0 24 24"><path d="M8 8h11v13H8zM5 3h11v3H7v11H5z" fill="currentColor"/></svg>';
const svg=k=>`<svg viewBox="0 0 24 24">${I[k]}</svg>`;
const C={hou:'#7fb0ea',sha:'#f27a64',zjj:'#6cc98a',lj:'#5cc8d2',ckg:'#f2a752',bj:'#dc8cc0'};
const ROUTE=[['Houston','hou'],['Shanghai','sha'],['Zhangjiajie','zjj'],['Xiyue·Linjiang Inn','lj'],['Chongqing','ckg'],['Beijing','bj'],['Shanghai','sha'],['Houston','hou']];
const cf=c=>`<span class="conf" data-c="${c}">${c}${COPY}</span>`;
const card=(k,tag,ttl,body='',confs=[])=>`<div class="card k-${k}"><div class="ic">${svg(k)}</div><div class="cb"><div class="tag">${tag}</div><div class="ttl">${ttl}</div>${body}${confs.map(cf).join('')}</div></div>`;
const S=t=>`<div class="sm">${t}</div>`;
const PAX=S('Passengers: Luis Fernando Diaz · Gabriela Abigail Chavez Chavarria');
const TIP='<ul class="li"><li><b>Bring passports</b>: they are your ticket ID.</li><li>Arrive at the station <b>45 min early</b>; foreigners use the <b>manual passport gate</b>.</li></ul>';
const train=(no,cls,route,price,sale,o,extra='')=>card('train','Train · Trip.com · '+cls,no+' · '+route,S(price)+PAX+'<span class="pill warn">Tickets on sale '+sale+' · Trip.com buys automatically</span>'+extra+TIP,[o]);
const CITIES=[
{n:'Departure',c:'hou',r:'Sun Nov 22',days:[
 {d:'2026-11-22',t:'Sun Nov 22',l:'Houston → Dallas → Shanghai',h:card('flight','Flight · American Airlines','AA 3152 · IAH 7:00 AM → DFW 8:25 AM',S('Luis &amp; Gaby · 1 bag each'),['NREWIS'])+card('flight','Flight · American Airlines','AA 127 · DFW 10:50 AM → PVG 4:50 PM <span class="sm">(+1, Nov 23)</span>',S('Seats <b>33D</b> (Luis), <b>33E</b> (Gaby)'),['NREWIS'])}]},
{n:'Shanghai',c:'sha',r:'Nov 23 – 27',days:[
 {d:'2026-11-23',t:'Mon Nov 23',l:'Arrive Shanghai',h:card('transfer','Airport pickup · Trip.com','PVG → No. 399 Renmin Road · 5:55 PM',S('Driver arranged · Meet &amp; Greet · $33.65'),['1658114885404528'])+card('hotel','Check-in · 4 nights','Crystal Orange Shanghai the Bund Yu Garden Hotel',S('Nov 23–27 · Superior Queen Room · guest Luis Fernando Diaz'),['1658114493793951'])},
 {d:'2026-11-24',t:'Tue Nov 24',l:'🎂 Gaby turns 30 · Shanghai Disneyland',bday:1,id:'disney',h:
  card('activity','Activity · Trip.com','Shanghai Disneyland 1-Day Ticket · Adult ×2',S('$131.18 total ($65.59 each) · non-refundable')+S('Travelers: DIAZ/LUIS FERNANDO · CHAVEZ CHAVARRIA/GABRIELA ABIGAIL')+'<span class="pill warn">Booked · awaiting supplier confirmation</span><span class="pill">Confirmation → gabychavezch19@gmail.com</span>'+S('<b>Bring original passports</b>: your passport is your entry ID.'),['1658115962147614'])+
  card('note','Game plan','Rope-drop Zootopia',`<ul class="li"><li>Park hours Nov 24: <b>8:30 AM – 8:00 PM</b>.</li><li>Head straight to <b>Zootopia: Hot Pursuit</b> at opening.</li><li>If lines are long, buy <b>Premier Access</b> same-day in the Shanghai Disney app.</li><li>Set up <b>Alipay / WeChat Pay</b> before the trip.</li></ul>`)+
  card('bday','Birthday ideas','Make it a 30th to remember',`<ul class="li"><li><b>Free birthday button</b> at Guest Services (to the right of the entrance gates; show your passport), plus <b>“Celebrating Together”</b> buttons.</li><li><b>Royal Banquet Hall</b> character dinner in the castle: about ¥428/adult + 15% service. Book in the Shanghai Disney app about 1 week ahead (around <b>Nov 17</b>) and mention the birthday.</li><li><b>ILLUMINATE!</b> fireworks: best view near the Storytellers Statue. Arrive 30–40 min early.</li></ul>`)},
 {d:'2026-11-25',e:'2026-11-26',t:'Nov 25 – 26',l:'Free days in Shanghai',h:S('No bookings.')}]},
{n:'Zhangjiajie',c:'zjj',r:'Nov 27 – 30',days:[
 {d:'2026-11-27',e:'2026-11-28',t:'Fri Nov 27',l:'Shanghai → Zhangjiajie',h:card('flight','Flight · Juneyao Airlines · Trip.com','HO2199 · PVG T2 4:55 PM → DYG 7:35 PM',S('Shanghai Pudong (PVG) T2 → Zhangjiajie Hehua (DYG) · nonstop · economy · 2 adults · $254.40 for 2')+S('Each: 44 lb checked bag + 11 lb carry-on')+S('Passengers: Luis Fernando Diaz · GABRIELA A CHAVEZCHAVARRIA <i>(name shortened for length; carry her passport)</i>')+S('Tip: arrive at PVG 2 hours early.'),['1658116324891090'])+card('hotel','Check-in · 2 nights','Zhangjiajie Ruyuan Homestay',S('Wulingyuan Landmark Store, National Forest Park · Nov 27–29 · Hefeng Double Bed Bathtub Room'),['1658114494064828'])},
 {d:'2026-11-29',t:'Sun Nov 29',l:'Zhangjiajie',h:card('hotel','Extension · 1 night (same room)','Zhangjiajie Ruyuan Homestay',S('Nov 29–30'),['1658114716493655'])}]},
{n:'Xiyue·Linjiang Inn',c:'lj',r:'Nov 30 – Dec 1',days:[
 {d:'2026-11-30',t:'Mon Nov 30',l:'Zhangjiajie → Xiyue·Linjiang Inn',h:train('G6117','Premier seat','Zhangjiajie West (Zhangjiajiexi) 12:40 PM → Furongzhen (Furong Town) 1:03 PM','23 min · $24.87 for 2','Nov 16','1658116285345409')+card('hotel','Check-in · 1 night','Xiyue·Linjiang Inn',S('Nov 30–Dec 1 · Cliffside River-View Comfort Double Bed Room · guest Gabriela Chavez'),['1658113580437903'])}]},
{n:'Chongqing',c:'ckg',r:'Dec 1 – 4',days:[
 {d:'2026-12-01',t:'Tue Dec 1',l:'→ Chongqing',h:card('transfer','Taxi · pay locally','Furong Town → Zhangjiajie West station',S('~84 km · 1–1.5 hrs · roughly ¥200–300 · <b>leave by ~10:00 AM</b>'))+train('G2432','Premier seat','Zhangjiajie West 11:57 AM → Chongqing East (Chongqingdong) 2:39 PM','2h 42m · $122.56 for 2','Nov 17','1658116285348551')+card('hotel','Check-in · 3 nights','BERKIN. Baili Jin Skyview Riverfront Hotel',S('Near Liberation Monument &amp; Hongya Cave · Dec 1–4 · Deep Sky Horizon 270° Crystal Tub Suite'),['1658114482256205'])},
 {d:'2026-12-02',t:'Wed Dec 2',l:'Free day in Chongqing',h:S('No bookings.')},
 {d:'2026-12-03',t:'Thu Dec 3',l:'Chongqing 1949 show',h:card('activity','Activity · Trip.com','Chongqing 1949 · 360° rotating stage · 7:30 PM – 8:40 PM',S('Deluxe seats · <b>A Area</b> · 2 tickets · $100.96 total · non-refundable')+S('Guests: Luis Fernando Diaz · Gabriela Abigail Chavez Chavarria')+S('📍 No. 999 Jinbi Zheng Street, Ciqikou, Shapingba District, Chongqing')+'<span class="pill warn">Booked · voucher emailed after supplier confirms</span>'+`<ul class="li"><li>Arrive by <b>7:00 PM</b> (30 min early).</li><li>Entry to rotating A/B zones closes <b>5 min after start</b> — no refunds for late arrival.</li><li>Show is in Chinese: pick up free <b>English headsets</b> at the customer support window (¥150 refundable deposit each, ¥300 total).</li><li>Staff may contact you by 10 PM on Dec 2.</li></ul>`+'<a class="lnk" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Chongqing 1949 Ciqikou')+'">Google Maps ↗</a><a class="lnk" target="_blank" rel="noopener" href="https://uri.amap.com/search?keyword='+encodeURIComponent('重庆·1949')+'">Amap ↗</a>'+taxiBtn('Chongqing 1949','No. 999 Jinbi Zheng Street, Ciqikou, Shapingba District, Chongqing','重庆·1949'),['1658116002803638'])}]},
{n:'Beijing',c:'bj',r:'Dec 4 – 8',days:[
 {d:'2026-12-04',t:'Fri Dec 4',l:'Chongqing → Beijing',h:card('flight','Flight · Air China · ticketed','CA1440 · CKG 6:15 PM → PEK 8:55 PM',S('2 passengers · $221.12'),['1658115271259154'])+card('hotel','Check-in · 3 nights','Manxin Mansion Beijing Houhai and Drum Tower Courtyard',S('Dec 4–7 · Yixin Double Bed Room'),['1658114716464081'])},
 {d:'2026-12-05',e:'2026-12-06',t:'Dec 5 – 6',l:'Free days in Beijing',h:S('No bookings.')},
 {d:'2026-12-07',t:'Mon Dec 7',l:'Beijing',h:card('hotel','Extension · 1 night','Manxin Mansion Beijing',S('Dec 7–8'),['1658114716470309'])}]},
{n:'Shanghai',c:'sha',r:'Dec 8 – 9',days:[
 {d:'2026-12-08',t:'Tue Dec 8',l:'Beijing → Shanghai',h:train('G17','1st class','Beijing South (Beijingnan) 1:00 PM → Shanghai 5:35 PM','4h 35m · $335.44 for 2','Nov 24','1658116285351482',S('Arrives at <b>Shanghai main station</b> (not Hongqiao).'))+card('hotel','Check-in · 1 night',"Shanghai People's Square Nanjing East Road Pedestrian Street Treasury Hotel",S('Dec 8–9 · Treasure Big Bed Room'),['1658114716484076'])},
 {d:'2026-12-09',t:'Wed Dec 9',l:'Shanghai → Houston',h:card('transfer','Airport drop-off · Trip.com','No. 678 Hankou Road → PVG · 3:00 PM',S('$23.68 · plenty of buffer for the 6:50 PM international departure'),['1658115465111967'])+card('flight','Flight · American Airlines','AA 128 · PVG 6:50 PM → DFW 5:50 PM <span class="sm">(same day)</span>',S('Seats <b>33D</b> / <b>33E</b>'),['NREWIS'])+card('flight','Flight · American Airlines','AA 2790 · DFW 9:26 PM → IAH 10:39 PM','',['NREWIS'])}]}];
const HOT=[['Crystal Orange Shanghai the Bund Yu Garden Hotel','sha','Shanghai','Nov 23–27 · 4 nights','Superior Queen Room',['1658114493793951'],'Crystal Orange Shanghai the Bund Yu Garden Hotel'],
['Zhangjiajie Ruyuan Homestay (Wulingyuan Landmark Store, National Forest Park)','zjj','Zhangjiajie','Nov 27–30 · 3 nights (2 bookings)','Hefeng Double Bed Bathtub Room',['1658114494064828','1658114716493655'],'Zhangjiajie Ruyuan Homestay Wulingyuan'],
['Xiyue·Linjiang Inn','lj','City not shown on booking','Nov 30–Dec 1 · 1 night','Cliffside River-View Comfort Double Bed Room',['1658113580437903'],'Xiyue Linjiang Inn'],
['BERKIN. Baili Jin Skyview Riverfront Hotel','ckg','Chongqing · near Liberation Monument & Hongya Cave','Dec 1–4 · 3 nights','Deep Sky Horizon 270° Crystal Tub Suite',['1658114482256205'],'BERKIN Baili Jin Skyview Riverfront Hotel Chongqing'],
['Manxin Mansion Beijing Houhai and Drum Tower Courtyard','bj','Beijing','Dec 4–8 · 4 nights (2 bookings)','Yixin Double Bed Room',['1658114716464081','1658114716470309'],'Manxin Mansion Beijing Houhai Drum Tower'],
["Shanghai People's Square Nanjing East Road Pedestrian Street Treasury Hotel",'sha','Shanghai','Dec 8–9 · 1 night','Treasure Big Bed Room',['1658114716484076'],"Treasury Hotel Nanjing East Road People's Square Shanghai"]];
const GAPS=[];
const AA=[['Luis · ticket (0012362505394)',304.00],['Luis · taxes & fees',803.03],['Luis · seat DFW→PVG (33D)',30.08],['Luis · seat PVG→DFW (33D)',25.28],['Gaby · ticket (0012362505395)',304.00],['Gaby · taxes & fees',803.03],['Gaby · seat DFW→PVG (33E)',28.57],['Gaby · seat PVG→DFW (33E)',24.01]];
const TC=[['Airport pickup PVG → Renmin Rd (Nov 23)',33.65,'t'],['Crystal Orange Bund Yu Garden (4 nts)',454.43,'h'],['Ruyuan Homestay (2 nts)',175.12,'h'],['Ruyuan Homestay (1 nt)',87.64,'h'],['Xiyue·Linjiang Inn (1 nt)',81.57,'h'],['BERKIN Chongqing (3 nts)',312.72,'h'],['Juneyao HO2199 PVG→DYG (Nov 27, 2 pax)',254.40,'f'],['Air China CA1440 CKG→PEK (2 pax)',221.12,'f'],['Manxin Mansion (3 nts)',315.03,'h'],['Manxin Mansion (1 nt)',98.59,'h'],['Treasury Hotel Shanghai (1 nt)',111.32,'h'],['Airport drop-off Hankou Rd → PVG (Dec 9)',23.68,'t'],['Train G6117 Zhangjiajie West → Furong Town (Nov 30, 2 pax)',24.87,'r'],['Train G2432 Zhangjiajie West → Chongqing East (Dec 1, 2 pax)',122.56,'r'],['Train G17 Beijing South → Shanghai (Dec 8, 2 pax)',335.44,'r']];
const ACT=[['Shanghai Disneyland 1-Day Ticket ×2 (Nov 24, Trip.com #1658115962147614)',131.18],['Chongqing 1949 show · Deluxe A Area ×2 (Dec 3, Trip.com #1658116002803638)',100.96]];
const $=id=>document.getElementById(id);
const cents=L=>L.reduce((x,c)=>x+Math.round(c[1]*100),0);
const f=c=>'$'+(c/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const rows=L=>L.map(c=>`<tr><td>${c[0]}</td><td>${f(Math.round(c[1]*100))}</td></tr>`).join('');
$('routeEl').innerHTML=ROUTE.map((r,i)=>`${i?'<span class="arr">→</span>':''}<span class="stop" style="--c:${C[r[1]]}"><i></i>${r[0]}</span>`).join('');
const seen={};
$('tl').innerHTML=CITIES.map(c=>{const cid=seen[c.c]?'':(seen[c.c]=1,` id="city-${c.c}"`);return `<div class="rv grp"${cid} style="--c:${C[c.c]}"><div class="city"><h3>${c.n}</h3><span>${c.r}</span></div>${c.days.map(d=>`<details open class="day${d.bday?' bday':''}" data-d="${d.d}" data-e="${d.e||d.d}"${d.id?` id="${d.id}"`:''}><summary><span class="dt">${d.t}</span><span class="dl">${d.l}</span><svg class="chev" width="14" height="14" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" fill="none"/></svg></summary>${d.h}</details>`).join('')}</div>`}).join('');
$('hl').innerHTML=HOT.map(h=>`<div class="card k-hotel hotel rv" style="--c:${C[h[1]]}"><div class="ic">${svg('hotel')}</div><div class="cb"><div class="tag">${h[2]}</div><div class="ttl">${h[0]}</div>${S(h[3]+' · '+h[4])}${h[5].map(cf).join('')}${S('Amap/Baidu search: <b>'+h[6]+'</b>')}<a class="lnk" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h[6])}">Google Maps ↗</a><a class="lnk" target="_blank" rel="noopener" href="https://uri.amap.com/search?keyword=${encodeURIComponent(h[6])}">Amap ↗</a>${taxiBtn(h[0],h[6],'')}</div></div>`).join('');
$('gl').innerHTML=(GAPS.length?'':card('transfer','All transport booked','No open gaps',S('Every leg of the trip has booked transport.')))+GAPS.map(g=>card('gap',g[0],g[1],S(g[2]))).join('')+card('transfer','Checked','Dec 9 drop-off timing',S('A 3:00 PM pickup for a 6:50 PM international departure is fine.'));
const a=cents(AA),t=cents(TC),x=cents(ACT),g=a+t+x;
$('aa').innerHTML=rows(AA)+`<tr class="st"><td>AA subtotal</td><td>${f(a)}</td></tr>`;
$('ct').innerHTML=rows(TC)+`<tr class="st"><td>Trip.com subtotal</td><td>${f(t)}</td></tr>`;
$('act').innerHTML=rows(ACT)+`<tr class="st"><td>Activities subtotal</td><td>${f(x)}</td></tr>`;
$('tt').innerHTML=`<tr><td>American Airlines</td><td>${f(a)}</td></tr><tr><td>Trip.com stays &amp; transport</td><td>${f(t)}</td></tr><tr><td>Activities</td><td>${f(x)}</td></tr><tr class="gt"><td>Grand total</td><td>${f(g)}</td></tr>`;
const cat=k=>cents(TC.filter(r=>r[2]==k));
const D=[['Flights (AA + Air China + Juneyao)',a+cat('f'),'#3b6ea5'],['Hotels',cat('h'),'#b23a2a'],['Transfers',cat('t'),'#3f7d4e'],['Trains',cat('r'),'#2a7f8a'],['Activities',x,'#7b4fb0']];
let off=0;const R=15.915;
$('donut').innerHTML=`<svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="${R}" fill="none" stroke="var(--line)" stroke-width="6"/>${D.map(d=>{const p=d[1]/g*100;const s=`<circle cx="21" cy="21" r="${R}" fill="none" stroke="${d[2]}" stroke-width="6" stroke-dasharray="${p} ${100-p}" stroke-dashoffset="${25-off}"/>`;off+=p;return s}).join('')}<text x="21" y="20" text-anchor="middle" font-size="3" fill="var(--mute)">TOTAL</text><text x="21" y="25" text-anchor="middle" font-size="4.6" font-weight="700" fill="var(--ink)">${f(g).replace(/\.\d+$/,'')}</text></svg><div class="legend">${D.map(d=>`<div style="--c:${d[2]}"><i></i>${d[0]}<span>${f(d[1])}</span></div>`).join('')}</div>`;

// ---- time: China (Asia/Shanghai) + Houston (America/Chicago) ----
const fmtT=(tz)=>new Intl.DateTimeFormat('en-US',{timeZone:tz,weekday:'short',hour:'numeric',minute:'2-digit'});
const tCN=fmtT('Asia/Shanghai'),tHOU=fmtT('America/Chicago');
const cnDate=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const dep=Date.parse('2026-11-22T13:00:00Z'),home=Date.parse('2026-12-10T04:39:00Z');
const TRIP0='2026-11-22',TRIP1='2026-12-09';
let todayEl=null;
function markToday(){const ymd=cnDate();todayEl=null;
 document.querySelectorAll('details.day').forEach(d=>{const on=ymd>=d.dataset.d&&ymd<=d.dataset.e;d.classList.toggle('today',on);if(on)todayEl=d;});
 const tb=$('todayBtn');
 if(ymd<TRIP0)tb.textContent='Day 1 →';else if(ymd>TRIP1)tb.textContent='Last day →';else tb.textContent='Today →';
 return ymd;}
function tick(){const n=Date.now();
 $('clkCN').textContent=tCN.format(n);$('clkHOU').textContent=tHOU.format(n);
 if(n<dep){let s=(dep-n)/1e3;$('cdd').textContent=Math.floor(s/86400);$('cdh').textContent=Math.floor(s%86400/3600);$('cdm').textContent=Math.floor(s%3600/60);}
 else if(n<home){const day=Math.min(18,Math.floor((n-dep)/864e5)+1);$('cd').innerHTML=`<div><b>Day ${day}</b><span>of 18</span></div>`;$('cdl').textContent='Enjoy the trip!';}
 else{$('cd').innerHTML='<div><b>Home</b><span>welcome back</span></div>';$('cdl').textContent='What a trip.';}
 markToday();}
tick();setInterval(tick,30000);
function goToday(){const ymd=markToday();let el=todayEl;
 if(!el){const all=[...document.querySelectorAll('details.day')];el=ymd<TRIP0?all[0]:all[all.length-1];}
 el.open=true;el.scrollIntoView({block:'start',behavior:rm?'auto':'smooth'});el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');}
$('todayBtn').addEventListener('click',goToday);
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
// auto-jump during the trip (China date)
if(todayEl&&!location.hash)setTimeout(()=>todayEl.scrollIntoView({block:'start'}),350);
// ---- reveal ----
if(rm||!('IntersectionObserver' in window))document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'));
else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -5% 0px'});document.querySelectorAll('.rv').forEach(e=>io.observe(e));}
// ---- copy ----
const toast=$('toast');
const say=m=>{toast.textContent=m;toast.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(()=>toast.classList.remove('on'),1500)};
document.addEventListener('click',e=>{const el=e.target.closest('.conf');if(!el)return;const c=el.dataset.c;
const done=()=>say('Copied '+c);
const fb=()=>{const ta=document.createElement('textarea');ta.value=c;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(_){}ta.remove();done()};
if(navigator.clipboard&&isSecureContext)navigator.clipboard.writeText(c).then(done,fb);else fb();});
// ---- taxi mode ----
const tx=$('taxiDlg');
document.addEventListener('click',e=>{const b=e.target.closest('.taxi');if(!b)return;
 $('txZh').textContent=b.dataset.z;$('txZh').hidden=!b.dataset.z;$('txZhL').hidden=!b.dataset.z;
 $('txN').textContent=b.dataset.n;$('txA').textContent=b.dataset.a;
 $('txNo').hidden=!!b.dataset.z;
 if(tx.showModal)tx.showModal();else tx.setAttribute('open','');});
$('txClose').addEventListener('click',()=>tx.close?tx.close():tx.removeAttribute('open'));
tx.addEventListener('click',e=>{if(e.target===tx)tx.close();});
// ---- city jump (used by SVG map + 3D globe) ----
window.goCity=k=>{const el=document.getElementById('city-'+k);if(el)el.scrollIntoView({block:'start',behavior:rm?'auto':'smooth'});};
document.querySelectorAll('[data-city]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();goCity(a.dataset.city)}));
// ---- lazy 3D globe ----
(function(){const box=$('globe');
 const ok=()=>{try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')))}catch(_){return false}};
 if(rm||!ok()){box.dataset.mode='static';return;}
 const go=()=>import('./globe3d.min.js?v=4').then(m=>m.init(box,C)).catch(err=>{box.dataset.mode='static';console.warn('3D unavailable',err&&err.message)});
 if('IntersectionObserver' in window){const o=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){o.disconnect();(window.requestIdleCallback||setTimeout)(go,{timeout:800})}});o.observe(box);}else go();})();
// ---- offline ----
// SW: always check for a new worker (bypassing HTTP cache); when a new one takes control, reload once so
// the page runs the fresh HTML/JS instead of whatever an older worker served.
if('serviceWorker' in navigator){const sw=navigator.serviceWorker;let had=!!sw.controller,re=false;
 sw.addEventListener('controllerchange',()=>{if(had&&!re){re=true;location.reload();}had=true;});
 addEventListener('load',()=>sw.register('./sw.js',{updateViaCache:'none'}).then(r=>{r.update().catch(()=>{});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')r.update().catch(()=>{})});}).catch(()=>{}));}
