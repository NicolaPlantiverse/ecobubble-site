/* rete-bg-v16c.js
   Sfondo "rete multidimensionale" per le sottopagine del sito EcoBubble.
   Stesso motore WebGL della home (PARTICLE BRAIN, versione statica senza morph):
   9.000 nodi in 3 lobi + alone, ~300 hub con sinapsi 2-NN e impulsi in viaggio,
   deriva lenta, trascina per ruotare, ignizione al cursore.
   Config per pagina: window.RETE_CFG={ac:[r,g,b], ac2:[...], ac3:[...]}  (0..1) */
(function(){
"use strict";
var cv=document.getElementById('bg');if(!cv)return;
var gl=cv.getContext('webgl',{antialias:false,alpha:true})||cv.getContext('experimental-webgl',{antialias:false,alpha:true});
if(!gl){document.body.classList.add('nogl');return;}
var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
var CFG=window.RETE_CFG||{};
var AC =CFG.ac ||[0.29,0.88,0.55];
var AC2=CFG.ac2||[0.36,0.66,1.00];
var AC3=CFG.ac3||[0.66,0.55,1.00];
var WHT=[0.95,1.0,0.97];
var N=9000,NH=300,NP=200;
function rnd(a,b){return a+Math.random()*(b-a);}

/* ---- forma: rete a 3 lobi + alone ---- */
var P=new Float32Array(N*3),C=new Float32Array(N*3);
(function(){
 var H=30,hubs=[],i;
 for(i=0;i<H;i++){var lob=i%3;var cx=lob===0?-0.74:(lob===1?0.74:0);
  hubs.push([cx+rnd(-0.42,0.42),rnd(-0.72,0.72),rnd(-0.55,0.55),lob]);}
 var per=Math.floor(N*0.9/H);
 for(i=0;i<N;i++){var k=i*3;
  if(i<per*H){var h=hubs[Math.floor(i/per)];
   var g=0.12*(Math.random()+Math.random()+Math.random()-1.5),
       g2=0.12*(Math.random()+Math.random()+Math.random()-1.5),
       g3=0.12*(Math.random()+Math.random()+Math.random()-1.5);
   var col=h[3]===0?AC:(h[3]===1?AC2:AC3);
   if(Math.random()<0.05)col=WHT;
   var f=0.6+0.6*Math.random();
   P[k]=h[0]+g;P[k+1]=h[1]+g2;P[k+2]=h[2]+g3;
   C[k]=col[0]*f;C[k+1]=col[1]*f;C[k+2]=col[2]*f;}
  else{var a=Math.random()*6.2832,ph=Math.acos(rnd(-1,1)),r=1.4*Math.cbrt(Math.random());
   P[k]=r*Math.sin(ph)*Math.cos(a);P[k+1]=r*Math.cos(ph)*0.8;P[k+2]=r*Math.sin(ph)*Math.sin(a);
   C[k]=0.5*0.24;C[k+1]=0.6*0.24;C[k+2]=0.56*0.24;}}
})();

/* ---- hub, sinapsi, impulsi ---- */
var hubIdx=[];(function(){var step=Math.floor(N/NH);for(var i=0;i<NH;i++)hubIdx.push((i*step+(i*37)%29)%N);})();
function hubPos(h){var k=hubIdx[h]*3;return[P[k],P[k+1],P[k+2]];}
var E=(function(){
 var pts=[],i,j;for(i=0;i<NH;i++)pts.push(hubPos(i));
 var out=[],seen={};
 for(i=0;i<NH;i++){var d=[];
  for(j=0;j<NH;j++){if(j===i)continue;var dx=pts[i][0]-pts[j][0],dy=pts[i][1]-pts[j][1],dz=pts[i][2]-pts[j][2];d.push([dx*dx+dy*dy+dz*dz,j]);}
  d.sort(function(p,q){return p[0]-q[0];});
  for(var k2=0;k2<2;k2++){var jj=d[k2][1],key=Math.min(i,jj)+'_'+Math.max(i,jj);if(!seen[key]){seen[key]=1;out.push([i,jj]);}}}
 for(var t=0;t<30;t++){i=Math.floor(Math.random()*NH);j=Math.floor(Math.random()*NH);var key2=Math.min(i,j)+'_'+Math.max(i,j);if(i!==j&&!seen[key2]){seen[key2]=1;out.push([i,j]);}}
 return out;})();
var NE=E.length;
var LA=new Float32Array(NE*6),LC=new Float32Array(NE*6);
(function(){for(var e=0;e<NE;e++){var a=hubPos(E[e][0]),b=hubPos(E[e][1]);
 LA.set(a,e*6);LA.set(b,e*6+3);
 var ka=hubIdx[E[e][0]]*3,kb=hubIdx[E[e][1]]*3;
 LC[e*6]=Math.min(1,C[ka]*1.5);LC[e*6+1]=Math.min(1,C[ka+1]*1.5);LC[e*6+2]=Math.min(1,C[ka+2]*1.5);
 LC[e*6+3]=Math.min(1,C[kb]*1.5);LC[e*6+4]=Math.min(1,C[kb+1]*1.5);LC[e*6+5]=Math.min(1,C[kb+2]*1.5);}})();
var PA0=new Float32Array(NP*3),PA1=new Float32Array(NP*3),PPh=new Float32Array(NP),PSp=new Float32Array(NP);
(function(){for(var k=0;k<NP;k++){var ee=E[Math.floor(Math.random()*NE)];
 PA0.set(hubPos(ee[0]),k*3);PA1.set(hubPos(ee[1]),k*3);
 PPh[k]=Math.random();PSp[k]=0.05+Math.random()*0.22;}})();

/* ---- shader ---- */
function sh(type,src){var o=gl.createShader(type);gl.shaderSource(o,src);gl.compileShader(o);return o;}
function prog(vs,fs){var p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);return p;}
var ROT='float cy=cos(uRy),sy=sin(uRy);p=vec3(p.x*cy+p.z*sy,p.y,-p.x*sy+p.z*cy);float cx=cos(uRx),sx=sin(uRx);p=vec3(p.x,p.y*cx-p.z*sx,p.y*sx+p.z*cx);float s=2.3/(2.3-p.z);';
var VS='attribute vec3 aP;attribute vec3 aC;attribute float aR;'+
'uniform float uTime,uRy,uRx,uAsp,uDpr,uWob;uniform vec2 uM;varying vec3 vC;varying float vA;'+
'void main(){vec3 p=aP;p+=uWob*(0.012+0.026*aR)*vec3(sin(uTime*0.7+aR*43.7),cos(uTime*0.8+aR*29.3),sin(uTime*0.6+aR*17.9));'+ROT+
'vec2 scr=vec2(p.x*s*0.72/uAsp,p.y*s*0.72);gl_Position=vec4(scr,0.0,1.0);'+
'float md=length(vec2((scr.x-uM.x)*uAsp,scr.y-uM.y));float bo=smoothstep(0.40,0.0,md);'+
'gl_PointSize=(1.3+2.3*aR)*s*uDpr*(1.0+1.5*bo);vC=aC;'+
'vA=(0.5+0.5*clamp(s-0.7,0.0,1.0))*(0.72+0.28*sin(uTime*2.0+aR*95.0))*(1.0+1.3*bo);}';
var FS='precision mediump float;varying vec3 vC;varying float vA;void main(){vec2 q=gl_PointCoord-vec2(0.5);float d=length(q);float a=smoothstep(0.5,0.03,d)*vA;gl_FragColor=vec4(vC*a,a);}';
var PR=prog(VS,FS);
var LVS='attribute vec3 aA;attribute vec3 aC;uniform float uRy,uRx,uAsp;varying vec3 vC;void main(){vec3 p=aA;'+ROT+'gl_Position=vec4(p.x*s*0.72/uAsp,p.y*s*0.72,0.0,1.0);vC=aC;}';
var LFS='precision mediump float;uniform float uA;varying vec3 vC;void main(){gl_FragColor=vec4(vC,1.0)*uA;}';
var LPr=prog(LVS,LFS);
var PVS='attribute vec3 aA0;attribute vec3 aA1;attribute float aPh;attribute float aSp;uniform float uTime,uRy,uRx,uAsp,uDpr;varying float vA;void main(){float tt=fract(aPh+uTime*aSp);vec3 p=mix(aA0,aA1,tt);'+ROT+'gl_Position=vec4(p.x*s*0.72/uAsp,p.y*s*0.72,0.0,1.0);gl_PointSize=(2.0+1.6*sin(tt*3.14159))*s*uDpr;vA=sin(tt*3.14159)*clamp(s-0.55,0.0,1.0);}';
var PFS='precision mediump float;uniform float uA;varying float vA;void main(){vec2 q=gl_PointCoord-vec2(0.5);float d=length(q);float a=smoothstep(0.5,0.0,d)*vA*uA;gl_FragColor=vec4(vec3(0.75,1.0,0.88)*a,a);}';
var PPr=prog(PVS,PFS);

function buf(arr,usage){var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,arr,usage||gl.STATIC_DRAW);return b;}
var bP=buf(P),bC=buf(C),bR=(function(){var r=new Float32Array(N);for(var i=0;i<N;i++)r[i]=Math.random();return buf(r);})();
var bLA=buf(LA),bLC=buf(LC),bA0=buf(PA0),bA1=buf(PA1),bPh=buf(PPh),bSp=buf(PSp);

