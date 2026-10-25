import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { TrackArc } from '../components/RequestedEffects'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { TRACKS } from '../data/sankalpData'
import { TRACK_CONTEXT } from '../data/trackContext'

export default function Tracks() {
  const { hash } = useLocation()
  const [activeId, setActiveId] = useState(hash.slice(1) || TRACKS[0].id)
  const [selected, setSelected] = useState('all'), [query, setQuery] = useState('')
  const search = query.trim().toLowerCase()
  const filtered = TRACKS.filter(t => (selected === 'all' || selected === t.id) && [t.title,t.theme,t.description,...t.topics].some(s => s.toLowerCase().includes(search)))
  const activeIndex = Math.max(0, filtered.findIndex(track => track.id === activeId))
  const activeTrack = filtered[activeIndex]
  return <div><PageHeader badge="Technology tracks" title="Four frontiers." subtitle="Explore the technologies shaping research and industry." breadcrumb={[{label:'Tracks'}]} /><div className="section-shell compact-page"><div className="explorer-controls"><div className="filter-pills"><button aria-pressed={selected==='all'} onClick={()=>setSelected('all')}>All tracks</button>{TRACKS.map(t=><button key={t.id} aria-pressed={selected===t.id} onClick={()=>setSelected(t.id)}>{t.shortTitle}</button>)}</div><input type="search" aria-label="Search topics" placeholder="Search research areas…" value={query} onChange={e=>setQuery(e.target.value)} /></div><TrackArc tracks={filtered} active={activeIndex} onSelect={index => setActiveId(filtered[index].id)} /><div data-summit-scene data-scroll-owned className="track-accordions track-arc-details">{filtered.length ? filtered.map((t) => <article id={t.id} key={t.id} className="research-card" hidden={t !== activeTrack}><details className="research-detail" open><summary><div><h2>{t.shortTitle}</h2><p>{t.theme}</p></div><span className="disclosure-toggle" aria-hidden="true"><span className="disclosure-show">Details</span><span className="disclosure-hide">Hide</span></span></summary><div className="research-expanded"><p>{t.description}</p><div className="topic-tags">{t.topics.filter(topic=>!search || topic.toLowerCase().includes(search) || t.title.toLowerCase().includes(search)).map(topic=><span key={topic}>{topic}</span>)}</div><details className="disclosure"><summary>Applications & research context <span className="disclosure-toggle" aria-hidden="true"><span className="disclosure-show">Details</span><span className="disclosure-hide">Hide</span></span></summary><div className="track-context">{[['Applications','focus'],['Considerations','considerations'],['Explore','explore']].map(([label,key])=><div key={key}><span className="tiny-label">{label}</span><p>{TRACK_CONTEXT[t.id][key]}</p></div>)}</div></details><div className="card-links"><Link to="/workshops">Related workshops </Link><Link to="/innovation-challenge">Pitch an idea </Link></div></div></details></article>) : <div className="empty-explorer"><h2>No matching topics found</h2><button onClick={()=>{setSelected('all');setQuery('')}}>Reset Filters</button></div>}</div></div></div>
}
