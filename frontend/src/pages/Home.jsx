import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import HeroLiquid from '../components/HeroLiquid'

import { HomeOpening, homeIntroSeen } from '../components/FramerEnhancements'

const SummitHomeContent = lazy(() => import('../components/SummitHomeContent'))

function Hero() {
  const ref = useRef(null), video = useRef(null), reduced = useReducedMotion()
  const [playing, setPlaying] = useState(true)
  const [opening, setOpening] = useState(() => !reduced && !homeIntroSeen())
  const [revealing, setRevealing] = useState(false)
  const revealHero = useCallback(() => setRevealing(true), [])
  // The dots form over the live hero (video and navigation stay visible); the hero text takes over when they finish.
  const introBlocking = opening && !revealing
  const finishOpening = useCallback(() => setOpening(false), [])
  const inView = useInView(ref, { margin: '120px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]), opacity = useTransform(scrollYProgress, [0, .85], [1, 0])
  useEffect(() => {
    const element = video.current
    if (!element) return
    let disposed = false
    const sync = () => {
      if (reduced || !playing || !inView || document.hidden) element.pause()
      else element.play().catch(() => { if (!disposed) setPlaying(false) })
    }
    sync(); document.addEventListener('visibilitychange', sync)
    return () => { disposed = true; element.pause(); document.removeEventListener('visibilitychange', sync) }
  }, [reduced, playing, inView])
  return <section ref={ref} className="summit-hero" aria-label="SANKALP Andhra 2026"><video ref={video} className="hero-video" muted loop playsInline preload="auto" poster="/media/hero-poster-clean.jpg" aria-hidden="true"><source src="/media/hero-light-trails-clean.mp4" type="video/mp4" /></video><div className="hero-shade" /><HeroLiquid heroRef={ref} videoRef={video} enabled={!reduced && !opening && playing && inView} />{opening && <HomeOpening heroRef={ref} onComplete={finishOpening} onReveal={revealHero} />}<motion.div className="hero-content" inert={introBlocking ? true : undefined} aria-hidden={introBlocking || undefined} style={{ y: reduced ? 0 : y, opacity: reduced ? 1 : opacity }}><div className="hero-eyebrow"> ANDHRA PRADESH TECHNOLOGY SUMMIT</div><motion.h1 data-hero-entry initial={reduced ? false : { opacity: 0 }} animate={{ opacity: introBlocking ? 0 : 1 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}><span className="hero-liquid-name">SANKALP</span><span className="hero-subname">ANDHRA <span>2026</span></span></motion.h1><motion.div initial={reduced ? false : { opacity: 0 }} animate={{ opacity: introBlocking ? 0 : 1 }} transition={{ delay: .4, duration: .8 }}><p className="hero-tagline">From research to <em>real-world impact.</em></p></motion.div></motion.div><div className="hero-bottom" inert={introBlocking ? true : undefined} aria-hidden={introBlocking || undefined}><span>ANDHRA PRADESH, INDIA<br /><small>Dates & venue to be announced</small></span><button type="button" className="motion-toggle" onClick={() => setPlaying(v => !v)} disabled={reduced} aria-label={playing ? 'Pause hero animation' : 'Play hero animation'}>{reduced ? 'Motion reduced' : playing ? 'Pause motion' : 'Play motion'}</button></div></section>
}

export default function Home() {
  return <div className="home-page"><Hero /><Suspense fallback={<div className="home-content-loading" role="status">Loading summit details</div>}><SummitHomeContent /></Suspense></div>
}
