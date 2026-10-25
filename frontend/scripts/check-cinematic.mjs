import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

const dom = new JSDOM('<!doctype html><html><body><main id="host"><section class="page-intro"><div class="ambient"></div><div class="intro-inner"><h1>Ideas into impact.</h1><p>Existing copy stays intact.</p></div></section><button class="fancy-button"><span>Existing action</span></button></main></body></html>', {url:'http://localhost/',pretendToBeVisual:true})
for (const key of ['window','document','HTMLElement','Element','Node','SVGElement','Event','MouseEvent']) globalThis[key]=dom.window[key]
globalThis.getComputedStyle=dom.window.getComputedStyle.bind(dom.window)
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true})
globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window)
globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window)
globalThis.ResizeObserver=class{observe(){} disconnect(){}}
window.scrollTo=()=>{}
let reduced=false, fine=true, width=1280
window.matchMedia=query=>({get matches(){return query==='all' || query.split(' and ').every(part=>{
  if(part.includes('prefers-reduced-motion'))return part.includes('no-preference')?!reduced:reduced
  if(part.includes('min-width'))return width>=Number(part.match(/\d+/)[0])
  if(part.includes('max-width'))return width<=Number(part.match(/\d+/)[0])
  return fine
})},media:query,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}})
globalThis.matchMedia=window.matchMedia
const server=await createServer({server:{middlewareMode:true,hmr:false,open:false},appType:'custom',optimizeDeps:{noDiscovery:true,entries:[]}})
const {mountCinematicMotion,mountPointerDepth}=await server.ssrLoadModule('/src/utils/cinematicMotion.js')
const host=document.getElementById('host'), button=host.querySelector('button'), art=host.querySelector('.ambient')
const journey=document.createElement('section')
journey.className='impact-journey'
journey.innerHTML='<div class="impact-art"><div class="reactor-art"></div></div><div class="impact-content"><h2>Six steps forward.</h2></div>'
host.append(journey)
const content=host.textContent, elements=host.querySelectorAll('*').length
button.getBoundingClientRect=()=>({left:0,top:0,width:200,height:60,right:200,bottom:60})
const wait=()=>new Promise(resolve=>setTimeout(resolve,80))
try{
  const release=mountCinematicMotion(host)
  await wait()
  assert(art.style.transform.includes('scale'), 'Hero art receives its independent depth transform')
  assert(journey.querySelector('.reactor-art').style.transform, 'About reactor receives a scroll-controlled entrance')
  assert(journey.querySelector('.impact-content').style.transform, 'About content has a coordinated entrance')
  assert.equal(host.textContent,content,'Cinematic layer preserves every text node')
  assert.equal(host.querySelectorAll('*').length,elements,'Cinematic layer adds no layout wrappers or sections')
  release()
  assert(!art.style.transform,'Route cleanup restores background transform')
  assert(!host.querySelector('h1').style.clipPath,'Route cleanup restores the title mask')
  assert(!journey.querySelector('.reactor-art').style.transform,'About sequence cleans up on route changes')
  const unbind=mountPointerDepth(host)
  button.dispatchEvent(new MouseEvent('pointermove',{bubbles:true,clientX:180,clientY:50}))
  await wait()
  assert(button.style.getPropertyValue('--pointer-x'),'Fine-pointer movement produces subtle feedback')
  host.dispatchEvent(new Event('pointerleave'))
  assert.equal(button.style.getPropertyValue('--pointer-x'),'','Leaving restores the resting appearance')
  fine=false
  button.dispatchEvent(new MouseEvent('pointermove',{bubbles:true,clientX:180,clientY:50}))
  await wait()
  assert.equal(button.style.getPropertyValue('--pointer-x'),'','Touch devices do not tilt or move controls')
  unbind()
  reduced=true; width=390
  const releaseReduced=mountCinematicMotion(host)
  await wait()
  assert(!art.style.transform,'Reduced motion leaves the background static')
  assert(!host.querySelector('h1').style.clipPath,'Reduced motion leaves text unmasked')
  releaseReduced()
  console.log('PASS: hero depth, unchanged DOM/content, cleanup, fine-pointer feedback, touch and reduced-motion fallbacks')
}finally{
  await Promise.race([server.close(),new Promise(resolve=>setTimeout(resolve,2000))])
  dom.window.close()
}
process.exit(0)
