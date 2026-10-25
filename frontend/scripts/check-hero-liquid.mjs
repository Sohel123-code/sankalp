import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import { coverScale, liquidSize, packWakes, WAKE_COUNT } from '../src/utils/heroLiquidShader.js'

for (const [w, h] of [[390, 780], [768, 900], [1920, 1080], [3840, 2160]]) {
  const size = liquidSize(w, h, 3)
  assert(size.width * size.height < 1253000, 'Backing canvas stays within its pixel budget')
  assert(size.scale <= 1.5)
}
assert.deepEqual(coverScale(900, 900, 1600, 900), [.5625, 1])
assert.deepEqual(coverScale(1600, 900, 900, 900), [1, .5625])
const packed = packWakes([{ x: .3, y: .7, time: 1, strength: .5 }], 1.5)
assert.equal(packed.length, WAKE_COUNT * 4)
assert.equal(packed[2], .5)
assert(packed.slice(4).every(value => value === 0))

const dom = new JSDOM('<section><video></video><div class="hero-content"><h1>SANKALP</h1><p>From research to real-world impact.</p></div><canvas></canvas><button>Pause motion</button></section>', { pretendToBeVisual: true })
for (const key of ['window', 'document', 'NodeFilter', 'HTMLElement', 'Element']) globalThis[key] = dom.window[key]
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window)
let now = 0, nextFrame = 0, draws = 0, clears = 0, deleted = 0
const frames = new Map(), uniforms = new Map()
globalThis.requestAnimationFrame = cb => { frames.set(++nextFrame, cb); return nextFrame }
globalThis.cancelAnimationFrame = id => frames.delete(id)
const originalPerformance = globalThis.performance
globalThis.performance = { now: () => now }
globalThis.ResizeObserver = class { observe() {} disconnect() {} }
const bounds = { left: 0, top: 80, width: 1000, height: 700, right: 1000, bottom: 780 }
Element.prototype.getBoundingClientRect = () => bounds
dom.window.Range.prototype.getBoundingClientRect = () => ({ left: 200, top: 200, width: 30, height: 50 })
const context = { setTransform() {}, measureText: () => ({ fontBoundingBoxAscent: 40 }), fillText() {} }
const gl = new Proxy({
  getShaderParameter: () => true, getProgramParameter: () => true, isContextLost: () => false,
  getUniformLocation: (_program, name) => name, getAttribLocation: () => 0,
  createTexture: () => ({}), createShader: () => ({}), createProgram: () => ({}), createBuffer: () => ({}),
  uniform4fv: (name, value) => uniforms.set(name, new Float32Array(value)),
  drawArrays: () => draws++, clear: () => clears++,
  deleteTexture: () => deleted++, deleteShader: () => deleted++, deleteProgram: () => deleted++, deleteBuffer: () => deleted++,
}, { get: (target, key) => key in target ? target[key] : /^[A-Z_0-9]+$/.test(key) ? 1 : () => {} })
let gpu = true
dom.window.HTMLCanvasElement.prototype.getContext = type => type === '2d' ? context : gpu ? gl : null
const hero = document.querySelector('section'), video = document.querySelector('video'), canvas = document.querySelector('canvas'), content = document.querySelector('.hero-content')
Object.defineProperties(video, { readyState: { value: 2 }, videoWidth: { value: 1600 }, videoHeight: { value: 900 } })
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, entries: [] } })
const { mountHeroLiquid } = await server.ssrLoadModule('/src/utils/heroLiquid.js')
function pointer(x, y, target = hero) {
  const event = new dom.window.MouseEvent('pointermove', { bubbles: true, clientX: x, clientY: y, cancelable: true })
  target.dispatchEvent(event)
  assert(!event.defaultPrevented, 'Pointer effects never prevent native touch/page interaction')
}
function tick(ms) {
  now = ms
  const pending = [...frames.values()]; frames.clear()
  pending.forEach(cb => cb(ms))
}
try {
  const cleanup = mountHeroLiquid({ canvas, hero, video, content })
  assert.equal(frames.size, 0, 'No idle rendering loop')
  pointer(300, 300); now = 50; pointer(430, 360); tick(100)
  assert.equal(draws, 1, 'Pointer movement produces a GPU frame')
  const wake = uniforms.get('wakes[0]')
  assert(Math.abs(wake[0] - .43) < .001)
  assert(Math.abs(wake[1] - .6) < .001, 'Coordinates account for the header offset and inverted texture Y')
  assert(content.textContent.includes('SANKALP'), 'Original accessible content stays in the DOM')
  tick(2000)
  assert.equal(frames.size, 0, 'Wake decays and stops scheduling frames')
  assert(clears > 0, 'The overlay clears to reveal the original content')
  pointer(300, 300); now = 2100; pointer(500, 450)
  document.dispatchEvent(new dom.window.Event('visibilitychange'))
  Object.defineProperty(document, 'hidden', { value: true, configurable: true })
  document.dispatchEvent(new dom.window.Event('visibilitychange'))
  assert.equal(frames.size, 0, 'Hidden tab cancels the effect')
  Object.defineProperty(document, 'hidden', { value: false, configurable: true })
  pointer(300, 300); now = 2200; pointer(500, 450)
  window.dispatchEvent(new dom.window.Event('scroll'))
  assert.equal(frames.size, 0, 'Scroll clears stale text geometry')
  now = 2250; pointer(800, 600, document.querySelector('button'))
  assert.equal(frames.size, 0, 'Controls do not emit distortion')
  cleanup()
  assert.equal(deleted, 6, 'Every GPU resource is released')
  now = 2300; pointer(100, 100); now = 2400; pointer(800, 400)
  assert.equal(frames.size, 0, 'Unmount removes listeners and pending frames')
  gpu = false
  mountHeroLiquid({ canvas, hero, video, content })()
  assert(content.textContent.includes('SANKALP'), 'No-WebGL fallback keeps the hero visible')
  console.log('PASS: responsive texture sizing, pointer refraction frames, decay, idle suspension, visibility, scroll, controls, cleanup and no-WebGL fallback')
} finally {
  globalThis.performance = originalPerformance
  await server.close(); dom.window.close()
}
