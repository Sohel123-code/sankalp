import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
const groups = [
  ['Discover', [['/about','About SANKALP'],['/tracks','Technology tracks'],['/programme','Programme'],['/speakers','Speakers & experts']]],
  ['Participate', [['/workshops','Workshops & labs'],['/innovation-challenge','Innovation Challenge'],['/showcase','Research showcase'],['/investor-connect','Investor connect'],['/partners','Partnerships']]],
  ['Plan your visit', [['/registration','Registration & fees'],['/venue','Venue & travel'],['/faq','FAQs'],['/contact','Contact']]],
]
// A lit letter travels left to right, then back from the last letter, with a short rest before each loop.
const WAVE_STEP_MS = 380, WAVE_GAP_STEPS = 3
export default function Footer() {
  const markRef = useRef(null)
  useEffect(() => {
    const mark = markRef.current
    if (!mark || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const masks = [...mark.children], last = masks.length - 1
    const path = [...masks.keys(), ...[...masks.keys()].slice(1, last).reverse(), ...Array(WAVE_GAP_STEPS).fill(-1)]
    let step = 0, timer = 0
    const tick = () => {
      masks.forEach(el => el.classList.remove('is-lit'))
      masks[path[step++ % path.length]]?.classList.add('is-lit')
    }
    const start = () => { if (!timer) { tick(); timer = setInterval(tick, WAVE_STEP_MS) } }
    const stop = () => { clearInterval(timer); timer = 0; masks.forEach(el => el.classList.remove('is-lit')) }
    const watcher = new IntersectionObserver(([entry]) => entry.isIntersecting ? start() : stop())
    watcher.observe(mark)
    return () => { watcher.disconnect(); stop() }
  }, [])
  return <footer className="site-footer summit-footer"><div className="section-shell"><div className="summit-footer-main"><div className="summit-footer-brand"><p>SANKALP <span>ANDHRA 2026</span></p><small>From Research to Real-World Impact</small><p className="summit-footer-status">Proposed technology summit.<br />Dates and venue to be announced.</p></div>{groups.map(([title,links])=><nav key={title} aria-label={`${title} footer links`}><h2>{title}</h2>{links.map(([to,label])=><Link key={to} to={to}>{label}</Link>)}</nav>)}</div><div className="summit-footer-wordmark" ref={markRef} aria-hidden="true">{[...'SANKALP'].map((letter,index)=><span className="summit-letter-mask" key={index}><span data-letter>{letter}</span></span>)}</div><div className="footer-bottom"><small>2026 SANKALP Andhra</small><nav aria-label="Policies"><Link to="/privacy-policy">Privacy policy</Link><Link to="/terms">Terms & conditions</Link><Link to="/cancellation-refund">Cancellation & refunds</Link></nav></div></div></footer>
}
