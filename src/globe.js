// Source for js/globe.min.js. Build: esbuild src/globe.js --bundle --minify --format=esm --outfile=js/globe.min.js
// 'three' resolves to vendor/three.module.min.js (vendored r170, tree-shaken at build time).
import {WebGLRenderer,Scene,PerspectiveCamera,Group,Mesh,SphereGeometry,MeshBasicMaterial,ShaderMaterial,
 BackSide,AdditiveBlending,Vector3,CatmullRomCurve3,TubeGeometry,BufferGeometry,Float32BufferAttribute,
 LineBasicMaterial,LineSegments,Points,PointsMaterial,RingGeometry,Color,DoubleSide} from 'three';

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
 spin.add(new Mesh(new SphereGeometry(1,64,48),new MeshBasicMaterial({color:0x0d1424})));
 // graticule
 const gp=[];const seg=(a,b)=>gp.push(a.x,a.y,a.z,b.x,b.y,b.z);
 for(let lat=-75;lat<=75;lat+=15)for(let lon=-180;lon<180;lon+=4)seg(ll(lat,lon,1.001),ll(lat,lon+4,1.001));
 for(let lon=-180;lon<180;lon+=15)for(let lat=-88;lat<88;lat+=4)seg(ll(lat,lon,1.001),ll(lat+4,lon,1.001));
 const gg=new BufferGeometry();gg.setAttribute('position',new Float32BufferAttribute(gp,3));
 spin.add(new LineSegments(gg,new LineBasicMaterial({color:0x2a3a5c,transparent:true,opacity:.55})));
 // atmosphere
 scene.add(new Mesh(new SphereGeometry(1.18,48,32),new ShaderMaterial({side:BackSide,transparent:true,blending:AdditiveBlending,depthWrite:false,
  vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'varying vec3 n;void main(){float i=pow(max(0.,.62-dot(n,vec3(0,0,1.))),2.2);gl_FragColor=vec4(.95,.62,.32,1.)*i*1.6;}'})));
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
  const geo=new TubeGeometry(curve,Math.max(24,Math.round(ang*80)),.0055,6,false);
  const m=new Mesh(geo,new MeshBasicMaterial({color:new Color(COL[b]||'#f2c46b').lerp(gold,.35),transparent:true,opacity:.95,blending:AdditiveBlending,depthWrite:false}));
  geo.setDrawRange(0,0);spin.add(m);arcs.push({m,geo,curve,n:geo.index.count});});
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
  labels.append(b);marks.push({k,p,ring,b,off});}
 // view: face central China
 const home={y:-90*D2R-112*D2R,x:30*D2R};let ry=home.y,rx=home.x,vy=0,vx=0,drag=null,idle=0;
 const size=()=>{const w=box.clientWidth,h=box.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;
  cam.position.set(0,0,w/h<1?3.7:3.3);cam.updateProjectionMatrix();};
 size();addEventListener('resize',size);
 canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,t:e.pointerType};idle=0;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;
  vy=dx*.005;ry+=vy;if(drag.t==='mouse'){vx=dy*.005;rx+=vx;}});
 const up=()=>{drag=null};canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
 // run loop only when visible
 let run=true,raf=0,t0=performance.now();
 const vis=new IntersectionObserver(es=>{run=es[0].isIntersecting&&!document.hidden;if(run&&!raf)raf=requestAnimationFrame(loop)});vis.observe(box);
 document.addEventListener('visibilitychange',()=>{run=!document.hidden;if(run&&!raf)raf=requestAnimationFrame(loop)});
 const v=new Vector3(),camDir=new Vector3();
 function loop(now){raf=0;if(!run)return;const t=Math.max(0,(now-t0)/1000),dt=1/60;
  if(!drag){vy*=.94;vx*=.94;ry+=vy;rx+=vx;idle+=dt;
   if(idle>4){ry+=(home.y+Math.sin(t*.15)*.25-ry)*.01;rx+=(home.x-rx)*.02;}}
  rx=Math.max(-1.2,Math.min(1.2,rx));spin.rotation.y=ry;tilt.rotation.x=rx;
  // draw-on arcs sequentially, then keep
  const per=.9;arcs.forEach((a,i)=>{const f=Math.min(1,Math.max(0,(t-.3-i*per*.6)/per));a.geo.setDrawRange(0,Math.floor(a.n*f/6)*6);});
  // comet loops over legs
  const L=arcs.length,cyc=(t*.32)%L,li=Math.floor(cyc);comet.position.copy(arcs[li].curve.getPointAt(cyc-li));
  halo.scale.setScalar(1+.25*Math.sin(t*6));
  marks.forEach((m,i)=>{const s=1+((t*.8+i*.17)%1)*1.6;m.ring.scale.setScalar(s);m.ring.material.opacity=1-((t*.8+i*.17)%1);});
  r.render(scene,cam);
  // labels
  const w=box.clientWidth,h=box.clientHeight;cam.getWorldDirection(camDir);
  marks.forEach(m=>{v.copy(m.p);spin.localToWorld(v);const facing=v.clone().normalize().dot(camDir)<-.15;
   v.project(cam);m.b.style.transform=`translate(${(v.x*.5+.5)*w+m.off[0]}px,${(-v.y*.5+.5)*h+m.off[1]}px)`;
   m.b.classList.toggle('off',!facing);m.b.tabIndex=facing?0:-1;});
  raf=requestAnimationFrame(loop);}
 raf=requestAnimationFrame(loop);
 requestAnimationFrame(()=>box.dataset.mode='3d');
}
