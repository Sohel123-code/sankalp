import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Scroll choreography for everything below the story pin, through the footer.
// Every tween is scrubbed or reversible; elements are only hidden by gsap itself,
// so an interrupted import leaves readable content. The hero is never touched.
const q = (root, selector) => [...root.querySelectorAll(selector)]

export function mountHomeMotion(host) {
  gsap.registerPlugin(ScrollTrigger)
  const media = gsap.matchMedia()
  media.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
    if (context.conditions.reduced) return
    const d = context.conditions.desktop
    const x = amount => (d ? amount : amount / 3)
    const y = amount => (d ? amount : amount / 2)

    // Shared: every chapter gets heading words, eyebrow, a drifting ghost numeral and a glow.
    q(host, '.summit-section[data-home-scene]').forEach(scene => {
      const words = q(scene, '[data-reveal-word]'), eyebrow = scene.querySelector('.summit-section-heading .eyebrow')
      const intro = scene.querySelector('.summit-section-heading > p')
      const heading = scene.querySelector('.summit-section-heading')
      if (heading && words.length) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: heading, start: 'top 90%', end: 'top 42%', scrub: .6 } })
        tl.fromTo(words, { yPercent: 125, rotate: 6, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, stagger: .09, ease: 'power3.out', duration: 1 }, 0)
        if (eyebrow) tl.fromTo(eyebrow, { x: x(-60), opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', duration: .7 }, 0)
        if (intro) tl.fromTo(intro, { y: y(40), opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', duration: .8 }, .35)
      }
      // Ghost numeral and glow parallax at different speeds than the content.
      gsap.fromTo(scene, { '--ghost-y': -120, '--glow-o': 0 }, { '--ghost-y': 160, '--glow-o': 1, ease: 'none', scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo(scene, { '--rule': 0 }, { '--rule': 1, ease: 'power2.out', scrollTrigger: { trigger: scene, start: 'top 85%', end: 'top 40%', scrub: .5 } })
    })

    // 01 Tracks: tabs sweep in one by one, preview card unveils with a clip wipe + settle.
    const tracks = host.querySelector('#chapter-tracks')
    if (tracks) {
      const tabs = q(tracks, '.frontier-tabs button'), stage = tracks.querySelector('[data-track-stage]')
      gsap.fromTo(tabs, { x: x(-90), opacity: 0 }, { x: 0, opacity: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: tracks.querySelector('.summit-track-explorer'), start: 'top 88%', end: 'top 40%', scrub: .6 } })
      if (stage) {
        gsap.fromTo(stage, { clipPath: 'inset(0% 0% 100% 0% round 6px)', y: y(80), scale: .94 }, { clipPath: 'inset(0% 0% 0% 0% round 4px)', y: 0, scale: 1, ease: 'power3.out', scrollTrigger: { trigger: stage, start: 'top 92%', end: 'top 42%', scrub: .7 } })
        gsap.to(stage, { yPercent: d ? -6 : 0, ease: 'none', scrollTrigger: { trigger: stage, start: 'top 40%', end: 'bottom top', scrub: true } })
      }
    }

    // 02 Programme: day buttons rise, sessions slide in from the right and draw their rules.
    const programme = host.querySelector('#chapter-programme')
    if (programme) {
      const days = q(programme, '.day-selector > *'), selector = programme.querySelector('.summit-programme-preview')
      gsap.fromTo(days, { x: x(-80), opacity: 0 }, { x: 0, opacity: 1, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: selector, start: 'top 88%', end: 'top 45%', scrub: .6 } })
      q(programme, '.summit-preview-session').forEach((row, i) => {
        gsap.fromTo(row, { x: x(110), opacity: 0, '--rule': 0 }, { x: 0, opacity: 1, '--rule': 1, ease: 'power3.out', scrollTrigger: { trigger: row, start: `top ${96 - i * 3}%`, end: `top ${58 - i * 3}%`, scrub: .55 } })
      })
    }

    // 03 Workshops: list card tilts upright, rows cascade; copy column counter-drifts.
    const workshops = host.querySelector('#chapter-workshops')
    if (workshops) {
      const list = workshops.querySelector('.summit-workshop-list'), copy = workshops.querySelector('.summit-workshop-feature > .summit-section-body > div:last-child')
      if (list) {
        gsap.fromTo(list, { rotateY: d ? 14 : 0, x: x(-100), opacity: 0, transformPerspective: 1100 }, { rotateY: 0, x: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: list, start: 'top 92%', end: 'top 40%', scrub: .7 } })
        gsap.fromTo(q(list, ':scope > div'), { y: y(36), opacity: 0 }, { y: 0, opacity: 1, stagger: .18, ease: 'power2.out', scrollTrigger: { trigger: list, start: 'top 78%', end: 'bottom 70%', scrub: .6 } })
      }
      if (copy) {
        gsap.fromTo(copy.children, { y: y(70), opacity: 0 }, { y: 0, opacity: 1, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: copy, start: 'top 90%', end: 'top 40%', scrub: .6 } })
        if (d) gsap.fromTo(copy, { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: workshops, start: 'top bottom', end: 'bottom top', scrub: true } })
      }
    }

    // 04 Audience: rows draw a rule and glide in alternately from each side.
    q(host, '.summit-audience-grid > details').forEach((row, i) => {
      gsap.fromTo(row, { x: x(i % 2 ? 90 : -90), opacity: 0, '--rule': 0 }, { x: 0, opacity: 1, '--rule': 1, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 94%', end: 'top 62%', scrub: .5 } })
    })

    // 05 Participation: cards fan up in 3D, staggered, with a floating settle.
    const cards = q(host, '.summit-participation-grid > a')
    if (cards.length) {
      const grid = cards[0].parentElement
      gsap.fromTo(cards, { y: y(150), rotateX: d ? -28 : 0, scale: .9, opacity: 0, transformPerspective: 1000, transformOrigin: '50% 100%' }, { y: 0, rotateX: 0, scale: 1, opacity: 1, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: grid, start: 'top 94%', end: 'top 46%', scrub: .7 } })
      if (d) cards.forEach((card, i) => gsap.to(card, { yPercent: i % 2 ? 4 : -4, ease: 'none', scrollTrigger: { trigger: grid, start: 'top 40%', end: 'bottom top', scrub: true } }))
    }

    // Marquees: scroll drives horizontal travel, so the bands feel tied to the page.
    q(host, '.summit-marquee').forEach(band => {
      const track = band.querySelector('[data-marquee]'), reverse = band.classList.contains('is-reverse')
      gsap.fromTo(track, { xPercent: reverse ? -33.3 : 0 }, { xPercent: reverse ? 0 : -33.3, ease: 'none', scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: .4 } })
      gsap.fromTo(band, { opacity: 0, scaleY: .6 }, { opacity: 1, scaleY: 1, ease: 'power2.out', scrollTrigger: { trigger: band, start: 'top 98%', end: 'top 80%', scrub: true } })
    })

    // Closing: the call to action scales up out of the dark with a swelling glow.
    const closing = host.querySelector('.summit-closing')
    if (closing) {
      const h2 = closing.querySelector('h2'), rest = q(closing, '.eyebrow, .summit-section-body > div, .summit-section-body > p')
      gsap.fromTo(closing, { '--closing-glow': 0 }, { '--closing-glow': 1, ease: 'none', scrollTrigger: { trigger: closing, start: 'top 90%', end: 'center center', scrub: true } })
      if (h2) gsap.fromTo(h2, { scale: .82, y: y(60), opacity: .2 }, { scale: 1, y: 0, opacity: 1, ease: 'power3.out', scrollTrigger: { trigger: closing, start: 'top 88%', end: 'center 60%', scrub: .7 } })
      gsap.fromTo(rest, { y: y(50), opacity: 0 }, { y: 0, opacity: 1, stagger: .12, ease: 'power2.out', scrollTrigger: { trigger: closing, start: 'top 60%', end: 'center 50%', scrub: .6 } })
    }

    // Stacked chapters (desktop): like the story's opening, each chapter holds,
    // then recedes into the dark while the next one rises over it. pinSpacing is
    // false, so no spacer is added and downstream measurements never shift.
    if (d) {
      const tallOf = el => el.offsetHeight > window.innerHeight
      const recede = { scale: .86, opacity: .22, yPercent: -2, ease: 'power1.in' }
      q(host, '.summit-section[data-home-scene]').forEach((scene, i) => {
        const next = scene.nextElementSibling
        if (!next || scene.matches('.summit-closing')) return
        gsap.timeline({ scrollTrigger: { trigger: scene, start: () => (tallOf(scene) ? 'bottom bottom' : 'top top'), endTrigger: next, end: 'top top', pin: true, pinSpacing: false, scrub: true, invalidateOnRefresh: true, refreshPriority: -1 - i } })
          .fromTo(scene, { scale: 1, opacity: 1, yPercent: 0, transformOrigin: '50% 45%' }, recede)
      })
      // The story already owns a GSAP pin on its stage, so its exit holds the
      // host with a transform instead. The transform exists only while the next
      // chapter is rising, i.e. never while the inner pin is fixed-positioned.
      const story = host.querySelector('.summit-story'), afterStory = story?.nextElementSibling
      if (story && afterStory) {
        const clear = () => gsap.set(story, { clearProps: 'transform,opacity,transformOrigin' })
        ScrollTrigger.create({ trigger: story, start: 'bottom bottom', endTrigger: afterStory, end: 'top top', invalidateOnRefresh: true, refreshPriority: -1,
          onUpdate: self => {
            const p = self.progress
            if (p <= 0) return clear()
            gsap.set(story, { y: p * (self.end - self.start), scale: 1 - .14 * p, opacity: 1 - .78 * p, transformOrigin: `50% ${story.offsetHeight - window.innerHeight / 2}px` })
          },
          onLeaveBack: clear })
        story.dataset.stacked = ''
      }
    }

    // Footer: the page lifts away (CSS sticky curtain); columns and wordmark assemble beneath it.
    const footer = document.querySelector('.summit-footer')
    if (footer) {
      const cols = q(footer, '.summit-footer-main > *'), mark = footer.querySelector('.summit-footer-wordmark')
      gsap.fromTo(cols, { y: y(60), opacity: 0 }, { y: 0, opacity: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: footer, start: 'top 95%', end: 'top 45%', scrub: .6 } })
      if (mark) {
        const letters = q(mark, '[data-letter]')
        gsap.fromTo(letters, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .05, ease: 'power3.out', scrollTrigger: { trigger: footer, start: 'top 70%', end: 'bottom bottom', scrub: .6 } })
      }
    }
  }, host)

  // Late layout shifts (fonts, tab content, disclosures) must re-measure triggers.
  let frame = 0, disposed = false
  const refresh = () => {
    if (frame || disposed) return
    frame = requestAnimationFrame(() => { frame = 0; if (!disposed) ScrollTrigger.refresh() })
  }
  const resize = new ResizeObserver(refresh); resize.observe(host)
  document.fonts?.ready.then(refresh)
  host.addEventListener('toggle', refresh, true)
  return () => { disposed = true; cancelAnimationFrame(frame); resize.disconnect(); host.removeEventListener('toggle', refresh, true); media.revert() }
}
