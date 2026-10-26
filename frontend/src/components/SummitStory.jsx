import { useEffect, useRef } from 'react'
import { useCalmScroll } from '../utils/calmScroll'
import { TRACKS } from '../data/sankalpData'

const facts = [
  ['02', 'Summit days', 'Research, industry dialogue and hands-on exploration in a proposed two-day programme.'],
  ['04', 'Technology tracks', 'Artificial intelligence, quantum technologies, intelligent manufacturing and precision health.'],
  ['04', 'Specialist workshops', 'Practical sessions that connect technical ideas with experiments, workflows and prototypes.'],
  ['03', 'Open summit labs', 'A separate programme of hands-on activities for delegates outside the specialist workshops.'],
]

export default function SummitStory() {
  const ref = useRef(null)
  const reduced = useCalmScroll()
  useEffect(() => {
    if (reduced) return
    let disposed = false, release
    import('../utils/referenceMotion').then(({ mountSummitStory })=>{
      if (!disposed && ref.current) release = mountSummitStory(ref.current)
    }).catch(()=>{})
    return ()=>{disposed=true; release?.()}
  }, [reduced])
  return <section id="chapter-introduction" ref={ref} className="summit-story" data-scroll-owned aria-labelledby="summit-story-title">
    <div className="summit-story-stage"><div className="summit-story-opening"><div className="summit-story-heading"><span className="eyebrow">The Andhra Pradesh Technology Summit</span><h2 id="summit-story-title">Research. People.<br /><em>Possibility.</em></h2><p>Connecting research, industry and higher education.</p></div><div className="summit-story-montage">{TRACKS.map(track=><article className="summit-track-summary" key={track.id}><span className="tiny-label">Technology track</span><h3>{track.shortTitle}</h3><p>{track.topics.slice(0,3).join(' · ')}</p></article>)}</div></div>
      <div className="summit-story-facts"><div className="summit-story-summary"><span className="eyebrow">Summit at a glance</span><h3>From research to<br />real-world impact.</h3><p>Andhra Pradesh Technology Summit</p><small>Dates and venue to be announced.</small></div><div className="summit-story-panels">{facts.map(([number,title,copy],index)=><div key={title} className="summit-story-panel" data-story-step={index}><span className="summit-story-number">{number}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></div>
    </div>
  </section>
}
