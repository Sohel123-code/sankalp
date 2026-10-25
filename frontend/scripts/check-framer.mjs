import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import { openingTarget, openingQuality } from '../src/utils/heroOpening.js'

for (const [width, height] of [[390, 690], [900, 560], [1920, 994], [3840, 2074]]) {
  const box = { left: 32, top: 86, width, height }
  assert.deepEqual(openingTarget(box, width, height, true), { x: width / 2, y: height / 2, w: width, h: height }, 'Contained reveal must not include header or side offsets')
  const quality = openingQuality(width, height, 3)
  assert(width * height * quality.dpr ** 2 <= 1500001, 'Render target stays within the pixel budget')
  assert(quality.segments <= 24, 'Opening uses a lighter subdivided mesh')
}
assert.deepEqual(openingTarget({ left: 20, top: 86, width: 900, height: 560 }, 1000, 700, false), { x: 470, y: 366, w: 900, h: 560 })
console.log('PASS: contained intro alignment and mobile/desktop/high-DPI rendering budget')

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost/', pretendToBeVisual: true })
for (const key of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'SVGElement', 'EventTarget', 'Event', 'MouseEvent', 'KeyboardEvent', 'sessionStorage']) globalThis[key] = dom.window[key]
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window)
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
globalThis.IS_REACT_ACT_ENVIRONMENT = true
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window)
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window)
window.matchMedia = query => ({ matches: false, media: query, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} })
globalThis.matchMedia = window.matchMedia
window.scrollTo = () => {}
let top = 0
Element.prototype.getBoundingClientRect = () => ({ top, left: 0, width: 900, height: 300, right: 900, bottom: top + 300 })
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { get: () => 900 })
Element.prototype.setPointerCapture = () => {}
Element.prototype.hasPointerCapture = () => false
Element.prototype.releasePointerCapture = () => {}
globalThis.IntersectionObserver = class {
  constructor(callback) { this.callback = callback; this.alive = true }
  observe(target) { queueMicrotask(() => { if (this.alive) this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }]) }) }
  unobserve() {}
  disconnect() { this.alive = false }
}
globalThis.ResizeObserver = class {
  constructor(callback) { this.callback = callback; this.alive = true }
  observe(target) { queueMicrotask(() => { if (this.alive) this.callback([{ target, contentRect: target.getBoundingClientRect() }]) }) }
  disconnect() { this.alive = false }
}
let draws = 0
const context = new Proxy({}, { get(target, key) {
  if (key in target) return target[key]
  if (key === 'measureText') return text => ({ width: String(text).length * 8 })
  if (key === 'getImageData') return (_x, _y, width, height) => ({ data: new Uint8ClampedArray(Math.floor(width) * Math.floor(height) * 4).fill(255) })
  if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop() {} })
  return () => { if (key === 'drawImage' || key === 'fill' || key === 'fillRect') draws++ }
} })
dom.window.HTMLCanvasElement.prototype.getContext = type => type === '2d' ? context : null
globalThis.Image = class {
  width = 520; height = 740; naturalWidth = 520; naturalHeight = 740
  set src(value) { this.url = value; queueMicrotask(() => this.onload?.()) }
}

const React = await import('react')
const { act } = React
const { createRoot } = await import('react-dom/client')
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, entries: [] } })
const load = async name => (await server.ssrLoadModule(`/src/components/framer/${name}`)).default
const [TextReveal, Typewriter, Dragable, Curved, Wave, LoadScreen] = await Promise.all([
  load('TextRevealHelper.js'), load('TypewriterEffect.js'), load('DragableCarousel.js'), load('CurvedCarousel.js'), load('Waveslics.js'), load('LoadScreen.jsx'),
])
const { HomeOpening, homeIntroSeen } = await server.ssrLoadModule('/src/components/FramerEnhancements.jsx')
const root = createRoot(document.getElementById('root'))
const h = React.createElement
async function settle(ms = 40) { await act(async () => { await new Promise(resolve => setTimeout(resolve, ms)) }) }
async function render(component) { await act(async () => { root.render(component) }); await settle() }
async function clear() { await render(null) }
async function event(element, value) { await act(async () => { element.dispatchEvent(value) }); await settle() }