var W,H2,dpr,asp;
function size(){dpr=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H2=innerHeight;cv.width=W*dpr;cv.height=H2*dpr;asp=W/H2;gl.viewport(0,0,cv.width,cv.height);}
size();window.addEventListener('resize',function(){clearTimeout(size._t);size._t=setTimeout(size,150);});

var tmx=0,tmy=0,mx=0,my=0,dragging=false,dpx=0,yv=0,drift=0;
window.addEventListener('pointermove',function(e){tmx=e.clientX/W-0.5;tmy=e.clientY/H2-0.5;if(dragging){var dx=e.clientX-dpx;dpx=e.clientX;yv=dx*0.0038;drift+=yv;}},{passive:true});
cv.addEventListener('pointerdown',function(e){dragging=true;dpx=e.clientX;});
window.addEventListener('pointerup',function(){dragging=false;});

gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
var AT={},LT={},PT={};
['aP','aC','aR'].forEach(function(n){AT[n]=gl.getAttribLocation(PR,n);});
['uTime','uRy','uRx','uAsp','uDpr','uWob','uM'].forEach(function(n){AT[n]=gl.getUniformLocation(PR,n);});
['aA','aC'].forEach(function(n){LT[n]=gl.getAttribLocation(LPr,n);});
['uRy','uRx','uAsp','uA'].forEach(function(n){LT[n]=gl.getUniformLocation(LPr,n);});
['aA0','aA1','aPh','aSp'].forEach(function(n){PT[n]=gl.getAttribLocation(PPr,n);});
['uTime','uRy','uRx','uAsp','uDpr','uA'].forEach(function(n){PT[n]=gl.getUniformLocation(PPr,n);});
function attr(loc,b,size){gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);}
function dis(){for(var i=0;i<6;i++)gl.disableVertexAttribArray(i);}

