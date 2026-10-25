import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import { readFile } from 'node:fs/promises'

const dom = new JSDOM('<!doctype html><html><body><main id="host"></main></body></html>', { url: 'http://localhost/about', pretendToBeVisual: true })
for (const key of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'SVGElement', 'Event']) globalThis[key] = dom.window[key]
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window)
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window)
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window)
let reduced = false, scroll = 0, progress = 0
const viewport = window.innerHeight
Object.defineProperty(window, 'pageYOffset', { get: () => scroll })
window.scrollTo = (_x, y) => { scroll = y || 0 }
window.matchMedia = query => ({ matches: query.includes('no-preference') ? !reduced : reduced, media: query, addListener() {}, removeListener() {} })
globalThis.matchMedia = window.matchMedia
const server = await createServer({ server: { middlewareMode: true, hmr: false, open: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, entries: [] } })
const { mountResearchTunnel } = await server.ssrLoadModule('/src/utils/researchTunnelMotion.js')
const { gsap } = await import('gsap')
const host = document.getElementById('host')
host.innerHTML = '<section class="research-tunnel"><div class="research-tunnel-stage"><div class="research-tunnel-copy">Research without boundaries</div><div class="research-frontiers">' + ['AI', 'Quantum', 'Manufacturing', 'Health'].map(title => `<article class="research-frontier"><h3>${title}</h3><a href="/tracks">Explore</a></article>`).join('') + '</div></div></section><section id="after">Normal website content</section>'
const scene = host.firstElementChild, cards = [...scene.querySelectorAll('.research-frontier')]
scene.getBoundingClientRect = () => ({ top: 1200 - scroll, bottom: 1200 + viewport * 5.6 - scroll, left: 0, right: 1200, width: 1200, height: viewport * 5.6 })
const wait = () => new Promise(resolve => setTimeout(resolve, 100))
let ScrollTrigger, release
try {
  release = mountResearchTunnel(scene, { set: value => { progress = value } })
  ScrollTrigger = gsap.core.globals().ScrollTrigger
  await wait(); ScrollTrigger.refresh()
  const trigger = ScrollTrigger.getAll().find(item => item.trigger === scene)
  assert(trigger?.animation, 'The tunnel has a scroll-linked sequence')
  assert.equal(trigger.start, 1200)
  assert(Math.abs(trigger.end - (1200 + viewport * 4.6)) < 1, 'The sequence ends at the bottom of its finite sticky range')
  assert(!trigger.pin && !host.querySelector('.pin-spacer'), 'Native sticky needs no generated pin spacers')
  const timeline = trigger.animation
  timeline.time(0)
  assert(cards.every(card => Number(gsap.getProperty(card, 'opacity')) === 0))
  assert.equal(progress, 0)
  for (let index = 0; index < cards.length; index++) {
    timeline.time(.7 + index * 1.35 + .85)
    assert.equal(Number(gsap.getProperty(cards[index], 'opacity')), 1, `Frontier ${index + 1} reaches its readable hold`)
    assert.equal(Number(gsap.getProperty(cards[index], 'z')), 0)
    assert.equal(cards[index].inert, false)
    assert.equal(cards.filter(card => !card.inert).length, 1, 'Only the current frontier has focusable links')
    assert(progress > 0 && progress < 1, 'The background receives the same finite progress')
  }
  timeline.time(.7 + .25)
  assert(Number(gsap.getProperty(cards[0], 'z')) < 0, 'Frontiers approach from behind the screen')
  timeline.time(.7 + .85)
  assert.equal(cards[0].inert, false, 'Reverse scrolling restores the first frontier')
  window.scrollTo(0, trigger.end + viewport / 2)
  window.dispatchEvent(new Event('scroll')); await wait(); ScrollTrigger.update()
  trigger.getTween()?.progress(1)
  assert.equal(trigger.isActive, false, 'Normal page scrolling resumes after the last frontier')
  assert.equal(progress, 1)
  assert.equal(Number(gsap.getProperty(cards[3], 'opacity')), 1, 'Last frontier stays visible during release')
  assert.notEqual(document.body.style.overflow, 'hidden', 'The sequence never locks page scrolling')
  assert.equal(document.getElementById('after').textContent, 'Normal website content')
  release(); release = null
  assert(!scene.classList.contains('is-sequenced'))
  assert(cards.every(card => !card.style.transform && !card.hasAttribute('aria-hidden') && !card.inert), 'Cleanup restores all content to normal flow')
  assert.equal(ScrollTrigger.getAll().length, 0)
  reduced = true
  release = mountResearchTunnel(scene, { set: value => { progress = value } })
  assert.equal(ScrollTrigger.getAll().length, 0, 'Reduced motion renders all four frontiers without a pinned sequence')
  assert(!scene.classList.contains('is-sequenced'))
  const css = await readFile(new URL('../src/styles/summit-redesign.css', import.meta.url), 'utf8')
  assert(css.includes('.research-tunnel.is-sequenced .research-tunnel-stage { position:sticky; top:0; height:100svh;'), 'The stage fills the viewport while sticky')
  console.log('PASS: full-screen finite sequence, four ordered depth reveals, background synchronization, reverse scroll, normal-scroll release, cleanup and reduced motion')
} finally {
  release?.()
  ScrollTrigger?.getAll().forEach(trigger => trigger.kill())
  await server.close()
  dom.window.close()
}
process.exit(0)
