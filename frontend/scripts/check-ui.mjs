import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', { url: 'http://localhost/', pretendToBeVisual: true })
for (const key of ['window','document','HTMLElement','HTMLInputElement','HTMLSelectElement','HTMLTextAreaElement','Element','Node','MutationObserver','getComputedStyle','localStorage','sessionStorage','SVGElement','Event','MouseEvent','KeyboardEvent']) {
  globalThis[key] = key === 'getComputedStyle' ? dom.window.getComputedStyle.bind(dom.window) : dom.window[key]
}
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
globalThis.IS_REACT_ACT_ENVIRONMENT = true
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window)
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window)
window.scrollTo = () => {}
const elementScrolls = [], railScrolls = []
Element.prototype.scrollIntoView = function () { elementScrolls.push(this) }
Element.prototype.scrollTo = function (options) { railScrolls.push({ element: this, options }) }
window.matchMedia = query => ({ matches: query.includes('prefers-reduced-motion'), media: query, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} })
globalThis.matchMedia = window.matchMedia
globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
dom.window.HTMLMediaElement.prototype.play = () => Promise.resolve()
dom.window.HTMLMediaElement.prototype.pause = () => {}
dom.window.HTMLCanvasElement.prototype.getContext = () => null
// Isolate UI checks from all real accounts and external services.
let mockUser = null
let registrations = 0
globalThis.fetch = async (url, options = {}) => {
  const path = String(url)
  if (path.endsWith('/register')) {
    registrations++
    const { username, gmail } = JSON.parse(options.body)
    mockUser = { id: 'ui-test-only', username, gmail }
  }
  if (path.endsWith('/login')) mockUser = { id: 'ui-test-only', username: JSON.parse(options.body).username, gmail: 'ui-test@example.invalid' }
  if (path.endsWith('/logout')) mockUser = null
  return { ok: true, status: 200, json: async () => path.includes('/events') ? { events: [] } : { user: mockUser } }
}
const React = await import('react')
const { act } = React
const { createRoot } = await import('react-dom/client')
const { MemoryRouter } = await import('react-router-dom')
const server = await createServer({ cacheDir: 'node_modules/.vite-ui-check', server: { middlewareMode: true, hmr: false, open: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, entries: [] } })
const { default: App } = await server.ssrLoadModule('/src/App.jsx')
const { groupProgramme } = await import('../src/utils/programme.js')
const { SCHEDULE } = await import('../src/data/sankalpData.js')
const root = createRoot(document.getElementById('root'))
let checked = 0
async function route(path) {
  await act(async () => { root.render(React.createElement(MemoryRouter, { initialEntries: [path], key: path + checked++ }, React.createElement(App))); await new Promise(resolve => setTimeout(resolve, 25)) })
  for (let attempt = 0; attempt < 20 && !document.querySelector('h1,h2'); attempt++) {
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 50)) })
  }
  assert(document.querySelector('h1,h2'), `${path} must render a heading`)
  assert(!document.body.textContent.includes('undefined'), `${path} must not render undefined content`)
  assert(!document.querySelector('.breadcrumb'), `${path} omits the repeated breadcrumb trail`)
  if (path === '/') {
    assert(!document.querySelector('.hero-actions,.summit-hero .scroll-cue'), 'Hero omits the requested buttons and scroll prompt')
    assert(!document.querySelector('.framer-load-screen'), 'Homepage does not mount the old curtain')
  }
  for (const img of document.querySelectorAll('img')) {
    const imagePath = new URL(img.src).pathname
    // The logo, and the owner-supplied Kakinada photographs on the Venue page, are the approved images.
    assert(imagePath === '/media/sankalp-logo.png' || (path === '/venue' && imagePath.startsWith('/media/kakinada/')), `${path} must not display unapproved decorative or stock images`)
  }
  assert(!/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\u23E9-\u23FA]/u.test(document.body.textContent), `${path} must not render decorative emoji`)
}
async function click(el) { assert(el, 'Expected interactive element'); await act(async () => { el.click(); await new Promise(resolve => setTimeout(resolve, 5)) }) }
async function input(el, value) {
  assert(el, 'Expected input')
  await act(async () => {
    const prototype = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype
    Object.getOwnPropertyDescriptor(prototype, 'value').set.call(el, value)
    el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }))
  })
}
async function settle() {
  for (let i = 0; i < 8; i++) await act(async () => { await new Promise(resolve => setTimeout(resolve, 40)) })
}
async function submit(form) {
  assert(form, 'Expected account form')
  await act(async () => { form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })) })
  await settle()
}
try {
  const paths = ['/', '/about', '/tracks', '/programme', '/workshops', '/innovation-challenge', '/investor-connect', '/speakers', '/partners', '/showcase', '/registration', '/venue', '/faq', '/contact', '/privacy-policy', '/terms', '/cancellation-refund', '/events', '/login', '/register', '/missing-page']
  for (const path of paths) await route(path)
  console.log(`PASS: ${paths.length} public/auth routes render`)
  await route('/about')
  assert(document.querySelector('.intro-about .hero-mesh canvas'), 'About hero contains the decorative mesh')
  assert.equal(document.querySelector('.page-intro h1').textContent, 'Ideas into impact.')
  assert.equal(document.querySelectorAll('.journey-tabs button').length, 6, 'Existing journey stays intact')
  assert.equal(document.querySelectorAll('.research-frontier').length, 4, 'About retains all four frontiers in its reduced-motion view')
  assert(document.querySelector('.research-tunnel-stage'), 'Research sequence has its own full-screen stage')
  assert(!document.querySelector('.research-tunnel.is-sequenced'), 'Reduced motion keeps the frontiers in normal flow')
  assert(document.querySelector(document.querySelector('.research-tunnel-continue').getAttribute('href')), 'Continue link resolves after the research sequence')
  await click(document.querySelectorAll('.journey-tabs button')[3])
  assert(document.querySelectorAll('.journey-tabs button')[3].getAttribute('aria-pressed') === 'true')
  console.log('PASS: About mesh, unchanged title and six-stage journey interaction')
  await route('/programme')
  assert.equal(document.querySelectorAll('.stage-stop').length, 14, 'The interactive programme shows a stop for every session')
  assert(!elementScrolls.some(element => element.matches('.stage-stop')), 'Programme does not pull the document past its hero on mount')
  assert(railScrolls.some(({ element }) => element.matches('.stage-rail')), 'Selection scrolls only the horizontal timeline')
  await click(document.querySelectorAll('.stage-stop')[3])
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 600)) })
  assert.equal(document.querySelector('.stage-card h3').textContent, SCHEDULE.day1.sessions[3].title, 'Choosing a stop opens that session')
  await click([...document.querySelectorAll('.agenda-view button')].find(b => b.textContent === 'Full list'))
  assert.equal(document.querySelectorAll('.agenda-session').length, 14)
  assert.equal(document.querySelectorAll('.agenda-chapter').length, 3)
  for (const day of ['day1', 'day2']) {
    const chapters = groupProgramme(SCHEDULE[day].sessions)
    assert.deepEqual(chapters.flatMap(c => c.sessions.map(s => s.session)), SCHEDULE[day].sessions, 'Chapters preserve programme order and every session')
    assert(chapters[0].sessions.every(({session}) => session.time.includes('AM')), 'Morning sessions keep the correct meridiem')
  }
  const boundary = groupProgramme([{time:'11:30 AM – 12:10 PM', type:'Talk'}, {time:'12:10 – 12:50 PM', type:'Talk'}, {time:'4:00 – 4:35 PM', type:'Talk'}])
  assert.deepEqual(boundary.map(c => c.sessions[0].index), [0,1,2], 'Noon and evening boundaries use the session start time')
  for (const link of document.querySelectorAll('.agenda-chapters-nav a')) assert(document.querySelector(link.getAttribute('href')), 'Timeline jumps resolve')
  await click(document.querySelectorAll('.agenda-days button')[1])
  assert.equal(document.querySelectorAll('.agenda-session').length, 15)
  await input(document.getElementById('session-filter'), 'Workshops')
  assert.equal(document.querySelectorAll('.agenda-session').length, 1)
  await click(document.querySelector('.parallel-rooms summary'))
  assert(document.querySelector('.parallel-rooms').open)
  assert(document.querySelector('.parallel-rooms').textContent.includes('Main Auditorium'))
  await click(document.querySelectorAll('.agenda-days button')[0])
  assert.equal(document.querySelectorAll('.agenda-session').length, 14, 'Day change resets session filter')
  console.log('PASS: programme days, filters, reset and parallel room details')
  await route('/tracks')
  await input(document.querySelector('input[aria-label="Search topics"]'), 'nonexistent-topic-xyz')
  assert(document.body.textContent.includes('No matching topics found'))
  await click([...document.querySelectorAll('button')].find(b => b.textContent === 'Reset Filters'))
  assert.equal(document.querySelectorAll('article').length, 4)
  await click(document.querySelectorAll('.track-arc-static button')[2])
  assert.equal(document.querySelectorAll('.research-card:not([hidden])').length, 1, 'Only the selected track detail is displayed')
  assert(document.querySelector('.research-card:not([hidden])').textContent.includes('Intelligent Manufacturing'))
  console.log('PASS: track search and reset')
  await route('/workshops')
  assert.equal(document.querySelectorAll('.wx-list [role="tab"]').length, 4, 'All four specialist workshops are listed')
  await click(document.querySelectorAll('.wx-list [role="tab"]')[2])
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 600)) })
  assert(document.querySelector('.wx-panel').textContent.includes('Industrial Digital Twins'), 'Choosing a workshop opens its details')
  assert(document.querySelector('.wx-panel a[href="/registration"]'), 'Workshop registration remains reachable')
  assert.equal(document.querySelectorAll('.wx-rhythm li').length, 7, 'The workshop running order is always visible')
  await click([...document.querySelectorAll('button')].find(b => b.textContent.includes('3 Open Summit Labs')))
  assert.equal(document.querySelectorAll('.wx-lab').length, 3)
  await click([...document.querySelectorAll('button')].find(b => b.textContent.includes('Participant Checklist')))
  assert(document.body.textContent.includes('Are you ready for Day 2?'))
  await click(document.querySelector('.wx-check input'))
  assert(document.querySelector('.wx-check-meter').textContent.startsWith('1/'), 'Ticking an item updates readiness')
  console.log('PASS: workshop tabs and guidelines')
  await route('/registration')
  await input(document.querySelector('input[type="number"]'), '10')
  assert(document.body.textContent.includes('7,200'), 'Student group discount is preserved')
  await click(document.getElementById('wsCheck'))
  assert(document.body.textContent.includes('10,700'), 'Workshop add-on remains category-based')
  await click(document.getElementById('pitchCheck'))
  assert(document.body.textContent.includes('10,900'), 'Challenge fee remains per idea')
  console.log('PASS: existing registration calculator and add-ons')
  await route('/')
  assert(document.querySelector('.header-links a[href="/"]').getAttribute('aria-current') === 'page')
  assert(!document.querySelector('.header-links a[href="/contact"]').hasAttribute('aria-current'))
  for (const link of document.querySelectorAll('.home-chapters a')) assert(document.querySelector(link.getAttribute('href')), 'Home chapter jumps resolve')
  await click(document.querySelectorAll('.frontier-tabs button')[1])
  assert(!document.querySelector('.summit-story-progress'), 'Removed story progress line stays absent')
  assert.equal(document.querySelectorAll('.summit-track-summary').length, 4, 'Introduction cards identify all four summit tracks')
  assert(document.querySelector('.frontier-preview a').getAttribute('href').includes('quantum'))
  await click(document.querySelectorAll('.day-selector button')[1])
  assert(document.querySelector('.preview-sessions').textContent.includes('Workshops'))
  await click(document.getElementById('mobile-menu-toggle'))
  assert(document.querySelector('[aria-label="Mobile navigation"]'))
  await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
  assert(!document.querySelector('[aria-label="Mobile navigation"]'))
  console.log('PASS: home programme switch and mobile menu keyboard dismissal')
  await route('/contact')
  assert(document.querySelector('.header-links a[href="/contact"]').getAttribute('aria-current') === 'page')
  assert(!document.querySelector('.header-links a[href="/"]').hasAttribute('aria-current'), 'Home is not active on other pages')
  assert.equal(document.querySelectorAll('.ct-desk').length, 4, 'Every desk is listed')
  await click(document.querySelectorAll('.ct-desk-action')[1])
  assert.equal(document.getElementById('contact-category').value, 'Registration & Delegate Support', 'A desk card pre-selects its enquiry category')
  assert(document.querySelector('label[for="contact-email"]'))
  console.log('PASS: Home/Contact navigation, chapter links and contact disclosure')
  await route('/dashboard')
  assert(document.body.textContent.includes('Sign In') || document.body.textContent.includes('Welcome back'), 'Unauthenticated dashboard remains guarded')
  console.log('PASS: protected dashboard redirects unauthenticated visitors')
  await route('/register')
  await input(document.getElementById('username'), 'summit_test')
  await input(document.getElementById('gmail'), 'ui-test@example.invalid')
  await input(document.getElementById('password'), 'Test-only-123')
  await submit(document.querySelector('form'))
  assert.equal(registrations, 1, 'Registration uses the existing API once')
  assert(document.getElementById('profile-menu-toggle'), 'Registration immediately shows the signed-in profile')
  await click(document.getElementById('profile-menu-toggle'))
  assert(document.querySelector('.profile-id').textContent.includes('summit_test'))
  assert(document.querySelector('.profile-id').textContent.includes('Member'))
  assert(document.getElementById('logout-btn'), 'The account menu offers sign out')
  await click(document.getElementById('profile-menu-toggle'))
  assert(!document.getElementById('nav-register-cta') && !document.getElementById('nav-login'))
  assert(document.body.textContent.includes('An account does not confirm a summit pass'))
  for (const path of ['/login', '/register']) {
    await route(path)
    assert(document.getElementById('profile-menu-toggle'), 'Signed-in auth routes redirect to the profile')
    assert(!document.getElementById('registerBtn') && !document.getElementById('loginBtn'))
  }
  await route('/')
  assert(![...document.querySelectorAll('.fancy-button')].some(el => /register|sign up/i.test(el.textContent)), 'Home account CTAs adapt to the session')
  await click(document.getElementById('mobile-menu-toggle'))
  assert(!document.getElementById('mobile-register') && !document.getElementById('mobile-login'))
  await click(document.getElementById('mobile-menu-toggle'))
  mockUser = { ...mockUser, participantType: 'faculty' }
  await route('/about')
  await click(document.getElementById('profile-menu-toggle'))
  assert(document.querySelector('#profile-panel .profile-id').textContent.includes('Faculty'), 'Profile uses a supplied participant category')
  assert(document.querySelector('#profile-panel').textContent.includes('ui-test@example.invalid'))
  await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
  assert(!document.querySelector('#profile-panel'))
  await click(document.getElementById('profile-menu-toggle'))
  await click(document.getElementById('logout-btn'))
  await settle()
  assert(document.getElementById('loginBtn') && !document.getElementById('profile-menu-toggle'))
  assert.equal(localStorage.getItem('sk_user'), null, 'Sign out clears the cached account')
  await input(document.getElementById('login-username'), 'returning_member')
  await input(document.getElementById('login-password'), 'Test-only-123')
  await submit(document.querySelector('form'))
  await click(document.getElementById('profile-menu-toggle'))
  assert(document.querySelector('.profile-id').textContent.includes('returning_member'))
  assert(!document.getElementById('nav-register-cta'))
  console.log('PASS: registration session, auth redirects, profile types, mobile account UI, logout and login')
} finally {
  await act(async () => root.unmount())
  await Promise.race([server.close(), new Promise(resolve => setTimeout(resolve, 2000))])
  dom.window.close()
}
// Motion's scheduler can retain an animation-frame timer in the emulated DOM.
process.exit(0)
