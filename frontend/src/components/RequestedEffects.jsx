import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TRACKS } from '../data/sankalpData'
import { VisualBoundary, ScrollText } from './FramerEnhancements'
import ScrollZoomReveal from './framer/ScrollZoomReveal'

const CubeBend = lazy(() => import('./framer/CubeBend'))
const ScrollingWaveText = lazy(() => import('./framer/ScrollingWaveText'))
const InfiniteScroll = lazy(() => import('./framer/InfiniteScroll'))
const PanoramaCarousel = lazy(() => import('./framer/PanoramaCarousel'))
// Wall panels of the Three.js tunnel: real track topics, drawn locally as canvas textures.
const tunnelLabels = TRACKS.flatMap(track => track.topics.slice(0, 4))

function useWide() {
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const query = matchMedia('(min-width: 900px) and (min-height: 680px)')
    const update = () => setWide(query.matches)
    update(); query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return wide
}

function usePhone() {
  const [phone, setPhone] = useState(false)
  useEffect(() => {
    const query = matchMedia('(max-width: 700px)')
    const update = () => setPhone(query.matches)
    update(); query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return phone
}

export function WorkshopMotionIntro() {
  const reduced = useReducedMotion()
  const wide = useWide()
  return <>
    <ScrollZoomReveal><span className="eyebrow">From knowledge to practice</span><h2>Build. Test. Discover.</h2><p>Four specialist workshops. Three open summit labs.</p><a className="editorial-link" href="#workshop-options">Explore the workshops</a></ScrollZoomReveal>
    <div className="workshop-wave" data-effect-owned data-scroll-owned data-framer-effect="scrolling-wave-text">
      {reduced || !wide ? <ScrollText text="Learn together. Build what comes next." /> : <VisualBoundary fallback={<ScrollText text="Learn together. Build what comes next." />}><Suspense fallback={<p>Learn together. Build what comes next.</p>}>
        <ScrollingWaveText text="Learn together. Build what comes next." font={{ fontFamily: 'inherit', fontWeight: 500 }} fontSizeVw={9} scrollScreens={1.6} panelScale={.88} panelRadius={24} waveHeight={2} bgStart="#080807" bgEnd="#171009" textStart="#ffae68" textEnd="#ffd77c" hoverLift={5} riseDistance={-60} />
      </Suspense></VisualBoundary>}
    </div>
  </>
}

export function FoldedContent({ children, label }) {
  const wide = useWide(), reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(true)
  const active = wide && !reduced && enabled
  return <div className="folded-content" data-framer-effect="cube-bend" data-effect-owned data-scroll-owned>
    {wide && !reduced && <button className="effect-view-toggle" onClick={() => setEnabled(value => !value)}>{enabled ? 'Show full list' : 'Show folding view'}</button>}
    {!active ? children : <VisualBoundary fallback={children}><Suspense fallback={children}><CubeBend content={children} label={label} zone={65} angle={44} rounding={50} segments={3} tilt={.08} tumble={0} showScrollbar zIndex={1} style={{ height: 'min(620px, 72svh)', width: '100%' }} /></Suspense></VisualBoundary>}
  </div>
}

export function ResearchTunnel() {
  const ref = useRef(null), inView = useInView(ref, { margin: '120px' })
  const reduced = useReducedMotion(), wide = useWide()
  const progress = useMotionValue(0)
  useEffect(() => {
    if (reduced) return
    let disposed = false, cleanup
    import('../utils/researchTunnelMotion').then(({ mountResearchTunnel }) => {
      if (!disposed && ref.current) cleanup = mountResearchTunnel(ref.current, progress)
    }).catch(() => { /* Readable normal-flow content is the fallback. */ })
    return () => { disposed = true; cleanup?.() }
  }, [reduced, progress])
  return <section ref={ref} className="research-tunnel" aria-label="Four connected technology frontiers" data-framer-effect="infinite-scroll" data-effect-owned data-scroll-owned>
    <div className="research-tunnel-stage">
      <div className="research-tunnel-art" aria-hidden="true">{inView && wide && !reduced && <VisualBoundary><Suspense fallback={null}><InfiniteScroll customImages={tunnelLabels} progress={progress} /></Suspense></VisualBoundary>}</div>
      <span className="eyebrow research-tunnel-label">Four connected frontiers</span>
      <div className="research-tunnel-copy"><h2>Research without boundaries.</h2><p>AI. Quantum. Manufacturing. Precision health.</p></div>
      <div className="research-frontiers">{TRACKS.map((track, index) => <article className="research-frontier" key={track.id}>
        <span className="eyebrow">Frontier {index + 1} of {TRACKS.length}</span><h3>{track.shortTitle}</h3>
        <p>{track.topics.slice(0, 2).join(' and ')}</p><Link className="editorial-link" to={`/tracks#${track.id}`}>Explore this frontier</Link>
      </article>)}</div>
      <a className="research-tunnel-continue" href="#summit-objectives">Continue to summit objectives</a>
    </div>
  </section>
}

export function TrackArc({ tracks, active, onSelect }) {
  const reduced = useReducedMotion(), phone = usePhone()
  const ref = useRef(null), inView = useInView(ref, { amount: .25 })
  const [paused, setPaused] = useState(false), [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden)
  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  const playing = !paused && !focused && visible && inView && !reduced
  const fallback = <div className="track-arc-static">{tracks.map((track, index) => <button key={track.id} onClick={() => onSelect(index)} aria-pressed={active === index}><span className="eyebrow">Technology track</span><h2>{track.shortTitle}</h2><p>{track.theme}</p><span>Explore this track</span></button>)}</div>
  // SVG panorama labels become too small on phones. Keep the same tracks as
  // native, readable cards with horizontal touch scrolling and explicit selection.
  if (phone && !reduced && tracks.length > 1) return <div ref={ref} className="track-arc phone-track-swiper" data-effect-owned data-scroll-owned><p className="track-swipe-label">Swipe through the tracks. Select a card for research details.</p>{fallback}</div>
  if (reduced || tracks.length < 2) return <div ref={ref} className="track-arc" data-effect-owned data-scroll-owned>{fallback}</div>
  const items = tracks.map(track => ({ image: { src: `${import.meta.env.BASE_URL}media/tracks/${track.id}.svg`, alt: `${track.shortTitle}: ${track.theme}` } }))
  return <div ref={ref} className="track-arc" data-effect-owned data-scroll-owned data-framer-effect="panorama-carousel">
    <VisualBoundary fallback={fallback}><Suspense fallback={fallback}><div className="track-arc-stage" onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}><PanoramaCarousel items={items} autoplay={playing} speed={5} direction="left" pauseOnHover draggable momentum={.6} tileHeight={phone ? 72 : 66} maxWidth={phone ? 82 : 55} aspectRatio={1.25} gap={4} radius="20px" axis={50} curve={phone ? 40 : 68} fade={0} placeholder="#14100b" /></div></Suspense></VisualBoundary>
    <div className="arc-toolbar"><div className="arc-controls" role="group" aria-label="Choose a technology track">{tracks.map((track, index) => <button key={track.id} aria-pressed={active === index} onClick={() => onSelect(index)}>{track.shortTitle}</button>)}</div><button className="arc-playback" aria-label={paused ? 'Play automatic track rotation' : 'Stop automatic track rotation'} onClick={() => setPaused(value => !value)}>{paused ? 'Play' : 'Stop'}</button></div>
  </div>
}
