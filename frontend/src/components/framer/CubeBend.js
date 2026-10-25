import{jsx as _jsx,jsxs as _jsxs}from"react/jsx-runtime";import*as React from"react";import{addPropertyControls,ControlType,RenderTarget,useIsStaticRenderer}from"./runtime";/*
    CUBE BEND — self-contained folding scroller.

    Connect your content to this component and it scrolls on the face of
    a cube: the top and bottom fold over virtual edges and flatten back
    out at the scroll ends. Rounded creases are built from a chain of
    hinged 3D segments. Overscroll tumble and pointer tilt included.

    ARCHITECTURE — everything happens inside this component's own box.
    The content you connect is rendered as React children into an
    internal scroller; folded copies of that subtree are painted on the
    top and bottom edges. This component never touches the host page: it
    does not move page layers, does not read or walk its own ancestors,
    and does not write to document.body, documentElement or any global
    scrolling state. Two instances on one page cannot conflict.

    SIZING — this is an ordinary layer. To reproduce a full-screen
    experience, size the layer to 100vw x 100vh on the canvas (and set
    it to Fixed position there if you want it pinned). That is a design
    decision made in Framer, not a DOM mutation made at runtime.

    NOTE: because the fold applies a 3D transform, `position: fixed`
    descendants INSIDE the connected content (sticky navs, floating
    CTAs) resolve against this component rather than the viewport. That
    is a CSS consequence of any 3D transform and applies only to the
    content you connect — the rest of your page is unaffected.
*//*
    Backdrop behind the flat face and inside every fold band. Not
    exposed as a property control — the effect is always dark.
*/const BACKDROP="rgb(10,10,10)";const FOCUSABLE="a[href], button, input, select, textarea, summary, [tabindex], [contenteditable]";/**
 * Framer reads these annotations from the JSDoc block that sits
 * DIRECTLY above the export. Any declaration in between detaches them
 * and every annotation here is silently ignored — including
 * @framerDisableUnlink, which is why Unlink stayed available on
 * instances inserted from this component's URL. Keep this comment
 * adjacent to the function; never insert code between the two.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 * @framerDisableUnlink
 */export default function CubeBend(props){const{content=[],zone=220,angle=80,rounding=150,segments=4,perspective=900,direction="out",ease=240,smoothing=.1,foldTop=true,foldBottom=true,tumble=.5,tilt=.35,showScrollbar=false,zIndex=999999,style}=props;/*
        STATIC RENDERER — the official gate.

        `useIsStaticRenderer()` is Framer's supported API for "am I being
        rendered into something that will never run". It is true on the
        canvas, in thumbnails, during export, and during static site
        generation / SSR. It replaces the previous hand-maintained
        enumeration of RenderTarget values, which could not know about
        targets Framer had not shipped yet.

        Everything browser-only hangs off this single boolean: the whole
        effect returns immediately, so no rAF loop, no MutationObserver,
        no ResizeObserver, no event listener, no timer and no DOM write
        of any kind is created in a static context.

        RenderTarget is still imported, but only to decide whether to
        show the canvas-only "connect your content" hint below. It never
        gates behavior.
    */const isStatic=useIsStaticRenderer();const isCanvas=RenderTarget.current()===RenderTarget.canvas;const overlayRef=React.useRef(null);const scrollRef=React.useRef(null);const spacerRef=React.useRef(null);const stickyRef=React.useRef(null);const moverRef=React.useRef(null);const contentRef=React.useRef(null);const tumbleRef=React.useRef(null);const tiltRef=React.useRef(null);const topChainRef=React.useRef(null);const botChainRef=React.useRef(null);const topHinges=React.useRef([]);const botHinges=React.useRef([]);const topClones=React.useRef([]);const botClones=React.useRef([]);// The clipped strip each band actually paints through. These, and
// only these, become hit targets — see the interaction block.
const topWindows=React.useRef([]);const botWindows=React.useRef([]);const live=React.useRef({topT:0,botT:0,topC:0,botC:0,over:0,phi:0,tiltXT:0,tiltYT:0,tiltXC:0,tiltYC:0,last:0,lastSt:NaN,lastTop:NaN,lastBot:NaN,// Same latch, same NaN-primes-the-first-write trick, for the
// tilt layer — which until now was the one transform in the
// loop written on every single frame regardless of change.
lastTiltX:NaN,lastTiltY:NaN});const Z=Math.round(Math.max(zone,24));const K=Math.max(1,Math.min(Math.round(segments),12));const R=Math.round(Math.min(Math.max(rounding,0),Z));const P=Math.max(perspective,100);/**
     * Band geometry, measured outward from the hinge line.
     * The FIRST band (touching the hinge) is flat (share 0): a real
     * cylinder bend starts tangent to the flat face, and it makes the
     * hinge a junction of two unrotated layers. Band edges are integer
     * rounded so joints land on the pixel grid.
     */const bands=React.useMemo(()=>{const out=[];if(R<6||K<2){const flat=Math.min(2,Z);out.push({h:flat,share:0});if(Z-flat>0)out.push({h:Z-flat,share:1});}else{const bh=R/K;let prev=0;for(let i=0;i<K;i++){const edge=Math.round(bh*(i+1));out.push({h:edge-prev,share:i===0?0:1/(K-1)});prev=edge;}if(Z-R>0)out.push({h:Z-R,share:0});}return out;},[Z,K,R]);const cums=React.useMemo(()=>{const c=[];let a=0;for(const b of bands){a+=b.h;c.push(a);}return c;},[bands]);// Flat content clips 1px short of the hinge so crisp flat pixels
// overlap the fold's flat root band, sealing sub-pixel cracks.
const clipTop=foldTop?Z-1:0;const clipBot=foldBottom?Z-1:0;React.useEffect(()=>{// The static gate. Nothing below this line ever runs on the
// canvas, in a thumbnail, during export, or during SSR.
if(isStatic)return;const overlay=overlayRef.current;const scroller=scrollRef.current;const spacer=spacerRef.current;const sticky=stickyRef.current;const mover=moverRef.current;const contentHost=contentRef.current;if(!overlay||!scroller||!spacer||!sticky||!mover||!contentHost)return;/*
            FAILURE RECOVERY.

            There is no global state to unwind any more — this component
            mutates nothing outside its own subtree, so a failed setup
            can no longer leave the page in a broken state. What is still
            worth guarding is leakage: if setup throws after some
            listeners and observers are live, React never registers a
            cleanup and those would leak for the lifetime of the page.

            So every disposable registers itself as it is created, and
            setup runs inside a try. On failure we dispose whatever was
            created, log, and return: the component falls back to showing
            its flat middle content, unfolded, which is a perfectly
            usable state.
        */const disposers=[];const disposeAll=()=>{while(disposers.length){try{disposers.pop()();}catch{}}};try{/*
                `live` is a ref, so it SURVIVES an effect re-run while the
                DOM it describes does not: the disposers above reset
                `mover.style.transform` to "", and every prop in the
                dependency array can change the geometry those latches
                were caching. Priming them to NaN here makes the first
                frame of every setup write unconditionally (NaN !== NaN),
                which is exactly what the initial ref value already does
                for the first mount. Without this, changing e.g. Fold Zone
                leaves a stale latch that suppresses the corrective write
                until the visitor happens to scroll.
            */const l0=live.current;l0.lastSt=NaN;l0.lastTop=NaN;l0.lastBot=NaN;l0.lastTiltX=NaN;l0.lastTiltY=NaN;const relayout=()=>{const h=overlay.clientHeight;sticky.style.height=h+"px";spacer.style.height=Math.max(contentHost.offsetHeight,h)+"px";};relayout();const chainRoots=()=>[topChainRef.current,botChainRef.current];const bandWindows=()=>[...topWindows.current,...botWindows.current];/*
                A clone is decoration only. Three things have to be stripped
                before it is inserted, all of them for correctness rather
                than looks:

                - ids, because cloneNode duplicates them and duplicate ids
                  break label/for, aria-labelledby and anchor targets in the
                  REAL content;
                - focusability, because the clones are real hit targets (see
                  the interaction block) and the Tab key would otherwise
                  walk a keyboard user through a dozen aria-hidden copies of
                  the nav;
                - media sources, because every iframe/video/audio in the
                  content would otherwise load once per band (duplicated
                  embed requests, and duplicated autoplay audio).

                `inert` used to do the focus job. It is NOT used any more:
                inert also removes the subtree from hit-testing, and that
                was the first of the three reasons the bands were dead.
            */const sanitize=copy=>{copy.setAttribute("aria-hidden","true");for(const n of Array.from(copy.querySelectorAll("[id]"))){n.removeAttribute("id");}for(const n of Array.from(copy.querySelectorAll(FOCUSABLE))){n.setAttribute("tabindex","-1");}for(const n of Array.from(copy.querySelectorAll("iframe"))){n.removeAttribute("src");n.removeAttribute("srcdoc");n.setAttribute("loading","lazy");n.style.visibility="hidden";}for(const n of Array.from(copy.querySelectorAll("video, audio"))){const m=n;m.removeAttribute("autoplay");m.removeAttribute("src");m.preload="none";m.muted=true;for(const s of Array.from(m.querySelectorAll("source"))){s.removeAttribute("src");}if(m.tagName==="VIDEO")m.load();}};/*
                Cloning is expensive: it copies the connected content once
                per fold band. It must never run on a scroll frame.

                Three guards. First, the per-frame scroll transform is
                applied to `mover`, NOT to contentHost — writing a style on
                the observed node made every frame look like a content
                change and re-cloned everything 60x a second, which is what
                made scrolling feel heavy. Second, refreshes are debounced
                and deferred until scrolling stops, so hover/animation
                churn inside the content can't stall a scroll either.
                Third, the SANITIZE sweep is done once, not once per band:
                each band still receives its own deep copy (they are
                positioned independently, so that part is irreducible), but
                the copies are taken from an already-sanitized, detached
                template. The DOM inserted into each band is identical,
                attribute for attribute.

                NOTE ON OWNERSHIP: contentHost holds this component's own
                React children. Cloning it copies nothing but our own
                subtree — no part of the host page is read, copied or
                touched.
            */const buildTemplate=()=>{const copy=contentHost.cloneNode(true);copy.removeAttribute("style");copy.style.width="100%";// Marks the root of a clone subtree, and is the anchor
// the index path below is measured from: this node is
// the structural twin of contentHost.
copy.dataset.cubebendClone="";sanitize(copy);return copy;};const cloneInto=(targets,template)=>{for(const el of targets){if(!el)continue;el.replaceChildren(template.cloneNode(true));}};const refreshClones=()=>{const template=buildTemplate();cloneInto(topClones.current,template);cloneInto(botClones.current,template);};refreshClones();/* ────────────────────────────────────────────────────────────
               INTERACTION INSIDE THE FOLD BANDS

               The real content is clipped to the flat middle, so a fold
               band shows nothing but a decorative clone. THREE separate
               things made that strip dead to the mouse, and all three have
               to go or the band stays dead:

                 1. the clones were `inert`, which removes a subtree from
                    hit-testing entirely;
                 2. the scrollport is `inset: 0` and paints ABOVE the fold
                    chains, so it swallows everything over a band;
                 3. each chain ROOT is itself a full-box `inset: 0` layer,
                    and the bottom root is a later sibling — so making the
                    roots hit-testable just moved the problem: the bottom
                    root then covered the whole TOP band.

               Hence: the roots stay `pointer-events: none` forever, and
               only the band windows — the clipped strips that actually
               paint — are switched on, together with clipping the
               scrollport back to the flat middle it paints in. The clip
               inset matches the existing content clip exactly, so nothing
               moves visually, including the 1px hinge overlap.

               With that, everything in a band is native: hover, cursor,
               and drag-selection of the real text on screen. Only
               activation is synthetic — a clone is a copy, so its own
               anchors must never navigate. Clicks are cancelled on the
               clone and replayed on the real twin, located by child-index
               path (the clone is an exact structural copy of contentHost,
               so the path is stable).

               Wheel is forwarded by hand, because the chains are siblings
               of the scrollport rather than children.

               Touch never throws the switch, so touch scrolling stays
               fully native; taps are routed by probing instead.
               ──────────────────────────────────────────────────────────── */const MIDDLE_CLIP=`inset(${clipTop}px 0px ${clipBot}px 0px)`;let chainsLive=false;const setChainsLive=on=>{if(chainsLive===on)return;chainsLive=on;for(const w of bandWindows()){if(w)w.style.pointerEvents=on?"auto":"none";}scroller.style.clipPath=on?MIDDLE_CLIP:"";};disposers.push(()=>{scroller.style.clipPath="";});const inBand=(y,h)=>foldTop&&y<Z||foldBottom&&y>h-Z;const cloneRootOf=el=>{for(let n=el;n;n=n.parentElement){if(n.dataset?.cubebendClone!==undefined){return n;}}return null;};/*
                Used for touch taps, where the switch is never thrown: turn
                it on for the duration of one hit-test and back off.

                `elementFromPoint` is a READ of the document — it inspects
                what is under a coordinate and mutates nothing. It is the
                only document-level call left in this component apart from
                `getSelection`, which is likewise read-only.
            */const probeClone=(x,y)=>{const wasLive=chainsLive;if(!wasLive)setChainsLive(true);let hit=null;try{hit=document.elementFromPoint(x,y);}finally{if(!wasLive)setChainsLive(false);}return cloneRootOf(hit)&&hit instanceof HTMLElement?hit:null;};const realTwinOf=cloneEl=>{const path=[];let n=cloneEl;while(n.dataset?.cubebendClone===undefined){const p=n.parentElement;if(!p)return null;path.push(Array.prototype.indexOf.call(p.children,n));n=p;}let real=contentHost;for(let i=path.length-1;i>=0;i--){const next=real.children[path[i]];if(!next)return null;real=next;}/*
                    The index path is only meaningful while the clone is
                    still a structural twin. Clone refreshes are debounced
                    250ms and deferred further during scroll and selection,
                    so the real content CAN change shape underneath a stale
                    clone. A missing index was already caught above; a
                    DIFFERENT element occupying the same index was not, and
                    would have dispatched a click on an unrelated node.
                    Tag agreement is a cheap, sufficient sanity check —
                    when it fails we do nothing, which is always safe.
                */return real instanceof HTMLElement&&real!==contentHost&&real.tagName===cloneEl.tagName?real:null;};const selectionInClone=()=>{const sel=document.getSelection();if(!sel||sel.isCollapsed||sel.rangeCount===0)return false;const anchor=sel.anchorNode instanceof Element?sel.anchorNode:sel.anchorNode?.parentElement??null;return!!cloneRootOf(anchor);};/*
                RE-ENTRANCY LATCH.

                The replayed click is dispatched on the real twin, which
                lives inside the scrollport — so it bubbles straight into
                `onScrollerClick`, which re-tests the same coordinates,
                finds the same clone under them and calls back in here.
                Nothing changes between iterations and dispatchEvent is
                synchronous, so that is unbounded STACK recursion, not a
                loop. `onScrollerClick` also ignores untrusted events,
                which closes that specific path precisely; this latch
                closes the general case — any handler in the connected
                content that re-dispatches into a clone.
            */let activating=false;const activateTwin=(cloneEl,x,y)=>{if(activating)return;const real=realTwinOf(cloneEl);if(!real)return;const focusTarget=real.closest(FOCUSABLE);if(focusTarget instanceof HTMLElement){focusTarget.focus({preventScroll:true});}activating=true;try{real.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,view:window,clientX:x,clientY:y}));}finally{activating=false;}};/*
                Capture phase on the chain root. The root has
                pointer-events:none, but that only stops it being a hit
                TARGET — events from the live band windows inside it still
                propagate through, so this is a valid place to intercept.
            */const onCloneClick=ev=>{const t=ev.target;if(!(t instanceof HTMLElement))return;if(!cloneRootOf(t))return;ev.preventDefault();ev.stopPropagation();// The tail of a drag-select is not an activation.
if(selectionInClone())return;activateTwin(t,ev.clientX,ev.clientY);};const onCloneWheel=ev=>{/*
                    deltaY is only in pixels when deltaMode is
                    DOM_DELTA_PIXEL. Firefox and several Windows mouse
                    configurations report DOM_DELTA_LINE, where deltaY is
                    ~3 — so forwarding it raw scrolled the content about
                    three pixels per notch and the band read as dead.
                    Chrome and Safari take the first branch unchanged.
                */const px=ev.deltaMode===1?ev.deltaY*16:ev.deltaMode===2?ev.deltaY*scroller.clientHeight:ev.deltaY;scroller.scrollTop+=px;onWheel(ev);};// Touch taps: the switch stays off for the whole gesture so
// scrolling is untouched, so the tap is routed by probing.
const onScrollerClick=ev=>{// Only real user taps are routed. Our own replayed click
// bubbles through here at the same coordinates, and would
// otherwise be re-routed into the clone it came from.
if(!ev.isTrusted)return;const r=overlay.getBoundingClientRect();if(!inBand(ev.clientY-r.top,r.height))return;const cloneEl=probeClone(ev.clientX,ev.clientY);if(!cloneEl)return;ev.preventDefault();ev.stopPropagation();activateTwin(cloneEl,ev.clientX,ev.clientY);};for(const c of chainRoots()){if(!c)continue;c.addEventListener("click",onCloneClick,true);c.addEventListener("wheel",onCloneWheel,{passive:true});disposers.push(()=>{c.removeEventListener("click",onCloneClick,true);c.removeEventListener("wheel",onCloneWheel);});}scroller.addEventListener("click",onScrollerClick);disposers.push(()=>scroller.removeEventListener("click",onScrollerClick));let scrolling=false;let scrollIdle=0;let cloneTimer=0;let cloneDirty=false;disposers.push(()=>{clearTimeout(scrollIdle);clearTimeout(cloneTimer);});const runRefresh=()=>{cloneTimer=0;// Re-cloning throws away the DOM a live selection points
// into, so never do it mid-selection or mid-scroll.
if(scrolling||selectionInClone()){cloneTimer=window.setTimeout(runRefresh,200);return;}if(!cloneDirty)return;cloneDirty=false;refreshClones();relayout();};const scheduleRefresh=()=>{cloneDirty=true;if(cloneTimer)return;cloneTimer=window.setTimeout(runRefresh,250);};const mo=new MutationObserver(scheduleRefresh);mo.observe(contentHost,{childList:true,subtree:true,characterData:true,attributes:true,/*
                    ALLOWLIST, and note what is NOT on it: `style`.

                    Framer and Motion write inline `style` on animated nodes
                    every single frame — appear effects, scroll transforms,
                    springs, marquees, hover states. With an unfiltered
                    `attributes: true` every one of those marked the clones
                    dirty, so on any content with a running animation this
                    observer re-cloned everything, once per band, every
                    250ms, forever. The debounce and the `scrolling` guard
                    kept it off the scroll frame but not off the CPU.

                    These are the attributes that actually change what a
                    decorative clone SHOWS. Structural changes (childList)
                    and text changes (characterData) are unaffected, so
                    every refresh that mattered before still happens.
                */attributeFilter:["src","srcset","href","alt","class","hidden","aria-hidden","open","value"]});disposers.push(()=>mo.disconnect());const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;const sign=direction==="out"?1:-1;const maxAngle=Math.max(1,Math.min(angle,160));const e=Math.max(ease,1);const ramp=v=>{const x=Math.min(Math.max(v/e,0),1);return x*x*(3-2*x);};/*
                The single source of truth for "where are we scrolled to".

                It is CLAMPED. During a hard flick the browser's elastic
                overscroll drives scrollTop below 0 at the top and past the
                maximum at the bottom. Feeding those out-of-range values
                into the transforms pushed the flat content clear of its
                clip box — that is the black band that flashed across the
                hinge — while `position: sticky` stopped pinning at the same
                moment (it cannot travel past its container), so the section
                visibly jumped. Both ends are exactly where the elastic
                range lives, which is why only the top and bottom broke.
            */const maxScroll=()=>Math.max(0,scroller.scrollHeight-scroller.clientHeight);const readScroll=()=>{const max=maxScroll();return Math.min(Math.max(scroller.scrollTop,0),max);};const syncTargets=(t=readScroll())=>{const max=maxScroll();const l=live.current;l.topT=max>1&&foldTop?ramp(t):0;l.botT=max>1&&foldBottom?ramp(max-t):0;};let raf=0;let running=true;disposers.push(()=>{running=false;cancelAnimationFrame(raf);});const frame=now=>{if(!running)return;const l=live.current;const dt=Math.min((now-(l.last||now))/1e3,1/30);l.last=now;/*
                    Read position and derive the fold targets from it in the
                    SAME frame that draws them. Previously the targets were
                    computed only inside the scroll listener; the browser
                    coalesces scroll events under fast input and delivers
                    them out of phase with rAF, so the bend angle was drawn
                    against a scroll position it no longer matched.
                */const rawSt=readScroll();syncTargets(rawSt);const tau=Math.max(smoothing,0);const k=reduced||tau<=0?1:1-Math.exp(-dt/Math.max(tau,1e-4));l.topC+=(l.topT-l.topC)*k;l.botC+=(l.botT-l.botC)*k;if(Math.abs(l.topT-l.topC)<.001)l.topC=l.topT;if(Math.abs(l.botT-l.botC)<.001)l.botC=l.botT;l.over*=Math.exp(-dt/.22);if(Math.abs(l.over)<.5)l.over=0;const phiT=reduced||tumble<=0?0:Math.tanh(l.over/500)*23*Math.min(tumble,1);l.phi+=(phiT-l.phi)*Math.min(dt/.09,1);if(phiT===0&&Math.abs(l.phi)<.01)l.phi=0;const kT=Math.min(dt/.15,1);l.tiltXC+=(l.tiltXT-l.tiltXC)*kT;l.tiltYC+=(l.tiltYT-l.tiltYC)*kT;/*
                    SNAP TO TARGET — the same epsilon the fold smoother
                    above already applies to topC/botC, and for the same
                    reason. An exponential approach never actually
                    ARRIVES: `x += (0 - x) * 0.111` leaves x at 2.3e-16
                    after five seconds and still non-zero after 200k
                    frames. Every one of those frames produced a
                    different transform string, so the tilt layer was
                    invalidated ~6300 times after a single mouse
                    movement, then written on every frame forever after.

                    The epsilon is 0.0001 against a multiplier of
                    4 * amp (max 4), so the largest angle this can
                    discard is 0.0004deg — 400x tighter, in visual
                    terms, than the 0.001-on-160deg snap the fold has
                    used all along. Nothing observable changes.
                */if(Math.abs(l.tiltXT-l.tiltXC)<1e-4)l.tiltXC=l.tiltXT;if(Math.abs(l.tiltYT-l.tiltYC)<1e-4)l.tiltYC=l.tiltYT;/*
                    ONE scroll value drives the flat content AND every fold
                    clone, in the same frame. Previously the flat middle
                    scrolled natively on the compositor thread while the
                    clones were positioned here on the main thread; the two
                    ran out of step, so during scrolling the folds trailed
                    the flat content and the image tore at the hinge.
                */const dpr=window.devicePixelRatio||1;const st=Math.round(rawSt*dpr)/dpr;const H=overlay.clientHeight;// skip all DOM writes when nothing actually moved
const moved2=st!==l.lastSt||l.topC!==l.lastTop||l.botC!==l.lastBot;if(moved2){l.lastSt=st;l.lastTop=l.topC;l.lastBot=l.botC;mover.style.transform=`translate3d(0, ${-(st+clipTop)}px, 0)`;const thTop=maxAngle*l.topC;for(let i=0;i<bands.length;i++){const hinge=topHinges.current[i];const clone=topClones.current[i];if(hinge&&bands[i].share)hinge.style.transform=`rotateX(${sign*thTop*bands[i].share}deg)`;if(clone)clone.style.transform=`translate3d(0, ${-(st+Z-cums[i])}px, 0)`;}const thBot=maxAngle*l.botC;for(let i=0;i<bands.length;i++){const hinge=botHinges.current[i];const clone=botClones.current[i];if(hinge&&bands[i].share)hinge.style.transform=`rotateX(${-sign*thBot*bands[i].share}deg)`;const prev=i===0?0:cums[i-1];if(clone)clone.style.transform=`translate3d(0, ${-(st+H-Z+prev)}px, 0)`;}}if(tumbleRef.current){if(l.phi!==0){const overBottom=l.over>0;tumbleRef.current.style.transformOrigin=overBottom?"50% 100%":"50% 0%";tumbleRef.current.style.transform=`rotateX(${overBottom?sign*l.phi:-sign*l.phi}deg)`;}else if(tumbleRef.current.style.transform!=="none"){tumbleRef.current.style.transform="none";}}/*
                    Gated exactly like the `moved2` block above, which
                    has always skipped the fold writes when nothing
                    moved. This layer was the omission: it is the
                    preserve-3d ancestor of BOTH fold chains, so
                    rewriting its transform re-resolves the 3D rendering
                    context containing every band and every clone — the
                    single most expensive write in the loop, and the one
                    that was never skipped.

                    Comparing the two numbers rather than the built
                    string also means the template literal is not
                    allocated at all at rest, removing ~120 short-lived
                    strings per second per instance from the nursery.
                */if(tiltRef.current&&(l.tiltXC!==l.lastTiltX||l.tiltYC!==l.lastTiltY)){l.lastTiltX=l.tiltXC;l.lastTiltY=l.tiltYC;const amp=reduced?0:Math.min(Math.max(tilt,0),1);tiltRef.current.style.transform=amp>0?`rotateX(${l.tiltYC*4*amp}deg) rotateY(${l.tiltXC*4*amp}deg)`:"none";}raf=requestAnimationFrame(frame);};/*
                The scroll listener no longer positions anything — the rAF
                loop reads the scroller directly. All it does is mark the
                content as actively scrolling so clone refreshes stay
                deferred.
            */const onScroll=()=>{scrolling=true;clearTimeout(scrollIdle);scrollIdle=window.setTimeout(()=>{scrolling=false;},140);};function onWheel(ev){if(tumble<=0||reduced)return;const max=maxScroll();if(max<=1)return;const st=readScroll();const l=live.current;if(ev.deltaY>0&&st>=max-1)l.over=Math.min(l.over+ev.deltaY,900);else if(ev.deltaY<0&&st<=1)l.over=Math.max(l.over+ev.deltaY,-900);}const onMove=ev=>{if(!ev.isPrimary)return;const r=overlay.getBoundingClientRect();if(r.width===0||r.height===0)return;const l=live.current;l.tiltXT=-((ev.clientX-r.left)/r.width-.5);l.tiltYT=.5-(ev.clientY-r.top)/r.height;/*
                    Hand the fold bands to the clones whenever the mouse is
                    over one, and take them back otherwise. Never switch
                    mid-drag (ev.buttons), or a selection started in a band
                    would lose its target halfway through.
                */if(ev.pointerType!=="mouse"||ev.buttons!==0)return;setChainsLive(inBand(ev.clientY-r.top,r.height));};const onLeave=()=>{live.current.tiltXT=0;live.current.tiltYT=0;setChainsLive(false);};syncTargets();scroller.addEventListener("scroll",onScroll,{passive:true});scroller.addEventListener("wheel",onWheel,{passive:true});overlay.addEventListener("pointermove",onMove,{passive:true});overlay.addEventListener("pointerleave",onLeave);disposers.push(()=>{scroller.removeEventListener("scroll",onScroll);scroller.removeEventListener("wheel",onWheel);overlay.removeEventListener("pointermove",onMove);overlay.removeEventListener("pointerleave",onLeave);});let roScheduled=false;const ro=new ResizeObserver(()=>{if(roScheduled)return;roScheduled=true;requestAnimationFrame(()=>{roScheduled=false;relayout();syncTargets();});});ro.observe(overlay);ro.observe(contentHost);disposers.push(()=>ro.disconnect());disposers.push(()=>{mover.style.transform="";});raf=requestAnimationFrame(frame);return disposeAll;}catch(err){/*
                Nothing outside this component's subtree was ever touched,
                so there is no page state to repair — only our own
                disposables to release. Logged rather than swallowed: a
                silent no-op here would be undebuggable for the customer.
            */console.error("[CubeBend] Setup failed — the fold effect is disabled for this instance.",err);disposeAll();return;}},[isStatic,bands,cums,Z,clipTop,clipBot,angle,direction,ease,smoothing,foldTop,foldBottom,tumble,tilt]);const renderFoldChain=edge=>{const isTop=edge==="top";const hinges=isTop?topHinges:botHinges;const clones=isTop?topClones:botClones;const windows=isTop?topWindows:botWindows;let chain=null;for(let i=bands.length-1;i>=0;i--){const b=bands[i];const isRoot=i===0;chain=/*#__PURE__*/_jsxs("div",{ref:el=>{hinges.current[i]=el;},style:{position:"absolute",left:0,right:0,height:b.h,...isRoot?isTop?{top:Z-b.h}:{top:`calc(100% - ${Z}px)`}:isTop?{top:-b.h}:{bottom:-b.h},transformOrigin:isTop?"50% 100%":"50% 0%",transformStyle:"preserve-3d",backfaceVisibility:"hidden"},children:[/*#__PURE__*/_jsx("div",{ref:el=>{windows.current[i]=el;},style:{position:"absolute",top:isTop?-1:0,bottom:isTop?0:-1,left:0,right:0,overflow:"hidden",background:BACKDROP,pointerEvents:"none"},children:/*#__PURE__*/_jsx("div",{ref:el=>{clones.current[i]=el;},"aria-hidden":true,style:{position:"absolute",top:isTop?1:0,left:0,width:"100%",backfaceVisibility:"hidden"}})}),chain]},i);}return /*#__PURE__*/_jsx("div",{ref:isTop?topChainRef:botChainRef,"aria-hidden":true,style:{position:"absolute",inset:0,/* NEVER switched on. This root spans the whole
                       component box, and the bottom edge's root is a
                       later sibling — a hit-testable root would blanket
                       the opposite band and swallow everything. Only the
                       band windows inside it go live. Events from
                       those windows still propagate through here, so
                       the click interceptor lives on this node. */pointerEvents:"none",transformStyle:"preserve-3d",/* Each fold owns its perspective, centred on ITS OWN
                       hinge. A shared ancestor perspective (box centre)
                       views these edge folds far off-axis and the outer
                       bands project back down over the inner ones,
                       duplicating content. */perspective:P,perspectiveOrigin:isTop?`50% ${Z}px`:`50% calc(100% - ${Z}px)`},children:chain});};/*
        The component's own box. `style` comes from Framer and carries
        the layer's size and position; we keep whatever positioning
        Framer chose (falling back to `relative`, since every layer
        inside is absolutely positioned against this node) and add only
        clipping, backdrop and the z-index the user asked for.

        This is an ordinary layer in the page. It is not fixed, it does
        not cover the viewport, and it claims nothing outside itself.
    */const rootStyle={...style,position:style&&style.position||"relative",overflow:"hidden",background:BACKDROP,zIndex};/*
        STATIC FALLBACK — canvas, thumbnail, export, SSR.

        Deliberately renders the REAL connected content, unfolded, rather
        than a placeholder graphic: designers see their actual section
        while arranging it, thumbnails and exports show the real thing,
        and the server-rendered HTML is a readable page that progressively
        enhances into the fold once the bundle runs. Nothing here starts a
        loop, an observer, a listener or a timer.
    */if(isStatic){const empty=!content||content.length===0;return /*#__PURE__*/_jsxs("div",{style:rootStyle,children:[/*#__PURE__*/_jsx("div",{style:{width:"100%"},children:content}),empty&&isCanvas&&/*#__PURE__*/_jsxs("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 8px, transparent 8px 16px), rgb(20,20,20)",color:"rgba(255,255,255,0.9)",fontFamily:"Inter, system-ui, -apple-system, Segoe UI, sans-serif",fontSize:12,letterSpacing:"0.06em",textTransform:"uppercase",textAlign:"center",lineHeight:1.5,border:"1px dashed rgba(255,255,255,0.25)"},children:["Cube Bend",/*#__PURE__*/_jsx("br",{}),/*#__PURE__*/_jsx("span",{style:{opacity:.6,letterSpacing:"0.02em",textTransform:"none"},children:"Connect your content — folds in preview & publish"})]})]});}return /*#__PURE__*/_jsx("div",{ref:overlayRef,style:rootStyle,children:/*#__PURE__*/_jsx("div",{ref:tumbleRef,style:{position:"absolute",inset:0,transformStyle:"preserve-3d",willChange:"transform"},children:/*#__PURE__*/_jsxs("div",{ref:tiltRef,style:{position:"absolute",inset:0,transformStyle:"preserve-3d",willChange:"transform"},children:[foldTop&&renderFoldChain("top"),foldBottom&&renderFoldChain("bottom"),/*#__PURE__*/_jsxs("div",{ref:scrollRef,/* This scrollport must be focusable or arrow
                           keys, Space and PageDown do nothing at all for
                           a keyboard-only visitor once focus is inside
                           the component.

                           role + label are the AT half of that same fix:
                           a bare focusable <div> is an unnamed stop that
                           a screen reader announces as nothing. An
                           UNLABELLED region is dropped from the landmark
                           tree, so the label is required alongside it. */tabIndex:0,role:"region","aria-label":props.label||"Scrollable content",style:{position:"absolute",inset:0,overflowY:"auto",overflowX:"hidden",outline:"none",/* Kills the elastic overscroll range at both
                               ends. Without it a hard flick drives
                               scrollTop out of bounds, `sticky` unpins
                               mid-gesture and the fold tears — the
                               reason this only ever broke at the very
                               top and the very bottom. It also stops the
                               gesture chaining out to the page, which is
                               what replaces the old global scroll lock:
                               scoped to THIS element, never to the
                               document. */overscrollBehavior:"auto",WebkitOverflowScrolling:"touch",// `as const` on both arms: CSSProperties types
// scrollbarWidth as a literal union, and a bare
// ternary widens to `string`, which does not
// type-check.
scrollbarWidth:showScrollbar?"auto":"none"},className:showScrollbar?undefined:"cubebend-noscrollbar",children:[/*#__PURE__*/_jsx("style",{children:`.cubebend-noscrollbar::-webkit-scrollbar{display:none}`}),/*#__PURE__*/_jsx("div",{ref:spacerRef,style:{width:"100%"},children:/*#__PURE__*/_jsx("div",{ref:stickyRef,style:{position:"sticky",top:0,width:"100%"},children:/*#__PURE__*/_jsx("div",{style:{position:"absolute",top:clipTop,bottom:clipBot,left:0,right:0,overflow:"hidden"},children:/*#__PURE__*/_jsx("div",{ref:moverRef,style:{position:"absolute",top:0,left:0,width:"100%",willChange:"transform"},children:/*#__PURE__*/_jsx("div",{ref:contentRef,style:{width:"100%"},children:content})})})})})]})]})})});}addPropertyControls(CubeBend,{// The content that scrolls and folds. This replaces the old
// automatic page adoption: the component is handed its content
// instead of reaching outside itself to take it.
content:{type:ControlType.ComponentInstance,title:"Content"},zone:{type:ControlType.Number,title:"Fold Zone",min:40,max:600,step:10,defaultValue:220,unit:"px"},angle:{type:ControlType.Number,title:"Angle",min:5,max:160,step:1,defaultValue:80,unit:"\xb0"},rounding:{type:ControlType.Number,title:"Rounding",min:0,max:600,step:10,defaultValue:150,unit:"px"},segments:{type:ControlType.Number,title:"Smooth Steps",min:1,max:8,step:1,defaultValue:4},perspective:{type:ControlType.Number,title:"Perspective",min:200,max:3e3,step:50,defaultValue:900,unit:"px"},direction:{type:ControlType.Enum,title:"Direction",options:["out","in"],optionTitles:["Fold Out","Fold In"],defaultValue:"out",displaySegmentedControl:true},ease:{type:ControlType.Number,title:"Ease Distance",min:40,max:1200,step:20,defaultValue:240,unit:"px"},smoothing:{type:ControlType.Number,title:"Smoothing",min:0,max:.6,step:.02,defaultValue:.1},foldTop:{type:ControlType.Boolean,title:"Top Edge",defaultValue:true},foldBottom:{type:ControlType.Boolean,title:"Bottom Edge",defaultValue:true},tumble:{type:ControlType.Number,title:"Tumble",min:0,max:1,step:.05,defaultValue:.5},tilt:{type:ControlType.Number,title:"Tilt",min:0,max:1,step:.05,defaultValue:.35},showScrollbar:{type:ControlType.Boolean,title:"Scrollbar",defaultValue:false},// Last control in the panel — its description carries the credit line,
// so the link renders at the bottom without adding a dummy input row.
zIndex:{type:ControlType.Number,title:"Z Index",min:1,max:9999999,step:1,defaultValue:999999,description:"Get more components from [Framerstacks](https://www.framerstacks.com/)"}});
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"CubeBend","slots":[],"annotations":{"framerContractVersion":"1","framerDisableUnlink":"which is why Unlink stayed available on"}},"__FramerMetadata__":{"type":"variable"}}}
