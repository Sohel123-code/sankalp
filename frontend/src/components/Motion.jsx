import { Component, Suspense, lazy, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import TextHoverEffects from './framer/TextHoverEffects'
import ScrollRevealText from './framer/ScrollRevealText'
import { useAuth } from '../context/AuthContext'

const Terrain = lazy(() => import('./framer/WireTerrain'))
const Ascii = lazy(() => import('./framer/AsciiFlowTrail'))
const Liquid = lazy(() => import('./framer/AnimatedLiquidBackground'))

class EffectBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <div className="ambient-fallback" /> : this.props.children }
}

export function FancyButton({ to, children, secondary = false, className = '', ...props }) {
  const { user } = useAuth()
  const accountCTA = user && to === '/registration' && typeof children === 'string' && /register|registration|join/i.test(children) && !/fees/i.test(children)
  if (accountCTA) { to = '/dashboard'; children = 'My profile' }
  const Tag = to ? Link : 'button'
  return <Tag to={to} className={`fancy-button ${secondary ? 'secondary' : ''} ${className}`} {...props}>
    <span>{children}</span>
  </Tag>
}

export function Reveal({ children, className = '', delay = 0, ...props }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start .94', 'start .5'] })
  const y = useTransform(scrollYProgress, [Math.min(delay, .35), 1], [70, 0])
  const opacity = useTransform(scrollYProgress, [Math.min(delay, .35), .85], [0, 1])
  return <motion.div ref={ref} data-scroll-owned className={className}
    style={reduced ? undefined : { y, opacity }} {...props}>{children}</motion.div>
}

export function HoverText({ text, className = '', tag = 'span' }) {
  return <span className={className} aria-label={text}><span aria-hidden="true"><TextHoverEffects text={text} htmlTag={tag}
    preset="Magnetic" color="#f5f1e8" colorRipple accentColor="#ff6b2b" neighborDistance={2}
    font={{ fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 'inherit' }} /></span></span>
}

export function RevealText({ text, className = '' }) {
  return <div className={`reveal-text ${className}`} aria-label={text}><div aria-hidden="true">
    <ScrollRevealText text={text} preset="Soft Words" htmlTag="div" colorHidden="#45413e" colorRevealed="#f5f1e8"
      offsetStart={90} offsetEnd={35} font={{ fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 500, lineHeight: '1.16em', letterSpacing: '-.045em' }} />
  </div></div>
}

export function Ambient({ kind, className = '', liquid = {} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '120px' })
  const reduced = useReducedMotion()
  return <div ref={ref} className={`ambient ambient-${kind} ${className}`} aria-hidden="true">
    <EffectBoundary><Suspense fallback={<div className="ambient-fallback" />}>
      {inView && !reduced && kind === 'terrain' && <Terrain background="#080807" lineColor="#683724" accentColor="#ff7b36" density={38} speed={35} relief={120} scan scanSpeed={40} style={{ width: '100%', height: '100%' }} />}
      {inView && !reduced && kind === 'ascii' && <Ascii glyphDither={{ scale: 95, mix: 70, monochrome: false }} mouseDraw={{ tint: '#ff782e', radius: 45 }} interactivity={{ trackMouse: 18, momentum: 70 }} style={{ width: '100%', height: '100%' }} />}
      {inView && !reduced && kind === 'liquid' && <Liquid preset="custom" color1="#ffd447" color2="#ff6a16" color3="#080807" speed={28} scale={.52} proportion={78} distortion={7} swirl={18} swirlIterations={12} rotation={114} offset={717} shape="Edge" shapeSize={12} softness={100} radius="0px" {...liquid} style={{ width: '100%', height: '100%' }} />}
    </Suspense></EffectBoundary>
  </div>
}

export function CurveSection({ children, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const radius = useTransform(scrollYProgress, [0, .45, 1], ['50% 50% 0 0 / 130px 130px 0 0', '2% 2% 0 0 / 12px 12px 0 0', '0 0 50% 50% / 0 0 120px 120px'])
  return <motion.section ref={ref} className={`curve-section ${className}`} style={{ borderRadius: reduced ? 0 : radius }}>{children}</motion.section>
}

export function TornReveal({ children }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start center'] })
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  return <motion.section ref={ref} className="torn-reveal" style={{ y: reduced ? 0 : y }}>
    <svg className="torn-edge" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40L25 30 40 48 60 20 85 27 100 8 125 35 148 19 165 43 190 26 210 45 235 12 255 19 280 4 300 33 326 20 346 47 365 21 390 31 410 10 438 35 460 18 480 44 505 25 530 7 555 30 580 20 605 49 627 19 650 30 675 12 700 37 726 20 750 45 770 28 795 7 820 34 845 17 870 43 890 24 916 32 940 8 965 27 990 16 1015 44 1040 25 1066 9 1090 30 1115 20 1140 48 1160 24 1185 35 1210 12 1235 30 1260 17 1284 44 1310 25 1335 9 1360 32 1385 20 1410 41 1440 26V70H0Z" fill="currentColor" /></svg>
    {children}
  </motion.section>
}

// Shared pages use staged, reversible scroll reveals.
export { default as PageMotion } from './ScrollPage'