var last=performance.now();
function frame(now){var dt=Math.min(0.05,(now-last)/1000);last=now;
 mx+=(tmx-mx)*Math.min(1,dt*3);my+=(tmy-my)*Math.min(1,dt*3);
 if(!reduced)drift+=dt*0.08;
 if(!dragging){yv*=Math.pow(0.94,dt*60);drift+=yv;}
 var ry=drift+mx*0.5,rx=-0.12+my*0.32;var tm=reduced?0:now/1000;
 gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
 gl.useProgram(LPr);dis();attr(LT.aA,bLA,3);attr(LT.aC,bLC,3);
 gl.uniform1f(LT.uRy,ry);gl.uniform1f(LT.uRx,rx);gl.uniform1f(LT.uAsp,asp);gl.uniform1f(LT.uA,0.26);
 gl.drawArrays(gl.LINES,0,NE*2);
 if(!reduced){gl.useProgram(PPr);dis();attr(PT.aA0,bA0,3);attr(PT.aA1,bA1,3);attr(PT.aPh,bPh,1);attr(PT.aSp,bSp,1);
  gl.uniform1f(PT.uTime,tm);gl.uniform1f(PT.uRy,ry);gl.uniform1f(PT.uRx,rx);gl.uniform1f(PT.uAsp,asp);gl.uniform1f(PT.uDpr,dpr);gl.uniform1f(PT.uA,0.85);
  gl.drawArrays(gl.POINTS,0,NP);}
 gl.useProgram(PR);dis();attr(AT.aP,bP,3);attr(AT.aC,bC,3);attr(AT.aR,bR,1);
 gl.uniform1f(AT.uTime,tm);gl.uniform1f(AT.uRy,ry);gl.uniform1f(AT.uRx,rx);gl.uniform1f(AT.uAsp,asp);gl.uniform1f(AT.uDpr,dpr);gl.uniform1f(AT.uWob,reduced?0:1);gl.uniform2f(AT.uM,mx*2.0,-my*2.0);
 gl.drawArrays(gl.POINTS,0,N);
 requestAnimationFrame(frame);}
requestAnimationFrame(frame);
})();
