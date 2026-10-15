// Source for js/globe.min.js. Build: esbuild src/globe.js --bundle --minify --format=esm --outfile=js/globe.min.js
// 'three' resolves to vendor/three.module.min.js (vendored r170, tree-shaken at build time).
import {WebGLRenderer,Scene,PerspectiveCamera,Group,Mesh,SphereGeometry,MeshBasicMaterial,ShaderMaterial,
 BackSide,AdditiveBlending,Vector3,CatmullRomCurve3,TubeGeometry,BufferGeometry,Float32BufferAttribute,
 LineBasicMaterial,LineSegments,Points,PointsMaterial,RingGeometry,Color,DoubleSide,TextureLoader,SRGBColorSpace} from 'three';
// Earth imagery: NASA Blue Marble Next Generation (Dec 2004, topography + bathymetry), NASA Earth Observatory / Visible Earth,
// https://visibleearth.nasa.gov/images/73909 (world.topo.bathy.200412.3x5400x2700.jpg). NASA imagery is public domain (credit: NASA Earth Observatory).
// Self-hosted as img/earth-2k.jpg (2048x1024 resize) and img/earth-cn.jpg (native-res crop 95-125E, 15-45N, loaded only when zoomed in).

const CITY={hou:['Houston',29.76,-95.37,[8,-26]],sha:['Shanghai',31.23,121.47,[12,-6]],zjj:['Zhangjiajie',29.35,110.55,[-30,-44]],
 lj:['Furong Town',28.80,109.95,[-40,14]],ckg:['Chongqing',29.56,106.55,[-104,-16]],bj:['Beijing',39.90,116.41,[8,-28]]};
const LEGS=[['hou','sha'],['sha','zjj'],['zjj','lj'],['lj','ckg'],['ckg','bj'],['bj','sha'],['sha','hou']];
const D2R=Math.PI/180;
const ll=(lat,lon,r=1)=>{const p=(90-lat)*D2R,t=(lon+180)*D2R;return new Vector3(-r*Math.sin(p)*Math.cos(t),r*Math.cos(p),r*Math.sin(p)*Math.sin(t));};