try {
  const phrase = 'Discover together. Build what comes next.'
  top = 900
  await render(h(React.StrictMode, null, h(TextReveal, { textComponent: h('span', null, phrase), revealMode: 'words', startOffset: 90, endOffset: 30 })))
  const segments = () => [...document.querySelectorAll('#root span')].filter(el => el.style.willChange === 'opacity')
  assert.equal(segments().length, 6, 'StrictMode does not double-wrap text')
  assert(segments().every(el => +el.style.opacity === .2))
  top = -500
  await event(window, new Event('scroll'))
  assert(segments().every(el => +el.style.opacity === 1), 'Scroll reveals all words')
  top = 900
  await event(window, new Event('scroll'))
  assert(segments().every(el => +el.style.opacity === .2), 'Reverse scroll dims the words')
  assert.equal(document.getElementById('root').textContent, phrase)
  await clear()
  console.log('PASS: supplied text helper reverses with scroll and survives StrictMode')

  top = 0
  await render(h(Typewriter, { once: true, words: [{ word: 'Sankalp' }], typingSpeed: 1, deletingSpeed: 1, pauseDuration: 5, cursorWidth: 2, cursorHeight: 65 }))
  for (let i = 0; i < 12; i++) await settle(5)
  assert.equal(document.getElementById('root').textContent, 'Sankalp')
  await settle(80)
  assert.equal(document.getElementById('root').textContent, 'Sankalp', 'One-time text does not start deleting')
  await clear()
  console.log('PASS: supplied typewriter completes once and preserves its text')

  const items = ['Academic teams', 'Industry R&D', 'Startups'].map(text => h('article', { key: text }, text))
  await render(h(Dragable, { items, loop: false, autoplay: false }))
  const current = () => document.querySelector('[aria-current="true"]')?.getAttribute('aria-label')
  assert.equal(current(), 'Slide 1')
  const region = document.querySelector('[role="region"]')
  assert(document.querySelector('[aria-label="Previous slide"]').disabled)
  await event(region, new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  assert.equal(current(), 'Slide 2')
  await act(async () => document.querySelector('[aria-label="Next slide"]').click())
  assert.equal(current(), 'Slide 3')
  assert(document.querySelector('[aria-label="Next slide"]').disabled)
  await event(region, new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
  assert.equal(current(), 'Slide 1')
  const touch = (type, x, y) => {
    const e = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperty(e, 'touches', { value: [{ clientX: x, clientY: y }] })
    return e
  }
  await event(region, touch('touchstart', 100, 100))
  const vertical = touch('touchmove', 102, 160)
  await event(window, vertical)
  assert.equal(vertical.defaultPrevented, false, 'Vertical swipes stay available for page scrolling')
  assert.equal(document.querySelectorAll('article').length, 3, 'Original cards remain present exactly once')
  await clear()
  console.log('PASS: draggable carousel arrows, keyboard, boundaries, original content and vertical touch scrolling')

  draws = 0
  await render(h(Wave, { transition: 0, playing: true, slices: 24 }))
  const firstWave = draws
  await settle(80)
  assert(draws > firstWave, 'Waveslics paints changing frames')
  await clear()
  const stopped = draws
  await settle(60)
  assert.equal(draws, stopped, 'Wave animation stops after cleanup')
  await render(h(Curved, { items: [{ image: { src: '/media/frontiers/quantum.svg' }, title: '' }], decorative: true, autoplay: true, showCaptions: false, showNumbers: false }))
  await settle(80)
  assert(draws > stopped, 'CurvedCarousel paints its image atlas')
  assert.equal(document.querySelector('[role="region"]').tabIndex, -1, 'Decorative gallery cannot trap keyboard focus')
  await clear()
  console.log('PASS: wave and curved canvas rendering paths, cleanup and decorative focus handling')

  const Particle = await load('ParticleHoverCard.js')
  const Stack = await load('SwipeCardStack.js')
  const particleProps = { decorative: true, active: false, defaultImage: { src: '/media/frontiers/neural.svg' }, hoverImage: { src: '/media/frontiers/neural-hover.svg' }, content: { showTitle: false, title: '', description: '' }, motion: { duration: .25 } }
  await render(h(Particle, particleProps))
  assert.equal(document.querySelector('[data-particle-card]').dataset.state, 'default')
  assert.equal(document.querySelector('[data-particle-card]').getAttribute('aria-hidden'), 'true')
  assert.equal(document.querySelectorAll('[data-particle-card] button').length, 0, 'Decorative particle layer adds no hidden keyboard stop')
  await render(h(Particle, { ...particleProps, active: true }))
  await settle(400)
  assert.equal(document.querySelector('[data-particle-card]').dataset.state, 'hover')
  assert.equal(document.querySelector('[data-particle-card]').dataset.renderer, 'image', 'Unavailable WebGL falls back to the original image layers')
  await clear()
  let activeCard = -1
  const stackCards = ['AI workshop', 'Quantum workshop', 'Manufacturing workshop'].map(title => ({ title }))
  await render(h(Stack, { cards: stackCards, interaction: { exitDuration: .05 }, onIndexChange: value => { activeCard = value } }))
  assert.equal(activeCard, 0)
  await event(document.querySelector('[aria-label="Next card"]'), new MouseEvent('click', { bubbles: true }))
  await settle(120)
  assert.equal(activeCard, 1, 'Next updates the selected workshop')
  await event(document.querySelector('[aria-label="Previous card"]'), new MouseEvent('click', { bubbles: true }))
  await settle(120)
  assert.equal(activeCard, 0, 'Previous returns to the previous workshop')
  await event(document.querySelector('[role="group"]'), new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  await settle(120)
  assert.equal(activeCard, 1, 'Keyboard browsing keeps workshop selection synchronized')
  assert.equal(document.querySelector('[role="group"]').style.touchAction, 'pan-y', 'Vertical touch scrolling remains available')
  await clear()
  console.log('PASS: particle fallback, decorative accessibility, swipe next/previous, keyboard and touch scrolling')

  let completed = 0, revealed = 0
  sessionStorage.clear()
  await render(h(HomeOpening, { onComplete: () => completed++, onReveal: () => revealed++ }))
  await settle(200)
  assert.equal(revealed, 0, 'Particle formation must complete before showing the hero')
  assert(document.querySelector('[data-framer-effect="particle-formation"] canvas'))
  assert(document.querySelector('.home-opening img').src.endsWith('/media/sankalp-opening.svg'))
  assert.equal(document.querySelectorAll('.home-opening .framer-load-screen').length, 0, 'No curtain remains in the intro')
  const introDraws = draws
  for (let i = 0; i < 90 && !revealed; i++) await settle()
  assert(draws > introDraws, 'The supplied particle formation paints changing frames')
  assert.equal(revealed, 1, 'Hero begins revealing before opening is removed')
  assert(document.querySelector('.home-opening.is-leaving'), 'Opening crossfades into the hero')
  for (let i = 0; i < 20 && !completed; i++) await settle()
  assert.equal(completed, 1, 'Completed particle name releases the hero after the handoff')
  assert(homeIntroSeen(), 'Opening is marked seen for this tab')
  assert.notEqual(document.documentElement.style.overflow, 'hidden', 'Contained intro does not lock site navigation or scrolling')
  await act(async () => document.querySelector('.opening-skip').click())
  assert.equal(completed, 1, 'Repeated finish requests cannot replay the handoff')
  await clear()
  completed = 0; revealed = 0
  await render(h(HomeOpening, { onComplete: () => completed++, onReveal: () => revealed++ }))
  await event(window, new KeyboardEvent('keydown', { key: 'Escape' }))
  assert.equal(revealed, 1, 'Escape skips the opening without waiting for the artwork')
  await settle(650)
  assert.equal(completed, 1)
  await clear()
  await render(h(LoadScreen))
  assert.equal(document.querySelector('.framer-load-screen').children.length, 5)
  await clear()
  console.log('PASS: particle formation frames, completed name, skip, session handling, unlocked scrolling and legacy component isolation')

  const Arc = await load('ArcCarousel.js')
  let selectedTrack = 0
  function ArcHarness() {
    const [active, setActive] = React.useState(0)
    return h(Arc, { slides: ['AI', 'Quantum', 'Manufacturing', 'Health'].map(title => h('button', { key: title }, title)), activeIndex: active, onIndexChange: index => { selectedTrack = index; setActive(index) } })
  }
  await render(h(ArcHarness))
  assert.equal(document.querySelectorAll('#root button').length, 4, 'Arc carousel never duplicates real content or focus targets')
  const arc = document.querySelector('[aria-label="Technology track carousel"]')
  await event(arc, new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  assert.equal(selectedTrack, 1)
  await settle(700)
  await event(arc, new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
  assert.equal(selectedTrack, 0)
  assert.equal(arc.firstElementChild.style.touchAction, 'pan-y')
  assert.equal(document.querySelectorAll('[inert]').length, 3, 'Only the selected card participates in keyboard focus')
  await settle(750)
  await event(arc, new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
  assert.equal(selectedTrack, 3, 'Previous from the first card wraps to the last')
  await settle(750)
  await event(arc, new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  assert.equal(selectedTrack, 0, 'Next from the last card wraps to the first')
  await settle(180)
  const outgoingAngle = Number(document.querySelector('[data-arc-slide="3"]').style.transform.match(/rotate\(([-.\d]+)deg\)/)?.[1])
  assert(outgoingAngle < 0 && outgoingAngle >= -25, 'The wrap advances one arc slot instead of rewinding across the other cards')
  await clear()
  console.log('PASS: circular arc selection, seamless end-to-start rotation, unique content, keyboard and mobile touch behavior')

  const { TrackArc } = await server.ssrLoadModule('/src/components/RequestedEffects.jsx')
  const trackItems = ['AI', 'Quantum', 'Manufacturing', 'Health'].map((shortTitle, index) => ({ id: String(index), shortTitle, theme: `${shortTitle} research` }))
  let playingTrack = 0
  function PlayingArcHarness() {
    const [active, setActive] = React.useState(0)
    return h(TrackArc, { tracks: trackItems, active, onSelect: index => { playingTrack = index; setActive(index) } })
  }
  await render(h(PlayingArcHarness))
  for (let attempt = 0; attempt < 30 && (!document.querySelector('[data-arc-slide]') || document.querySelector('.arc-controls span')?.getAttribute('aria-live') !== 'off'); attempt++) await settle(40)
  assert(document.querySelector('[data-arc-slide]'), 'The lazy carousel has mounted before timing autoplay')
  assert.equal(document.querySelector('.arc-controls span').getAttribute('aria-live'), 'off', `The visible carousel is in autoplay mode; hidden=${document.hidden}; focus=${document.activeElement?.outerHTML.slice(0, 150)}`)
  await settle(2700)
  assert.equal(playingTrack, 0, 'The current card gets a complete three-second reading interval')
  await settle(450)
  assert.equal(playingTrack, 1, 'Visible carousel advances automatically after three seconds')
  await event(document.querySelector('[aria-label="Stop automatic track rotation"]'), new MouseEvent('click', { bubbles: true }))
  assert.equal(document.querySelector('.arc-playback').textContent, 'Play')
  await settle(3800)
  assert.equal(playingTrack, 1, 'Stop holds the selected card beyond the next autoplay interval')
  await event(document.querySelector('[aria-label="Play automatic track rotation"]'), new MouseEvent('click', { bubbles: true }))
  await settle(3200)
  assert.equal(playingTrack, 2, 'Play resumes automatic rotation')
  Object.defineProperty(document, 'hidden', { configurable: true, value: true })
  await event(document, new Event('visibilitychange'))
  await settle(3800)
  assert.equal(playingTrack, 2, 'Hidden tabs do not continue advancing the selection')
  Object.defineProperty(document, 'hidden', { configurable: true, value: false })
  await event(document, new Event('visibilitychange'))
  await clear()
  await settle(3200)
  assert.equal(playingTrack, 2, 'Unmount cancels any pending autoplay timer')
  console.log('PASS: three-second autoplay, Stop/Play control, hidden-tab pause and timer cleanup')

  const WaveText = await load('ScrollingWaveText.js')
  top = 0
  await render(h(WaveText, { text: 'Learn together.', scrollScreens: 1.6, bgStart: '#080807', textStart: '#ffae68' }))
  const waveLine = document.querySelector('[aria-label="Learn together."]')
  const initialPosition = waveLine.style.transform
  top = -900
  await settle(80)
  assert.notEqual(waveLine.style.transform, initialPosition, 'Scrolling changes the supplied wave text position')
  assert(waveLine.querySelector('[aria-hidden="true"]').style.transform.includes('rotate'), 'Letters follow the wave tangent')
  top = 0
  await settle(80)
  assert.equal(waveLine.style.transform, initialPosition, 'Wave text reverses when scrolling back')
  await clear()

  const Cube = await load('CubeBend.js')
  await render(h(Cube, { content: h('article', { id: 'original-objective' }, h('h2', null, 'Research collaboration'), h('a', { href: '/partners' }, 'Partnerships')), label: 'Summit objectives', showScrollbar: true, style: { height: 500 }, zone: 65 }))
  const cubeScroll = document.querySelector('[aria-label="Summit objectives"]')
  assert.equal(cubeScroll.tabIndex, 0, 'The folding scroller supports keyboard scrolling')
  assert.equal(cubeScroll.style.overscrollBehavior, 'auto', 'Scrolling can continue into the surrounding page')
  assert.equal(document.querySelectorAll('#original-objective').length, 1, 'Folded visual copies do not duplicate document IDs')
  assert(document.querySelector('#original-objective a[href="/partners"]'), 'Original links survive inside the folding view')
  await clear()
  console.log('PASS: wave scroll/reverse frames and folding-view content, keyboard access and cleanup')
} finally {
  await act(async () => root.unmount())
  await server.close()
  dom.window.close()
}
