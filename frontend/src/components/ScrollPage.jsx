import { useEffect, useRef } from 'react'
import { useReducedMotion, useScroll } from 'framer-motion'
import { useCalmScroll } from '../utils/calmScroll'
import { revealFrame } from '../utils/scrollReveal'
import { mountTouchReveal } from '../utils/touchReveal'

const cards = 'article:not(.agenda-session), .research-card, .impact-art, .about-purpose > details, .explorer-controls, .workshop-meta, .participant-checklist, .participation-links > a, .summit-facts > span, .profile-summary > div, [class*="catCard"], [class*="actCard"], [class*="partCard"], [class*="typeCard"], [class*="tierCard"], [class*="faqItem"], [class*="heroBox"], [class*="heroCard"], [class*="formCard"], [class*="nominationFormCard"], [class*="panelBox"], [class*="secretariatCard"], [class*="stepCard"], [class*="stripItem"]'

export default function ScrollPage({ children, route }) {
  const root = useRef(null), reduced = useCalmScroll(), motionReduced = useReducedMotion()
  const { scrollY } = useScroll()
  useEffect(() => {
    if (reduced || !root.current) return
    let disposed = false, cleanup, referenceCleanup
    import('../utils/referenceMotion').then(({ mountReferenceMotion }) => {
      if (!disposed && root.current) referenceCleanup = mountReferenceMotion(root.current)
    }).catch(error => console.warn('Section motion unavailable; content remains visible.', error))
    import('../utils/cinematicMotion').then(({ mountCinematicMotion, mountPointerDepth }) => {
      if (disposed || !root.current) return
      const releaseMotion = mountCinematicMotion(root.current)
      const releasePointer = mountPointerDepth(root.current)
      cleanup = () => { releasePointer(); releaseMotion() }
    }).catch(error => console.warn('Decorative motion unavailable; content remains accessible.', error))
    return () => { disposed = true; cleanup?.(); referenceCleanup?.() }
  }, [route, reduced])
  useEffect(() => {
    if (reduced || !root.current) return
    const host = root.current, units = new Map()
    let frame = 0, disposed = false
    const excluded = el => el.closest('.scroll-scene, .page-intro, .summit-hero, .ambient, [role="dialog"], [data-scroll-owned], [data-summit-scene], .agenda-session, .torn-reveal, .route-about .impact-journey')
    const register = (el, heading) => {
      if (units.has(el) || excluded(el) || el.closest('form') || el.querySelector('form')) return
      // Transform outer cards only, so child headings do not drift twice.
      if (el.parentElement?.closest(cards)) return
      const siblings = [...el.parentElement.children].filter(sibling => sibling.matches(heading ? 'h2' : cards))
      units.set(el, { heading, index: Math.max(0, siblings.indexOf(el)), y: 0, last: -1 })
      el.classList.add('scroll-unit', heading ? 'scroll-heading-unit' : 'scroll-card-unit')
    }
    const update = () => {
      frame = 0
      if (disposed) return
      const viewport = window.innerHeight
      const writes = []
      for (const [el, unit] of units) {
        if (!el.isConnected) { units.delete(el); continue }
        // Transform origin is top center, so subtract only our own translation.
        const focused = el.contains(document.activeElement)
        const top = el.getBoundingClientRect().top - (focused ? 0 : unit.y)
        const next = revealFrame(top, viewport, unit.index, unit.heading)
        if (Math.abs(next.progress - unit.last) < .001) continue
        writes.push([el, unit, next])
      }
      for (const [el, unit, next] of writes) {
        el.style.setProperty('--scroll-y', `${next.y.toFixed(2)}px`)
        el.style.setProperty('--scroll-scale', next.scale.toFixed(4))
        el.style.setProperty('--scroll-opacity', next.opacity.toFixed(4))
        el.style.setProperty('--scroll-inset', `${next.inset.toFixed(2)}%`)
        unit.y = next.y; unit.last = next.progress
        // Layer promotion only while a unit is moving: dozens of permanent layers cost more than they save.
        el.classList.toggle('is-revealing', next.progress > 0 && next.progress < 1)
      }
    }
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(update) }
    const scan = () => {
      host.querySelectorAll(cards).forEach(el => register(el, false))
      host.querySelectorAll('h2').forEach(el => register(el, true))
      schedule()
    }
    // React can mutate the tree many times per frame; rescan once per frame.
    let scanFrame = 0
    const scanSoon = () => { if (!scanFrame && !disposed) scanFrame = requestAnimationFrame(() => { scanFrame = 0; if (!disposed) scan() }) }
    scan()
    const unsubscribe = scrollY.on('change', schedule)
    const resize = new ResizeObserver(schedule); resize.observe(host)
    const mutations = new MutationObserver(scanSoon); mutations.observe(host, { childList: true, subtree: true })
    window.addEventListener('resize', schedule)
    host.addEventListener('focusin', schedule); host.addEventListener('focusout', schedule)
    return () => {
      disposed = true; cancelAnimationFrame(frame); cancelAnimationFrame(scanFrame); unsubscribe(); resize.disconnect(); mutations.disconnect()
      window.removeEventListener('resize', schedule); host.removeEventListener('focusin', schedule); host.removeEventListener('focusout', schedule)
      for (const el of units.keys()) {
        el.classList.remove('scroll-unit', 'scroll-heading-unit', 'scroll-card-unit', 'is-revealing')
        for (const key of ['y', 'scale', 'opacity', 'inset']) el.style.removeProperty(`--scroll-${key}`)
      }
    }
  }, [route, reduced, scrollY])
  // Phones and touch tablets skip the scrubbed reveals above; they get a one-shot fade-up instead (unless motion is reduced).
  useEffect(() => {
    if (!reduced || motionReduced || !root.current) return
    return mountTouchReveal(root.current)
  }, [route, reduced, motionReduced])
  return <div ref={root} className={`route-content route-${route.split('/')[1] || 'home'}`}>{children}</div>
}
