import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TRACKS, SCHEDULE, TARGET_AUDIENCE, WORKSHOPS } from '../data/sankalpData'
import { FancyButton } from './Motion'
import SummitSection from './SummitSection'
import SummitStory from './SummitStory'
import { ScrollText } from './FramerEnhancements'

const chapters = [['introduction', 'The summit'], ['tracks', 'Tracks'], ['programme', 'Programme'], ['workshops', 'Workshops'], ['participate', 'Participate']]

function Marquee({ items, reverse = false }) {
  const row = items.map(item => <span key={item}>{item}<i aria-hidden="true" /></span>)
  return <div className={`summit-marquee ${reverse ? 'is-reverse' : ''}`} aria-hidden="true"><div className="summit-marquee-track" data-marquee>{row}{row}{row}</div></div>
}

export default function SummitHomeContent() {
  const root = useRef(null), reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    let disposed = false, release
    import('../utils/homeMotion').then(({ mountHomeMotion }) => {
      if (!disposed && root.current) release = mountHomeMotion(root.current)
    }).catch(error => console.warn('Home motion unavailable; content remains visible.', error))
    return () => { disposed = true; release?.() }
  }, [reduced])
  const [trackIndex, setTrackIndex] = useState(0)
  const [day, setDay] = useState('day1')
  const track = TRACKS[trackIndex]
  const sessions = day === 'day1' ? [2, 4, 9] : [2, 11, 12]
  return <div className="summit-home-content" ref={root}>
    <nav className="home-chapters section-shell" aria-label="Homepage chapters">{chapters.map(([id, label]) => <a href={`#chapter-${id}`} key={id}>{label}</a>)}</nav>
    <div className="section-shell">
      <div id="discover" /><SummitStory />
      <SummitSection id="chapter-tracks" index="01" label="Technology tracks" title="Four fields. Shared possibilities." intro="Explore research frontiers and their applications across industry and society.">
        <div className="summit-track-explorer"><div className="frontier-tabs">{TRACKS.map((item,index)=><button key={item.id} aria-pressed={index===trackIndex} onClick={()=>setTrackIndex(index)}><span>{item.shortTitle}</span><small>{index===trackIndex ? 'Exploring this track' : 'Explore track'}</small></button>)}</div>
          <div className="summit-track-stage" data-track-stage><div className="frontier-preview summit-track-preview" key={track.id}><div><span className="eyebrow">Research in focus</span><h3>{track.shortTitle}</h3><p>{track.topics.slice(0,2).join(' and ')}</p><details className="disclosure"><summary>Research themes</summary><p>{track.theme}</p><ul className="summit-research-topics">{track.topics.slice(0,4).map(topic=><li key={topic}>{topic}</li>)}</ul></details><Link className="editorial-link" to={`/tracks#${track.id}`}>Explore research areas</Link></div></div></div></div>
      </SummitSection>
      <Marquee items={TRACKS.map(item => item.shortTitle)} />
      <SummitSection id="chapter-programme" index="02" label="Proposed programme" title="A considered two-day journey." intro="From strategic dialogue to practical exploration. All timings are in IST and subject to confirmation.">
        <div className="summit-programme-preview"><div className="day-selector">{['day1','day2'].map((key,index)=><button key={key} aria-pressed={day===key} className={day===key?'selected':''} onClick={()=>setDay(key)}><span>Day {index+1}</span><div>{index ? 'Build & collaborate' : 'Discover & connect'}<small>{SCHEDULE[key].date}</small></div></button>)}<Link to="/programme" className="editorial-link">View the full programme</Link></div>
          <div className="preview-sessions">{sessions.map(index=><div className="summit-preview-session" key={`${day}-${index}`}><span>{SCHEDULE[day].sessions[index].time}</span><h3>{SCHEDULE[day].sessions[index].title}</h3><small>{SCHEDULE[day].sessions[index].location}</small></div>)}</div></div>
      </SummitSection>
      <SummitSection id="chapter-workshops" index="03" className="summit-workshop-feature"><div className="summit-workshop-list"><span className="eyebrow">Specialist workshop programme</span>{WORKSHOPS.map(workshop=><div key={workshop.id}><h3>{workshop.title}</h3><p>{workshop.location}</p><small>{workshop.time}</small></div>)}</div><div><span className="eyebrow">Workshops & open summit labs</span><h2>Make room<br />for making.</h2><p>Four specialist workshops. Three open labs. Practical skills.</p><details className="disclosure"><summary>What you can explore</summary><p>AI agents, quantum machine learning, digital twins and biomedical analytics.</p></details><FancyButton to="/workshops">Explore workshops</FancyButton><small>Proposed Day 2 programme. Eligibility and fees subject to confirmation.</small></div></SummitSection>
      <Marquee reverse items={['Research', 'Industry', 'Innovation', 'Collaboration']} />
      <SummitSection id="chapter-audience" index="04" label="Who should attend" title="Different perspectives. Common ground."><div className="summit-audience-grid">{TARGET_AUDIENCE.map(item=><details key={item.role}><summary>{item.role}<span>Details</span></summary><p>{item.desc}</p></details>)}</div></SummitSection>
      <SummitSection id="chapter-participate" index="05" label="Participation" title="Find your place at SANKALP."><div className="summit-participation-grid">{[['Innovation Challenge','Present an idea across the four technology tracks.','/innovation-challenge'],['Research Showcase','Share your research, prototype or technology demonstration.','/showcase'],['Investor & Industry Connect','Explore conversations, industry needs and potential collaboration.','/investor-connect'],['Partnerships','Contribute expertise, institutional support or industry perspectives.','/partners']].map(([title,copy,to])=><Link key={to} to={to}><h3>{title}</h3><p>{copy}</p><span>Explore opportunities</span></Link>)}</div></SummitSection>
      <SummitSection className="summit-closing"><span className="eyebrow">SANKALP Andhra 2026</span><h2><ScrollText text="Bring your research. Build the next possibility." /></h2><div><FancyButton to="/registration">Register your interest</FancyButton><Link className="editorial-link" to="/contact">Contact the organising team</Link></div><p>Dates and venue to be announced.</p></SummitSection>
    </div>
  </div>
}
