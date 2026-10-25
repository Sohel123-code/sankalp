import { gsap } from 'gsap'
import { isPhone } from './calmScroll'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// CSS sticky supplies the finite pin. No wheel interception, body scroll lock,
// nested scrollport or generated pin spacer is needed for this sequence.
export function mountResearchTunnel(host, progress) {
  // On a phone the four frontiers simply stack, instead of a long pinned sequence with little on screen.
  if (isPhone()) return () => {}
  gsap.registerPlugin(ScrollTrigger)
  const media = gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const intro = host.querySelector('.research-tunnel-copy')
    const cards = [...host.querySelectorAll('.research-frontier')]
    if (!intro || !cards.length) return
    host.classList.add('is-sequenced')
    const playhead = { value: 0 }
    // Only the text inside each frontier animates; the card itself is a transparent holder.
    const parts = cards.map(card => [...card.children])
    const syncAccess = () => {
      cards.forEach((card, index) => {
        const readable = Number(gsap.getProperty(parts[index][1], 'opacity')) > .9
        card.inert = !readable
        card.setAttribute('aria-hidden', String(!readable))
      })
    }
    gsap.set(cards, { xPercent: -50, yPercent: -50 })
    parts.forEach(group => gsap.set(group, { opacity: 0, y: 48 }))
    const timeline = gsap.timeline({
      onUpdate: syncAccess,
      scrollTrigger: {
        trigger: host, start: 'top top', end: 'bottom bottom',
        scrub: .35, invalidateOnRefresh: true,
      },
    })
    timeline.to(intro, { opacity: 0, y: -40, scale: .94, duration: .5, ease: 'power2.inOut' }, .2)
    cards.forEach((card, index) => {
      const start = .7 + index * 1.35
      const group = parts[index]
      timeline.to(group, { opacity: 1, y: 0, duration: .5, ease: 'power3.out', stagger: .08 }, start)
      if (index < cards.length - 1) {
        timeline.to(group, { opacity: 0, y: -36, duration: .22, ease: 'power1.in', stagger: .02 }, start + 1.08)
      } else {
        // Hold the last frontier as the sticky stage naturally releases.
        timeline.to(group, { opacity: 1, duration: .4 }, start + 1.1)
      }
    })
    timeline.to(playhead, { value: 1, duration: timeline.duration(), ease: 'none', onUpdate: () => progress.set(playhead.value) }, 0)
    syncAccess()
    const refresh = () => ScrollTrigger.refresh()
    const frame = requestAnimationFrame(refresh)
    return () => {
      cancelAnimationFrame(frame)
      host.classList.remove('is-sequenced')
      cards.forEach((card, index) => { card.inert = false; card.removeAttribute('aria-hidden'); gsap.set(parts[index], { clearProps: 'all' }) })
      progress.set(0)
    }
  }, host)
  return () => media.revert()
}
