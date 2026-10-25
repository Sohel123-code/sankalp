import { useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Ambient } from './Motion'
import { LIQUID_HEROES } from '../data/heroThemes'
import HeroMesh from './HeroMesh'
import { WaveBackdrop, TypeLine } from './FramerEnhancements'

const treatments = { '/tracks': 'terrain' }
const concise = {
  '/programme': ['The summit programme.', 'Two proposed days of discovery, dialogue and hands-on learning.'],
  '/innovation-challenge': ['Ideas take the stage.', 'Pitch your innovation across four technology tracks.'],
  '/investor-connect': ['Connect for impact.', 'Meet industry, investors and research collaborators.'],
  '/speakers': ['Meet the minds.', 'Speakers and experts will be announced after confirmation.'],
  '/partners': ['Build with us.', 'Explore partnership and sponsorship opportunities.'],
  '/showcase': ['Research, in action.', 'A stage for prototypes, discoveries and emerging technologies.'],
  '/registration': ['Plan your participation.', 'Explore proposed delegate fees, workshops and group options.'],
  '/venue': ['Your summit destination.', 'Venue and travel details will follow the official announcement.'],
  '/faq': ['Good questions.', 'The essentials for planning your SANKALP experience.'],
  '/contact': ['Let’s connect.', 'Find the right desk for your summit enquiry.'],
}
const labels = { '/about': 'THE VISION', '/tracks': 'THE FRONTIERS', '/programme': 'THE EXPERIENCE', '/workshops': 'THE MAKERS', '/innovation-challenge': 'THE NEXT BIG IDEA', '/investor-connect': 'THE CONNECTIONS', '/speakers': 'THE VOICES', '/partners': 'THE COLLABORATORS', '/showcase': 'THE POSSIBILITIES', '/registration': 'YOUR NEXT CHAPTER', '/venue': 'THE DESTINATION', '/faq': 'GOOD QUESTIONS', '/contact': 'LET’S TALK' }

export default function PageHeader({ badge, title, subtitle, backgroundImage }) {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  const copy = concise[pathname]
  if (copy) { title = copy[0]; subtitle = copy[1] }
  const liquid = LIQUID_HEROES[pathname]
  return <section id="page-top" className={`page-intro intro-${pathname.slice(1)} ${liquid ? 'intro-liquid' : ''}`}>
    {backgroundImage ? <img className="intro-image" src={backgroundImage} alt="" /> : pathname === '/programme' ? <WaveBackdrop /> : liquid ? <Ambient kind="liquid" liquid={liquid} /> : treatments[pathname] ? <Ambient kind={treatments[pathname]} /> : <div className="intro-graphic" aria-hidden="true"><i /><i /><i /><i /><i />{(pathname === '/about' || pathname === '/dashboard') && <HeroMesh scale={pathname === '/about' ? .7 : 1} pointerStrength={pathname === '/dashboard' ? 1.4 : .35} />}</div>}
    <div className="intro-overlay" />
    <div className="section-shell intro-inner">
      <motion.div data-hero-entry initial={reduced ? false : { opacity: 1, y: '-100vh' }} animate={{ opacity: 1, y: '0vh' }} transition={{ duration: 1.35, ease: [.22, 1, .36, 1] }}>
        <span className="eyebrow">{badge}</span><h1>{title}</h1>{subtitle && <p>{pathname === '/contact' ? <TypeLine text={subtitle} /> : subtitle}</p>}
      </motion.div>
      <div className="intro-index"><span>{labels[pathname] || 'SANKALP ANDHRA 2026'}</span><a href="#page-details" onClick={e => { e.preventDefault(); const section = e.currentTarget.closest(".page-intro").nextElementSibling; section?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }) }}>EXPLORE </a></div>
    </div>
  </section>
}