export function init(box,COL){
 const canvas=document.createElement('canvas');canvas.className='gl';canvas.setAttribute('aria-hidden','true');
 const labels=document.createElement('div');labels.className='gl-labels';
 box.append(canvas,labels);
 const r=new WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
 r.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
 const scene=new Scene(),cam=new PerspectiveCamera(34,1,.1,50);
 const tilt=new Group(),spin=new Group();tilt.add(spin);scene.add(tilt);
 // globe body
 const TL=new TextureLoader(),aniso=Math.min(4,r.capabilities.getMaxAnisotropy());
 const tex=(url,mat,cb)=>TL.load(url,t=>{t.colorSpace=SRGBColorSpace;t.anisotropy=aniso;mat.map=t;mat.color.set(0xa9b3c6);mat.needsUpdate=true;cb&&cb()},undefined,()=>{});
 const earthM=new MeshBasicMaterial({color:0x0d1424});spin.add(new Mesh(new SphereGeometry(1,96,64),earthM));
 tex('img/earth-2k.jpg',earthM,()=>box.dataset.tex='1');
 // sharper China patch (95-125E, 15-45N), fetched lazily on first close zoom
 const cnM=new MeshBasicMaterial({color:0xa9b3c6,transparent:true,opacity:0,depthWrite:false});let cnLoaded=false;
 const cnPatch=new Mesh(new SphereGeometry(1.0004,48,48,(95+180)*D2R,30*D2R,45*D2R,30*D2R),cnM);cnPatch.visible=false;spin.add(cnPatch);
 // graticule
 const gp=[];const seg=(a,b)=>gp.push(a.x,a.y,a.z,b.x,b.y,b.z);
 for(let lat=-75;lat<=75;lat+=15)for(let lon=-180;lon<180;lon+=4)seg(ll(lat,lon,1.001),ll(lat,lon+4,1.001));
 for(let lon=-180;lon<180;lon+=15)for(let lat=-88;lat<88;lat+=4)seg(ll(lat,lon,1.001),ll(lat+4,lon,1.001));
 const gg=new BufferGeometry();gg.setAttribute('position',new Float32BufferAttribute(gp,3));
 spin.add(new LineSegments(gg,new LineBasicMaterial({color:0x8fa6d6,transparent:true,opacity:.12})));
 // atmosphere
 scene.add(new Mesh(new SphereGeometry(1.18,48,32),new ShaderMaterial({side:BackSide,transparent:true,blending:AdditiveBlending,depthWrite:false,
  vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'varying vec3 n;void main(){float i=pow(max(0.,.62-dot(n,vec3(0,0,1.))),2.2);gl_FragColor=vec4(.95,.62,.32,1.)*i*1.15;}'})));
 // stars
 const sp=[];for(let i=0;i<500;i++){const v=new Vector3().randomDirection().multiplyScalar(12+Math.random()*10);sp.push(v.x,v.y,v.z);}
 const sg=new BufferGeometry();sg.setAttribute('position',new Float32BufferAttribute(sp,3));
 scene.add(new Points(sg,new PointsMaterial({color:0xfff1dc,size:.05,transparent:true,opacity:.7})));
 // arcs
 const gold=new Color(0xf2c46b);const arcs=[];
 LEGS.forEach(([a,b],i)=>{const A=ll(CITY[a][1],CITY[a][2]),B=ll(CITY[b][1],CITY[b][2]);
  const ang=A.angleTo(B),h=.03+ang*.28+(i===6?.06:0),pts=[];
  for(let k=0;k<=48;k++){const t=k/48;const v=new Vector3().copy(A).lerp(B,t).normalize().multiplyScalar(1+h*Math.sin(Math.PI*t));
   // lerp+normalize isn't a true slerp for long arcs; adequate visually.
   if(ang>2.5){const s=Math.sin(ang);v.copy(A).multiplyScalar(Math.sin((1-t)*ang)/s).add(B.clone().multiplyScalar(Math.sin(t*ang)/s)).normalize().multiplyScalar(1+h*Math.sin(Math.PI*t));}
   pts.push(v);}
  const curve=new CatmullRomCurve3(pts);
  const mat=new MeshBasicMaterial({color:new Color(COL[b]||'#f2c46b').lerp(gold,.35),transparent:true,opacity:.95,blending:AdditiveBlending,depthWrite:false});
  const tube=rad=>{const g=new TubeGeometry(curve,Math.max(24,Math.round(ang*80)),rad,6,false);g.setDrawRange(0,0);const m=new Mesh(g,mat);spin.add(m);return m;};
  const m=tube(.0055),thin=tube(.0007);thin.visible=false;
  arcs.push({m,thin,geo:m.geometry,curve,n:m.geometry.index.count});});
 // comet
 const comet=new Mesh(new SphereGeometry(.016,12,8),new MeshBasicMaterial({color:0xfff4d6}));
 const halo=new Mesh(new SphereGeometry(.04,12,8),new MeshBasicMaterial({color:0xf2c46b,transparent:true,opacity:.35,blending:AdditiveBlending,depthWrite:false}));
 comet.add(halo);spin.add(comet);
 // markers + labels
 const marks=[];
 for(const k in CITY){const [name,lat,lon,off]=CITY[k];const p=ll(lat,lon,1.003);const c=new Color(COL[k]);
  const dot=new Mesh(new SphereGeometry(.013,12,8),new MeshBasicMaterial({color:c}));dot.position.copy(p);spin.add(dot);
  const ring=new Mesh(new RingGeometry(.018,.026,32),new MeshBasicMaterial({color:c,transparent:true,side:DoubleSide,blending:AdditiveBlending,depthWrite:false}));
  ring.position.copy(p);ring.lookAt(p.clone().multiplyScalar(2));spin.add(ring);
  const b=document.createElement('button');b.type='button';b.className='gl-l';b.style.setProperty('--c',COL[k]);b.textContent=name;
  b.setAttribute('aria-label','Jump to '+name+' days');b.addEventListener('click',()=>window.goCity&&window.goCity(k));
  labels.append(b);marks.push({k,p,dot,ring,b,off,w:0});}
 // view: face central China; when zoomed in, re-centre on the Zhangjiajie / Furong / Chongqing cluster
 const home={y:-90*D2R-112*D2R,x:30*D2R},near={y:-90*D2R-108.6*D2R,x:29.3*D2R};
 let ry=home.y,rx=home.x,vy=0,vx=0,drag=null,idle=0;
 const HMIN=.32;let h0=2.7,zh=h0,zt=h0;   // camera height above the surface (current / target)
 const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
 const hn=()=>(zh-HMIN)/(h0-HMIN);       // 1 = whole Earth, 0 = full close-up
 const tgt=()=>{const f=Math.min(1,hn()*1.6);return{y:near.y+(home.y-near.y)*f,x:near.x+(home.x-near.x)*f}};
 const zoomBy=f=>{const before=zt;zt=Math.max(HMIN,Math.min(h0,zt*f));idle=0;
  if(zt<before){const k=Math.min(1,(before-zt)/before)*.9,T=tgt();ry+=wrap(T.y-ry)*k;rx+=(T.x-rx)*k;}
  return zt!==before;};
 const size=()=>{const w=box.clientWidth,h=box.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;
  const full=zt>=h0-1e-6;h0=(w/h<1?3.7:3.3)-1;if(full)zt=h0;zt=Math.min(zt,h0);cam.updateProjectionMatrix();};
 size();zh=zt;addEventListener('resize',size);
 // +/- buttons
 const zb=document.createElement('div');zb.className='gl-z';
 for(const [t,f,l] of [['+',.6,'Zoom in'],['\u2212',1/.6,'Zoom out']]){const b=document.createElement('button');b.type='button';b.textContent=t;b.setAttribute('aria-label',l);
  b.addEventListener('click',()=>zoomBy(f));zb.append(b);}
 box.append(zb);
 // drag to rotate (one-finger vertical swipes still scroll the page via touch-action:pan-y)
 let pinch=null;
 canvas.addEventListener('pointerdown',e=>{if(pinch)return;drag={x:e.clientX,y:e.clientY,t:e.pointerType};idle=0;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!drag||pinch)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;
  const s=.005*Math.max(.06,zh/h0);vy=dx*s;ry+=vy;if(drag.t==='mouse'){vx=dy*s;rx+=vx;}});
 const up=()=>{drag=null};canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
 // wheel / trackpad pinch (ctrlKey); at the zoom limits the page scrolls normally
 canvas.addEventListener('wheel',e=>{const d=e.deltaMode===1?e.deltaY*16:e.deltaY;const f=Math.exp(d*(e.ctrlKey?.01:.0018));
  if((f>1&&zt>=h0)||(f<1&&zt<=HMIN))return;e.preventDefault();zoomBy(f);},{passive:false});
 // two-finger pinch on touch
 const tdist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
 canvas.addEventListener('touchstart',e=>{if(e.touches.length>=2){e.preventDefault();drag=null;pinch={d:tdist(e.touches),z:zt};}},{passive:false});
 canvas.addEventListener('touchmove',e=>{if(pinch&&e.touches.length>=2){e.preventDefault();const z0=zt;zt=pinch.z;zoomBy(pinch.d/Math.max(1,tdist(e.touches)));if(zt===z0)idle=0;}},{passive:false});
 const tend=e=>{if(e.touches.length<2)pinch=null;};canvas.addEventListener('touchend',tend);canvas.addEventListener('touchcancel',tend);
 // run loop only when visible
 let run=true,raf=0,t0=performance.now();
 const vis=new IntersectionObserver(es=>{run=es[0].isIntersecting&&!document.hidden;if(run&&!raf)raf=requestAnimationFrame(loop)});vis.observe(box);
 document.addEventListener('visibilitychange',()=>{run=!document.hidden;if(run&&!raf)raf=requestAnimationFrame(loop)});
 const v=new Vector3(),camDir=new Vector3();
 function loop(now){raf=0;if(!run)return;const t=Math.max(0,(now-t0)/1000),dt=1/60;
  zh+=(zt-zh)*.18;if(Math.abs(zt-zh)<1e-4)zh=zt;cam.position.set(0,0,1+zh);
  const n=hn(),zs=Math.min(1,.06+.94*zh/h0);
  if(!drag){vy*=.94;vx*=.94;ry+=vy;rx+=vx;idle+=dt;
   if(idle>4){const T=tgt();ry+=wrap(T.y+Math.sin(t*.15)*.25*zs-ry)*.01;rx+=(T.x-rx)*.02;}}
  rx=Math.max(-1.2,Math.min(1.2,rx));spin.rotation.y=ry;tilt.rotation.x=rx;
  // scale markers/arcs with zoom; sharper China texture when close
  const thin=n<.3;arcs.forEach(a=>{a.m.visible=!thin;a.thin.visible=thin;});comet.scale.setScalar(zs);
  if(n<.45&&!cnLoaded){cnLoaded=true;tex('img/earth-cn.jpg',cnM,()=>{cnPatch.visible=true;box.dataset.texCn='1';});}
  if(cnPatch.visible)cnM.opacity=Math.max(0,Math.min(1,(.5-n)/.2));
  // draw-on arcs sequentially, then keep
  const per=.9;arcs.forEach((a,i)=>{const f=Math.min(1,Math.max(0,(t-.3-i*per*.6)/per)),c=Math.floor(a.n*f/6)*6;a.geo.setDrawRange(0,c);a.thin.geometry.setDrawRange(0,c);});
  // comet loops over legs
  const L=arcs.length,cyc=(t*.32)%L,li=Math.floor(cyc);comet.position.copy(arcs[li].curve.getPointAt(cyc-li));
  halo.scale.setScalar(1+.25*Math.sin(t*6));
  marks.forEach((m,i)=>{const s=1+((t*.8+i*.17)%1)*1.6;m.ring.scale.setScalar(s*zs);m.dot.scale.setScalar(zs);m.ring.material.opacity=1-((t*.8+i*.17)%1);});
  r.render(scene,cam);
  // labels
  const w=box.clientWidth,h=box.clientHeight;cam.getWorldDirection(camDir);
  // labels: designed offsets when far out, simple right-hand offsets when close; hide off-screen or overlapping ones
  const k=Math.max(0,Math.min(1,(.55-n)/.35)),sc=(.92+.12*(1-n)).toFixed(3),placed=[];
  marks.forEach(m=>{v.copy(m.p);spin.localToWorld(v);const facing=v.clone().normalize().dot(camDir)<-.15;
   v.project(cam);if(!m.w)m.w=m.b.offsetWidth;const ox=m.off[0]+(10-m.off[0])*k,oy=m.off[1]+(-14-m.off[1])*k;
   let x=(v.x*.5+.5)*w+ox,y=(-v.y*.5+.5)*h+oy,bw=m.w||80;
   let show=facing&&x>-bw*.5&&x<w-bw*.5&&y>-10&&y<h-20;
   const hit=(x,y)=>placed.some(q=>x<q[0]+q[2]+4&&q[0]<x+bw+4&&Math.abs(y-q[1])<30);
   if(show&&k>0&&hit(x,y)){if(!hit(x,y+28))y+=28;else if(!hit(x-bw-20,y))x-=bw+20;else show=false;}
   if(show)placed.push([x,y,bw]);
   m.b.style.transform=`translate(${x}px,${y}px) scale(${sc})`;
   m.b.classList.toggle('off',!show);m.b.tabIndex=show?0:-1;});
  raf=requestAnimationFrame(loop);}
 raf=requestAnimationFrame(loop);
 requestAnimationFrame(()=>box.dataset.mode='3d');
}
