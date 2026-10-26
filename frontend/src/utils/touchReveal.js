// One-shot entrance for phones and touch tablets. Scroll-scrubbed reveals (GSAP, per-frame style writes) cost too
// much on these devices, so each block simply fades up once, the first time it scrolls into view. The transition is
// opacity/transform only, so it runs on the compositor and never blocks scrolling.
//
// Safety rules: nothing at or above the fold is ever hidden, hidden blocks are revealed by focus as well as scroll,
// and if IntersectionObserver is unavailable nothing is tagged at all.
const targets = [
  '.summit-section-heading', '.summit-section-body > *', '.summit-story-heading', '.summit-story-montage > *', '.summit-story-panel',
  '.summit-preview-session', '.summit-participation-grid > a', '.summit-audience-grid > details', '.summit-footer-main > *',
  'article:not(.agenda-session)', '.research-card', '.disclosure', '.explorer-controls', '.workshop-meta', '.compact-cta',
  '[class*="catCard"]', '[class*="actCard"]', '[class*="partCard"]', '[class*="typeCard"]', '[class*="tierCard"]',
  '[class*="faqItem"]', '[class*="heroBox"]', '[class*="heroCard"]', '[class*="panelBox"]', '[class*="secretariatCard"]',
  '[class*="stepCard"]', '[class*="stripItem"]',
].join(',')
const skip = '.page-intro, .summit-hero, [role="dialog"], [data-effect-owned], .ambient'

export function mountTouchReveal(host) {
  if (typeof IntersectionObserver === 'undefined') return () => {}
  const tagged = new Set()
  let scanFrame = 0, disposed = false
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const el = entry.target
      observer.unobserve(el)
      el.classList.add('tr-in')
      // Once the fade has finished the element returns to its normal styles, so its own hover/tap transitions are untouched.
      window.setTimeout(() => { el.classList.remove('tr', 'tr-in'); el.style.removeProperty('--tr-delay') }, 900)
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: .08 })
  const scan = () => {
    scanFrame = 0
    if (disposed) return
    const viewport = window.innerHeight
    const fresh = []
    host.querySelectorAll(targets).forEach(el => {
      if (tagged.has(el) || el.closest(skip)) return
      // A tagged ancestor already reveals its descendants as one piece.
      if (el.parentElement?.closest('.tr') || fresh.some(parent => parent.contains(el))) return
      tagged.add(el)
      // Already visible (or scrolled past): leave it alone, otherwise a block would flash out and back in.
      if (el.getBoundingClientRect().top < viewport * .94) return
      fresh.push(el)
    })
    fresh.forEach((el, index) => {
      el.classList.add('tr')
      el.style.setProperty('--tr-delay', `${Math.min(index % 4, 3) * 60}ms`)
      observer.observe(el)
    })
  }
  const schedule = () => { if (!scanFrame && !disposed) scanFrame = requestAnimationFrame(scan) }
  schedule()
  // Chapters mount lazily and tabs swap content; tag whatever arrives later too.
  const mutations = new MutationObserver(schedule)
  mutations.observe(host, { childList: true, subtree: true })
  return () => {
    disposed = true; cancelAnimationFrame(scanFrame); observer.disconnect(); mutations.disconnect()
    host.querySelectorAll('.tr').forEach(el => { el.classList.remove('tr', 'tr-in'); el.style.removeProperty('--tr-delay') })
  }
}
