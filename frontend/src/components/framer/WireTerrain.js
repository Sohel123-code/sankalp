/**
 * Wire Terrain — Framer code component
 *
 * An independently written WebGL wireframe-terrain flyover with a scanning
 * pulse and pointer steering.
 *
 * Copyright (c) <YEAR> <YOUR NAME>. All rights reserved (or apply the licence
 * of your choice, e.g. MIT, before distributing or selling this component).
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 700
 */import{jsx as _jsx}from"react/jsx-runtime";import{useEffect,useRef}from"react";import{addPropertyControls,ControlType,useIsStaticRenderer}from"./runtime.js";/* ------------------------------------------------------------------ *//* Tunables                                                            *//* ------------------------------------------------------------------ */const FIELD_DEPTH=60// how far ahead the mesh extends
;const FIELD_HALF_WIDTH=44// half of the mesh width
;const LOOK_BEHIND=4// mesh starts slightly behind the camera
;const BASE_EYE=1.8;const BASE_AMPLITUDE=4;const FLIGHT_SPEED=4// world units / second at speed = 100%
;const SCAN_SPEED=10// world units / second at scanSpeed = 100%
;const SCAN_RANGE=60;const FOV_Y=58*Math.PI/180;const BASE_PITCH=6*Math.PI/180;const MAX_YAW=10*Math.PI/180;const MAX_BANK=5*Math.PI/180;const MAX_LIFT=.7;const DPR_CAP=2;const STATIC_SCROLL=24// frame shown on canvas / export / reduced motion
;const STATIC_SCAN=20;function parseHex(s){const m=/^#([0-9a-f]{3,8})$/i.exec(s.trim());if(!m)return null;let h=m[1];if(h.length===3||h.length===4)h=h.split("").map(c=>c+c).join("");if(h.length!==6&&h.length!==8)return null;const n=i=>parseInt(h.slice(i,i+2),16);return[n(0),n(2),n(4),h.length===8?n(6)/255:1];}/** Resolve any CSS colour (hex, rgb(a), hsl, named, var(--token, #fff)) to RGBA. */function resolveColor(el,input,fallback){if(!input)return fallback;const hex=parseHex(input);if(hex)return hex;if(!el||typeof window==="undefined")return fallback;const prev=el.style.color;el.style.color="";el.style.color=input;if(!el.style.color){el.style.color=prev;return fallback;}const computed=window.getComputedStyle(el).color;el.style.color=prev;const m=/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/.exec(computed);if(!m)return fallback;let a=1;if(m[4]!==undefined)a=m[4].endsWith("%")?parseFloat(m[4])/100:parseFloat(m[4]);return[parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3]),a];}function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s;}return o;}const identity=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);function rotX(a){const m=identity(),c=Math.cos(a),s=Math.sin(a);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m;}function rotY(a){const m=identity(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m;}function rotZ(a){const m=identity(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[1]=s;m[4]=-s;m[5]=c;return m;}function translate(x,y,z){const m=identity();m[12]=x;m[13]=y;m[14]=z;return m;}function perspective(fovY,aspect,near,far){const f=1/Math.tan(fovY/2);const m=new Float32Array(16);m[0]=f/aspect;m[5]=f;m[10]=(far+near)/(near-far);m[11]=-1;m[14]=2*far*near/(near-far);return m;}/* ------------------------------------------------------------------ *//* Shaders                                                             *//* ------------------------------------------------------------------ */const VERT=`
precision highp float;
attribute vec2 aCell;          // (column, row) index of this vertex
uniform vec4 uGrid;            // cols, rows, step, halfWidth
uniform vec2 uScroll;          // integer row offset, fractional row offset
uniform mat4 uMVP;
uniform float uAmp;
uniform float uScan;
uniform float uFogFar;
varying float vFog;
varying float vScan;
varying float vPeak;

float landscape(float x, float z) {
    float ax = abs(x);
    float walls = smoothstep(2.5, 15.0, ax);
    float swell = sin(x * 0.27 + sin(z * 0.13) * 2.1) * 0.5 + 0.5;
    float crest = 1.0 - abs(sin(z * 0.19 + x * 0.09 + 1.3));
    float chop  = sin(x * 0.61 - z * 0.43) * 0.5 + 0.5;
    float n = swell * 0.5 + crest * crest * 0.35 + chop * 0.15;
    return uAmp * (walls * (n * 1.8 + 0.5 * ax / uGrid.w) + 0.08 * (n - 0.5));
}

void main() {
    float x = (aCell.x / uGrid.x * 2.0 - 1.0) * uGrid.w;
    float zLocal = (aCell.y - uScroll.y) * uGrid.z - ${LOOK_BEHIND.toFixed(1)};
    float zWorld = (aCell.y + uScroll.x) * uGrid.z;
    float h = landscape(x, zWorld);

    // the camera looks down -Z
    gl_Position = uMVP * vec4(x, h, -zLocal, 1.0);

    float dist = length(vec2(x * 0.5, zLocal));
    vFog = 1.0 - smoothstep(uFogFar * 0.3, uFogFar, dist);
    vScan = exp(-abs(zLocal - uScan) / 1.8);
    vPeak = clamp(h / (uAmp * 1.6 + 0.001), 0.0, 1.0);
}
`;const FRAG=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec4 uColor;
uniform vec3 uHot;
uniform float uFill;
varying float vFog;
varying float vScan;
varying float vPeak;
void main() {
    if (uFill > 0.5) {
        gl_FragColor = vec4(uColor.rgb, 1.0);
        return;
    }
    float a = uColor.a * vFog * (0.45 + 0.55 * vPeak);
    vec3 c = mix(uColor.rgb, uHot, clamp(vScan * 0.9, 0.0, 1.0));
    a = clamp(a * (1.0 + vScan * 3.0), 0.0, 1.0);
    gl_FragColor = vec4(c, a);
}
`;function buildProgram(gl){const make=(type,src)=>{const sh=gl.createShader(type);if(!sh)return null;gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){console.error("WireTerrain shader error:",gl.getShaderInfoLog(sh));gl.deleteShader(sh);return null;}return sh;};const vs=make(gl.VERTEX_SHADER,VERT);const fs=make(gl.FRAGMENT_SHADER,FRAG);if(!vs||!fs)return null;const prog=gl.createProgram();if(!prog)return null;gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.bindAttribLocation(prog,0,"aCell");gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){console.error("WireTerrain link error:",gl.getProgramInfoLog(prog));return null;}return prog;}/** Vertex grid plus triangle and line index lists (16-bit indices). */function buildMesh(rows){const step=FIELD_DEPTH/rows;const cols=Math.max(2,2*Math.round(FIELD_HALF_WIDTH/step));const stride=cols+1;const verts=new Float32Array(stride*(rows+1)*2);for(let r=0;r<=rows;r++)for(let c=0;c<=cols;c++){const i=(r*stride+c)*2;verts[i]=c;verts[i+1]=r;}const tris=[];const lines=[];for(let r=0;r<=rows;r++)for(let c=0;c<=cols;c++){const a=r*stride+c;if(c<cols)lines.push(a,a+1);if(r<rows)lines.push(a,a+stride);if(c<cols&&r<rows)tris.push(a,a+1,a+stride,a+1,a+stride+1,a+stride);}return{cols,rows,step,verts,tris:new Uint16Array(tris),lines:new Uint16Array(lines)};}const DEFAULTS={background:"#04110F",lineColor:"#5FE8C8",accentColor:"#FF7A45",density:64,speed:100,relief:100,cameraHeight:100,fogDistance:44,scan:true,scanSpeed:100,hover:100};/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 700
 */export default function WireTerrain(props){const p={...DEFAULTS,...props};const isStatic=useIsStaticRenderer();const rootRef=useRef(null);const canvasRef=useRef(null);const propsRef=useRef(p);propsRef.current=p;const staticRef=useRef(isStatic);staticRef.current=isStatic;const colorsRef=useRef({bg:[4,17,15,1],line:[95,232,200,1],hot:[255,122,69,1]});const engineRef=useRef(null);/* ---- one-time WebGL setup ---- */useEffect(()=>{const root=rootRef.current;const canvas=canvasRef.current;if(!root||!canvas)return;const gl=canvas.getContext("webgl",{antialias:true,alpha:false,depth:true});if(!gl)return;const prog=buildProgram(gl);if(!prog)return;const U=n=>gl.getUniformLocation(prog,n);const loc={grid:U("uGrid"),scroll:U("uScroll"),mvp:U("uMVP"),amp:U("uAmp"),scan:U("uScan"),fogFar:U("uFogFar"),color:U("uColor"),hot:U("uHot"),fill:U("uFill")};const vbo=gl.createBuffer();const triIbo=gl.createBuffer();const lineIbo=gl.createBuffer();let mesh=buildMesh(DEFAULTS.density);let meshRows=-1;const uploadMesh=rows=>{mesh=buildMesh(rows);meshRows=rows;gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,mesh.verts,gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,triIbo);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.tris,gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,lineIbo);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.lines,gl.STATIC_DRAW);};gl.enableVertexAttribArray(0);gl.depthFunc(gl.LEQUAL);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);let width=1;let height=1;let dpr=1;const resize=()=>{dpr=Math.min(DPR_CAP,window.devicePixelRatio||1);width=root.clientWidth||1;height=root.clientHeight||1;const bw=Math.max(1,Math.round(width*dpr));const bh=Math.max(1,Math.round(height*dpr));if(canvas.width!==bw||canvas.height!==bh){canvas.width=bw;canvas.height=bh;}};resize();const ro=new ResizeObserver(()=>{resize();if(!animating())draw(0);});ro.observe(root);const reduceMotion=typeof window.matchMedia==="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;let visible=true;const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible)engine.start();});io.observe(root);const animating=()=>!staticRef.current&&!reduceMotion&&visible;/* simulation state */const pointer={nx:0,ny:0,active:false,presence:0};const cam={yaw:0,bank:0,lift:0};let scroll=STATIC_SCROLL;let scanZ=STATIC_SCAN;let clock=0;let raf=0;let last=-1;const draw=dt=>{const cfg=propsRef.current;const col=colorsRef.current;const rows=Math.max(16,Math.min(110,Math.round(cfg.density)));if(rows!==meshRows)uploadMesh(rows);const live=animating();const speed=Math.max(0,cfg.speed)/100;const hover=Math.max(0,cfg.hover)/100;const relief=Math.max(0,cfg.relief)/100;const eye=Math.max(.2,cfg.cameraHeight/100)*BASE_EYE;const fogFar=Math.max(12,cfg.fogDistance);if(live){clock+=dt*speed;scroll+=dt*speed*FLIGHT_SPEED;scanZ=(scanZ+dt*(Math.max(0,cfg.scanSpeed)/100)*SCAN_SPEED)%SCAN_RANGE;}/* camera easing */pointer.presence+=((pointer.active&&live?1:0)-pointer.presence)*(1-Math.exp(-dt*3));const k=pointer.presence*Math.min(1,hover);const idleYaw=Math.sin(clock*.21)*.03+Math.sin(clock*.13+2)*.015;const idleBank=Math.sin(clock*.17+1)*.03;const idleLift=Math.sin(clock*.11)*.1;const yawT=live?idleYaw*(1-k)+pointer.nx*MAX_YAW*hover*k:0;const bankT=live?idleBank*(1-k)+pointer.nx*MAX_BANK*hover*k:0;const liftT=live?idleLift*(1-k)-pointer.ny*MAX_LIFT*hover*k:0;const ease=live?1-Math.exp(-dt*2.5):1;cam.yaw+=(yawT-cam.yaw)*ease;cam.bank+=(bankT-cam.bank)*ease;cam.lift+=(liftT-cam.lift)*ease;const camY=Math.max(.4,eye*(1+cam.lift));const pitch=BASE_PITCH+(camY/BASE_EYE-1)*.04;const aspect=canvas.width/Math.max(1,canvas.height);const view=mul(rotZ(cam.bank),mul(rotX(pitch),mul(rotY(cam.yaw),translate(0,-camY,0))));const mvp=mul(perspective(FOV_Y,aspect,.1,200),view);const scrollRows=scroll/mesh.step;const base=Math.floor(scrollRows);const frac=scrollRows-base;gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(col.bg[0]/255,col.bg[1]/255,col.bg[2]/255,1);gl.depthMask(true);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(prog);gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.uniform4f(loc.grid,mesh.cols,mesh.rows,mesh.step,FIELD_HALF_WIDTH);gl.uniform2f(loc.scroll,base,frac);gl.uniformMatrix4fv(loc.mvp,false,mvp);gl.uniform1f(loc.amp,BASE_AMPLITUDE*relief);gl.uniform1f(loc.scan,cfg.scan?scanZ:-1e3);gl.uniform1f(loc.fogFar,fogFar);gl.uniform3f(loc.hot,col.hot[0]/255,col.hot[1]/255,col.hot[2]/255);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);/* 1. opaque fill in the background colour, so ridges hide what's behind them */gl.depthMask(true);gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,1);gl.uniform1f(loc.fill,1);gl.uniform4f(loc.color,col.bg[0]/255,col.bg[1]/255,col.bg[2]/255,1);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,triIbo);gl.drawElements(gl.TRIANGLES,mesh.tris.length,gl.UNSIGNED_SHORT,0);gl.disable(gl.POLYGON_OFFSET_FILL);/* 2. the wires */gl.depthMask(false);gl.uniform1f(loc.fill,0);gl.uniform4f(loc.color,col.line[0]/255,col.line[1]/255,col.line[2]/255,col.line[3]);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,lineIbo);gl.drawElements(gl.LINES,mesh.lines.length,gl.UNSIGNED_SHORT,0);gl.depthMask(true);};const frame=now=>{raf=0;const dt=last<0?0:Math.min(.05,Math.max(0,(now-last)/1e3));last=now;draw(dt);if(animating())raf=requestAnimationFrame(frame);else last=-1;};const engine={redraw:()=>{if(!animating())draw(0);},start:()=>{if(animating()&&!raf)raf=requestAnimationFrame(frame);else if(!animating())draw(0);}};engineRef.current=engine;engine.start();const onMove=e=>{const r=root.getBoundingClientRect();pointer.nx=Math.max(-1,Math.min(1,(e.clientX-r.left)/Math.max(1,r.width)*2-1));pointer.ny=Math.max(-1,Math.min(1,(e.clientY-r.top)/Math.max(1,r.height)*2-1));pointer.active=true;};const onLeave=()=>{pointer.active=false;};const onLost=e=>e.preventDefault();root.addEventListener("pointermove",onMove);root.addEventListener("pointerleave",onLeave);canvas.addEventListener("webglcontextlost",onLost);return()=>{if(raf)cancelAnimationFrame(raf);ro.disconnect();io.disconnect();root.removeEventListener("pointermove",onMove);root.removeEventListener("pointerleave",onLeave);canvas.removeEventListener("webglcontextlost",onLost);engineRef.current=null;gl.deleteBuffer(vbo);gl.deleteBuffer(triIbo);gl.deleteBuffer(lineIbo);gl.deleteProgram(prog);};},[]);/* ---- react to prop / renderer changes ---- */useEffect(()=>{const el=rootRef.current;colorsRef.current={bg:resolveColor(el,p.background,[4,17,15,1]),line:resolveColor(el,p.lineColor,[95,232,200,1]),hot:resolveColor(el,p.accentColor,[255,122,69,1])};engineRef.current?.start();engineRef.current?.redraw();},[isStatic,p.background,p.lineColor,p.accentColor,p.density,p.speed,p.relief,p.cameraHeight,p.fogDistance,p.scan,p.scanSpeed,p.hover]);return /*#__PURE__*/_jsx("div",{ref:rootRef,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",backgroundColor:p.background,...props.style},children:/*#__PURE__*/_jsx("canvas",{ref:canvasRef,style:{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}})});}WireTerrain.displayName="Wire Terrain";addPropertyControls(WireTerrain,{background:{type:ControlType.Color,title:"Background",defaultValue:DEFAULTS.background},lineColor:{type:ControlType.Color,title:"Lines",defaultValue:DEFAULTS.lineColor},accentColor:{type:ControlType.Color,title:"Accent",defaultValue:DEFAULTS.accentColor},density:{type:ControlType.Number,title:"Density",defaultValue:DEFAULTS.density,min:16,max:110,step:2,displayStepper:true},relief:{type:ControlType.Number,title:"Relief",defaultValue:DEFAULTS.relief,min:0,max:300,step:5,unit:"%"},cameraHeight:{type:ControlType.Number,title:"Camera",defaultValue:DEFAULTS.cameraHeight,min:30,max:250,step:5,unit:"%"},fogDistance:{type:ControlType.Number,title:"Fog",defaultValue:DEFAULTS.fogDistance,min:20,max:60,step:1},speed:{type:ControlType.Number,title:"Speed",defaultValue:DEFAULTS.speed,min:0,max:300,step:5,unit:"%"},scan:{type:ControlType.Boolean,title:"Scan",defaultValue:DEFAULTS.scan},scanSpeed:{type:ControlType.Number,title:"Scan Speed",defaultValue:DEFAULTS.scanSpeed,min:0,max:300,step:5,unit:"%",hidden:props=>props.scan===false},hover:{type:ControlType.Number,title:"Pointer",defaultValue:DEFAULTS.hover,min:0,max:200,step:5,unit:"%"}});
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"WireTerrain","slots":[],"annotations":{"framerSupportedLayoutHeight":"any","framerIntrinsicWidth":"1200","framerSupportedLayoutWidth":"any","framerIntrinsicHeight":"700","framerContractVersion":"1"}},"__FramerMetadata__":{"type":"variable"}}}
