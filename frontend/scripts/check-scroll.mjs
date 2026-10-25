import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import { revealFrame } from '../src/utils/scrollReveal.js'

const hidden = revealFrame(1100, 1000)
const entering = revealFrame(720, 1000)
const revealed = revealFrame(400, 1000)
assert.equal(hidden.opacity, 0)
assert.equal(revealed.opacity, 1)
assert.equal(revealed.y, 0)
assert(entering.y < hidden.y && entering.y > revealed.y)
assert(revealFrame(720, 1000, 3).progress < entering.progress, 'Same-row content is staggered')
assert.deepEqual(revealFrame(720, 1000), entering, 'Scroll direction does not change the frame at a given position')
assert.equal(revealFrame(-3000, 1000).scale, 1, 'Long content remains visible after entry')
console.log('PASS: reveal progress, stagger, reverse scroll and long-content visibility')

const reduced = process.argv.includes('--reduced')
const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', { url:'http://localhost/', pretendToBeVisual:true })
for (const key of ['window','document','HTMLElement','Element','Node','MutationObserver','SVGElement','Event']) globalThis[key] = dom.window[key]
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window)
Object.defineProperty(globalThis, 'navigator', { value:dom.window.navigator, configurable:true })
globalThis.IS_REACT_ACT_ENVIRONMENT = true
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window)
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window)
window.matchMedia = query => ({ matches:reduced && query.includes('prefers-reduced-motion'), media:query, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} })
globalThis.matchMedia = window.matchMedia
globalThis.IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} }
globalThis.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} }
let position = 0, contentHeight = 600
Object.defineProperty(window, 'innerHeight', { value:1000, configurable:true })
Object.defineProperty(window, 'innerWidth', { value:1280, configurable:true })
Object.defineProperty(window, 'scrollY', { get:()=>position })
Object.defineProperty(document, 'scrollingElement', { get:()=>document.documentElement })
Object.defineProperty(document.documentElement, 'scrollTop', { get:()=>position, set:v=>{position=v} })
Object.defineProperty(document.documentElement, 'clientHeight', { value:1000, configurable:true })
Object.defineProperty(document.documentElement, 'scrollHeight', { value:6000, configurable:true })
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { get(){return this.classList.contains('scene-surface') ? contentHeight : 200}, configurable:true })
const originalRect = Element.prototype.getBoundingClientRect
Element.prototype.getBoundingClientRect = function() {
  const origin = this.id === 'scroll-test-title' ? 900 : this.id === 'scroll-test-card' ? 1100 : null
  if (origin === null) return originalRect.call(this)
  const y = parseFloat(this.style.getPropertyValue('--scroll-y')) || 0
  const top = origin - position + y
  return {top,bottom:top+200,left:0,right:700,width:700,height:200,x:0,y:top,toJSON(){return this}}
}
const React = await import('react'), { act } = React
const { createRoot } = await import('react-dom/client')
const server = await createServer({ server:{middlewareMode:true,hmr:false}, appType:'custom', optimizeDeps:{noDiscovery:true,entries:[]} })
const { default: ScrollPage } = await server.ssrLoadModule('/src/components/ScrollPage.jsx')
const { ScrollScene } = await server.ssrLoadModule('/src/components/ScrollScene.jsx')
const { default: PageHeader } = await server.ssrLoadModule('/src/components/PageHeader.jsx')
const { MemoryRouter } = await import('react-router-dom')
const { renderToStaticMarkup } = await import('react-dom/server')
const heroMarkup=renderToStaticMarkup(React.createElement(MemoryRouter,{initialEntries:['/about']},React.createElement(PageHeader,{title:'Ideas into impact.',badge:'About SANKALP'})))
if(!reduced) assert(heroMarkup.includes('translateY(-100vh)'), 'Page hero begins above the viewport, not halfway down')
console.log('PASS: hero entrance starts outside the viewport and respects reduced motion')
const root = createRoot(document.getElementById('root'))
async function settle() { await act(async()=>{await new Promise(resolve=>setTimeout(resolve,100))}) }
async function scroll(to) { position=to; await act(async()=>{window.dispatchEvent(new Event('scroll')); await new Promise(resolve=>setTimeout(resolve,100))}) }
try {
  await act(async()=>root.render(React.createElement(ScrollPage,{route:'/scroll-test'},React.createElement('div',null,
    React.createElement('h2',{id:'scroll-test-title'},'A progressive title'),
    React.createElement('article',{id:'scroll-test-card'},'A rising card'),
    React.createElement('article',{id:'form-test-card'},React.createElement('form',null,React.createElement('h2',{id:'form-test-title'},'Contact form'),React.createElement('input',{name:'email'}))),
    React.createElement('div',{role:'dialog'},React.createElement('article',{id:'modal-test-card'},'Always readable')),
    React.createElement(ScrollScene,{name:'fit-test'},React.createElement('p',null,'A full-screen scene'))
  ))))
  await settle()
  const card=document.getElementById('scroll-test-card'), scene=document.querySelector('[data-scene="fit-test"]')
  assert(!document.getElementById('modal-test-card').classList.contains('scroll-unit'), 'Dialogs are excluded from scroll hiding')
  assert(!document.getElementById('form-test-card').classList.contains('scroll-unit'), 'Form panels stay in normal flow')
  assert(!document.getElementById('form-test-title').classList.contains('scroll-unit'), 'Form headings cannot drift over inputs')
  if (reduced) {
    assert(!card.classList.contains('scroll-unit'), 'Reduced motion leaves all page content visible')
    assert.equal(scene.dataset.pinned,'false')
    console.log('PASS: reduced motion disables pinning and scroll masks')
  } else {
    assert(card.classList.contains('scroll-unit'))
    assert.equal(card.style.getPropertyValue('--scroll-opacity'),'0.0000')
    assert.equal(scene.dataset.pinned,'true', 'Fitting desktop scenes can pin')
    await scroll(700)
    assert.equal(card.style.getPropertyValue('--scroll-opacity'),'1.0000')
    assert.equal(card.style.getPropertyValue('--scroll-y'),'0.00px')
    await scroll(0)
    assert.equal(card.style.getPropertyValue('--scroll-opacity'),'0.0000', 'Reverse scroll restores the unrevealed state')
    contentHeight=1300
    await act(async()=>window.dispatchEvent(new Event('resize')))
    assert.equal(scene.dataset.pinned,'false', 'Tall sections remain in normal flow')
    contentHeight=600
    Object.defineProperty(window,'innerWidth',{value:390,configurable:true})
    await act(async()=>window.dispatchEvent(new Event('resize')))
    assert.equal(scene.dataset.pinned,'false', 'Mobile sections are never pinned')
    console.log('PASS: real scroll events update and reverse reveal styles; pinning adapts to content and viewport')
  }
} finally {
  await act(async()=>root.unmount())
  await Promise.race([server.close(),new Promise(resolve=>setTimeout(resolve,2000))])
  dom.window.close()
}
process.exit(0)
