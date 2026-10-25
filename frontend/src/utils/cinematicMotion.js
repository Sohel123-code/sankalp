import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Only decorative descendants are animated here. Framer owns section reveals;
// this layer owns background depth and hero title masks, never section layout.
export function mountCinematicMotion(host) {
  gsap.registerPlugin(ScrollTrigger)
  const media = gsap.matchMedia()
  media.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
    if (context.conditions.reduced) return
    const { desktop } = context.conditions
    const hero = host.querySelector('.page-intro, .summit-hero')
    if (!hero) return
    const art = hero.querySelector('.ambient, .intro-graphic, .intro-image, .hero-video')
    if (art) gsap.fromTo(art, { yPercent: -2, scale: 1.045 }, {
      yPercent: desktop ? 9 : 4, scale: 1.01, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .65, invalidateOnRefresh: true },
    })
    const heading = hero.querySelector('.intro-inner h1')
    if (heading && !heading.closest('[data-hero-entry]')) gsap.fromTo(heading, { clipPath: 'inset(0% 0% 100% 0%)', yPercent: 8 }, {
      clipPath: 'inset(0% 0% 0% 0%)', yPercent: 0, duration: 1.05, delay: .08, ease: 'power3.out',
      clearProps: 'clipPath,transform',
    })
    const mesh = hero.querySelector('.hero-mesh')
    if (mesh) gsap.fromTo(mesh, { '--mesh-progress': 0 }, {
      '--mesh-progress': 1, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .5 },
    })
    // Choreograph the existing About journey without pinning, reflow or wrappers.
    const journey = host.querySelector('.impact-journey')
    if (journey) {
      const reactor = journey.querySelector('.reactor-art'), content = journey.querySelector('.impact-content')
      const sequence = gsap.timeline({ scrollTrigger: {
        trigger: journey, start: 'top 90%', end: desktop ? 'center 54%' : 'top 35%',
        scrub: .55, invalidateOnRefresh: true,
      } })
      if (reactor) sequence.fromTo(reactor, { scale: .78, rotation: -22, opacity: .15, transformOrigin: '50% 50%' }, {
        scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'power2.out',
      }, 0)
      if (content && desktop) sequence.fromTo(content, { y: 65, opacity: .12 }, {
        y: 0, opacity: 1, duration: .8, ease: 'power2.out',
      }, .18)
      else if (content) gsap.fromTo(content, { y: 35, opacity: .12 }, {
        y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: {
          trigger: content, start: 'top 92%', end: 'top 65%', scrub: .45,
        },
      })
    }
  }, host)
  // Refresh geometry when an existing disclosure or loaded font changes it.
  let refreshFrame = 0, disposed = false
  const refresh = () => {
    if (refreshFrame || disposed) return
    refreshFrame = requestAnimationFrame(() => { refreshFrame = 0; if (!disposed) ScrollTrigger.refresh() })
  }
  const resize = new ResizeObserver(refresh); resize.observe(host)
  document.fonts?.ready.then(refresh)
  return () => { disposed = true; cancelAnimationFrame(refreshFrame); resize.disconnect(); media.revert() }
}

export function mountPointerDepth(host) {
  const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
  let active = null, frame = 0, px = 0, py = 0
  const reset = () => {
    cancelAnimationFrame(frame); frame = 0
    if (active) for (const key of ['--pointer-x', '--pointer-y', '--pointer-angle', '--pointer-axis']) active.style.removeProperty(key)
    active = null
  }
  const move = e => {
    if (!media.matches || e.pointerType === 'touch') return
    const target = e.target.closest('.fancy-button, .frontier-preview, .impact-art')
    if (!target || !host.contains(target)) { reset(); return }
    if (active !== target) { reset(); active = target }
    const box = active.getBoundingClientRect()
    px = Math.max(-1, Math.min(1, (e.clientX - box.left) / Math.max(box.width, 1) * 2 - 1))
    py = Math.max(-1, Math.min(1, (e.clientY - box.top) / Math.max(box.height, 1) * 2 - 1))
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0
      if (!active) return
      active.style.setProperty('--pointer-x', `${(px * 3).toFixed(2)}px`)
      active.style.setProperty('--pointer-y', `${(py * 2).toFixed(2)}px`)
      active.style.setProperty('--pointer-axis', `${(-py).toFixed(3)} ${px.toFixed(3) || .001} .001`)
      active.style.setProperty('--pointer-angle', `${(Math.hypot(px, py) * 2).toFixed(2)}deg`)
    })
  }
  host.addEventListener('pointermove', move, { passive: true }); host.addEventListener('pointerleave', reset)
  host.addEventListener('focusin', reset); media.addEventListener('change', reset)
  window.addEventListener('blur', reset)
  return () => {
    reset(); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', reset)
    host.removeEventListener('focusin', reset); media.removeEventListener('change', reset); window.removeEventListener('blur', reset)
  }
}
