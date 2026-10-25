import { Children, Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { buildHeroSnapshot } from '../utils/heroSnapshot'
import TextRevealHelper from './framer/TextRevealHelper'
import TypewriterEffect from './framer/TypewriterEffect'

const loadParticleIntro = () => import('./framer/ParticleIntro')
const ParticleIntro = lazy(loadParticleIntro)
// Start fetching the dot animation as soon as the home page code loads, not when the hero mounts.
loadParticleIntro().catch(() => {})
const Waveslics = lazy(() => import('./framer/Waveslics'))
const DragableCarousel = lazy(() => import('./framer/DragableCarousel'))
const INTRO_KEY = 'sankalp-particle-opening-v3-viewed'

export class VisualBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFailure?.() }
  render() { return this.state.failed ? this.props.fallback || null : this.props.children }
}

function usePageVisible() {
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden)
  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return visible
}

export function homeIntroSeen() {
  try { return sessionStorage.getItem(INTRO_KEY) === 'yes' } catch { return false }
}

export function HomeOpening({ heroRef, onComplete, onReveal }) {
  const reduced = useReducedMotion()
  const [snapshot, setSnapshot] = useState(null)
  useEffect(() => () => { if (snapshot) URL.revokeObjectURL(snapshot.url) }, [snapshot])
  const [leaving, setLeaving] = useState(false)
  const finished = useRef(false)
  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    try { sessionStorage.setItem(INTRO_KEY, 'yes') } catch { /* Storage is optional. */ }
    onReveal?.()
    setLeaving(true)
  }, [onReveal])
  const holdTimer = useRef(0)
  const formed = useCallback(() => { holdTimer.current = window.setTimeout(finish, 250) }, [finish])
  useEffect(() => () => clearTimeout(holdTimer.current), [])
  useEffect(() => {
    if (!leaving) return
    const timer = window.setTimeout(onComplete, reduced ? 0 : 550)
    return () => clearTimeout(timer)
  }, [leaving, onComplete, reduced])
  // The dots assemble the hero's own text, so the heading is never duplicated.
  useEffect(() => {
    if (reduced || !heroRef?.current) return
    let cancelled = false
    buildHeroSnapshot(heroRef.current)
      .then(result => { if (cancelled) URL.revokeObjectURL(result.url); else setSnapshot(result) })
      .catch(() => { if (!cancelled) finish() })
    return () => { cancelled = true }
  }, [heroRef, reduced, finish])
  useEffect(() => {
    if (reduced) { finish(); return }
    // The hero stays reachable if a chunk, canvas or image cannot load.
    const timeout = window.setTimeout(finish, 5000)
    const escape = event => { if (event.key === 'Escape') finish() }
    const skipOnScroll = () => { if (window.scrollY > 40) finish() }
    window.addEventListener('keydown', escape)
    window.addEventListener('scroll', skipOnScroll, { passive: true })
    return () => { clearTimeout(timeout); window.removeEventListener('keydown', escape); window.removeEventListener('scroll', skipOnScroll) }
  }, [finish, reduced])
  return <div className={`home-opening particle-opening${leaving ? ' is-leaving' : ''}`} data-framer-effect="particle-formation" aria-label="SANKALP Andhra 2026">
    <div className="particle-opening-art" aria-hidden="true"><VisualBoundary onFailure={finish}><Suspense fallback={null}>
      {snapshot && <ParticleIntro image={snapshot.url} layoutMode="Fixed" imageWidth={snapshot.width} imageHeight={snapshot.height} particleCount={window.innerWidth < 700 ? 5500 : 9000} particleSize={2} duration={1.2} easing="easeInOutQuad" overrideColor={false} onComplete={formed} onError={finish} />}
    </Suspense></VisualBoundary></div>
  </div>
}

export function ScrollText({ text, className = '' }) {
  const reduced = useReducedMotion()
  return <div className={`reveal-text ${className}`} data-scroll-owned data-framer-effect="text-reveal-helper">
    {reduced ? text : <><span className="effect-sr-only">{text}</span><div aria-hidden="true">
      <TextRevealHelper textComponent={<span>{text}</span>} revealMode="words" startOffset={92} endOffset={42} dimOpacity={.16} />
    </div></>}
  </div>
}

export function TypeLine({ text }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const visible = usePageVisible()
  const reduced = useReducedMotion()
  return <span ref={ref} className="type-line" data-framer-effect="typewriter">
    <span className="type-line-measure">{text}</span>
    <span className="type-line-visual" aria-hidden="true">
      {!reduced && inView && visible ? <TypewriterEffect once words={[{ word: text }]} typingSpeed={42}
        deletingSpeed={60} pauseDuration={1000} cursorColor="#ffd447" cursorWidth={2} cursorHeight={65}
        textColor="inherit" font={{ fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }} /> : text}
    </span>
  </span>
}

export function WaveBackdrop() {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '80px' })
  const visible = usePageVisible()
  const reduced = useReducedMotion()
  return <div ref={ref} className="ambient wave-backdrop" aria-hidden="true" data-framer-effect="waveslics">
    <VisualBoundary><Suspense fallback={null}>
      {inView && visible && !reduced && <Waveslics background="#080807" highlightColor="#ffe18a"
        midColor="#ff9d28" baseColor="#f46b19" shadowColor="#241105" sheenColor="#ffd447"
        glowColor="#ff7b21" glowIntensity={40} slices={48} amplitude={58} speed={.7}
        twistSpeed={.35} tilt={-12} verticalOffset={6} transition={.8} respectReducedMotion />}
    </Suspense></VisualBoundary>
  </div>
}

export function ParticipantCarousel({ children, className }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const element = ref.current
    const observer = new ResizeObserver(() => setWidth(element.getBoundingClientRect().width))
    observer.observe(element)
    setWidth(element.getBoundingClientRect().width)
    return () => observer.disconnect()
  }, [])
  const fallback = <div className={className}>{children}</div>
  return <div ref={ref} className="participant-carousel" data-scroll-owned data-framer-effect="draggable-carousel">
    {reduced || width < 1 ? fallback : <VisualBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <div className="participant-carousel-stage">
          <DragableCarousel items={Children.toArray(children)} preset="Soft Cover" slideWidth={Math.min(320, width * .72)}
            slideHeight={230} gap={24} arrowColor="#ffd447" dotColor="#ffad52" loop={false} autoplay={false}
            label="Showcase participant categories" />
        </div>
        <p className="carousel-instruction">Drag to explore or use the carousel controls</p>
      </Suspense>
    </VisualBoundary>}
  </div>
}
