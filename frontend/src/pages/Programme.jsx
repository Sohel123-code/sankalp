import { useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { useCalmScroll } from '../utils/calmScroll'
import { FancyButton, Reveal } from '../components/Motion'
import { SCHEDULE, WORKSHOPS, OPEN_SUMMIT_LABS } from '../data/sankalpData'
import { groupProgramme } from '../utils/programme'
import ProgrammeStage from '../components/ProgrammeStage'

function Session({ session, index }) {
  const ref = useRef(null)
  const reduced = useCalmScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start .96', 'start .55'] })
  const opacity = useTransform(scrollYProgress, [0, .75], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [70, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [.94, 1])
  return <motion.article ref={ref} className={`agenda-session ${session.type === 'Break' ? 'agenda-break' : ''}`}
    style={{ opacity: reduced ? 1 : opacity, y: reduced ? 0 : y, scale: reduced ? 1 : scale, transformOrigin: 'top center' }}>
    <div className="agenda-marker"><span>{String(index + 1).padStart(2, '0')}</span></div>
    <div className="agenda-session-body">
      <div className="agenda-meta"><span className="agenda-time">{session.time}</span><span className="agenda-type">{session.type}</span></div>
      <h3>{session.title}</h3>
      <span className="agenda-location">{session.location}{session.track && ` · ${session.track}`}</span>
      <details className="disclosure session-description"><summary>Session details <span className="disclosure-toggle" aria-hidden="true"><span className="disclosure-show">Details</span><span className="disclosure-hide">Hide</span></span></summary><p>{session.desc}</p>
        {session.overlapNotice && <p className="agenda-note">{session.overlapNotice}</p>}
      </details>
      {session.overlapNotice && <span className="agenda-overlap">Overlapping session · see details</span>}
      {session.type.toLowerCase().includes('workshop') && <details className="parallel-rooms"><summary>Parallel workshops & open labs <span className="disclosure-toggle" aria-hidden="true"><span className="disclosure-show">Details</span><span className="disclosure-hide">Hide</span></span></summary><div>
        {WORKSHOPS.map(w => <div key={w.id}><span>{w.location}</span><h4>{w.title}</h4></div>)}
        <div><span>Main Auditorium · Open Summit Programme</span>{OPEN_SUMMIT_LABS.map(l => <p key={l.id}><strong>{l.time}</strong><br />{l.title}</p>)}</div>
      </div></details>}
    </div>
  </motion.article>
}

function TimelineChapter({ chapter, day }) {
  const ref = useRef(null), reduced = useCalmScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start .7', 'end .6'] })
  return <section className="agenda-chapter" id={`agenda-${day}-${chapter.id}`} ref={ref} aria-labelledby={`heading-${day}-${chapter.id}`}>
    <div className="agenda-chapter-heading"><span className="tiny-label">{chapter.number} / THE DAY UNFOLDS</span><h2 id={`heading-${day}-${chapter.id}`}>{chapter.title}</h2><span>{chapter.sessions.length} sessions</span></div>
    <div className="agenda-list">
      <div className="agenda-rail" aria-hidden="true"><motion.div style={{ scaleY: reduced ? 1 : scrollYProgress }} /></div>
      {chapter.sessions.map(({ session, index }) => <Session key={session.title} session={session} index={index} />)}
    </div>
  </section>
}

export default function Programme() {
  const [activeDay, setActiveDay] = useState('day1'), [filter, setFilter] = useState('all'), [view, setView] = useState('stage')
  const current = SCHEDULE[activeDay]
  const types = useMemo(() => ['all', ...new Set(current.sessions.map(s => s.type))], [current])
  const chapters = groupProgramme(current.sessions, filter)
  const count = chapters.reduce((sum, chapter) => sum + chapter.sessions.length, 0)
  return <div className="programme-page">
    <PageHeader badge="Programme & Schedule" title="The summit programme." breadcrumb={[{ label: 'Programme' }]} />
    <div className="section-shell programme-body" id="programme-details">
      <div className="programme-status"><span>PROPOSED PROGRAMME</span><details><summary>Dates & schedule status</summary><p>{SCHEDULE.disclaimer}</p></details></div>
      <div className="agenda-layout">
        <aside className="agenda-sidebar"><span className="eyebrow">YOUR SUMMIT JOURNEY</span>
          <div className="agenda-days" aria-label="Programme day">{['day1', 'day2'].map((day, i) => <button key={day} className={activeDay === day ? 'active' : ''} aria-pressed={activeDay === day} onClick={() => { setActiveDay(day); setFilter('all') }}>
            {activeDay === day && <motion.span className="agenda-day-indicator" layoutId="selected-programme-day" transition={{ type: 'spring', stiffness: 260, damping: 30 }} />}
            <span className="agenda-day-number">0{i + 1}</span><div><span>DAY {i + 1}</span><strong>{i === 0 ? 'Discover. Discuss. Connect.' : 'Explore. Build. Pitch.'}</strong><small>{SCHEDULE[day].date}</small></div>
          </button>)}</div>
          <p className="agenda-sidebar-copy">{current.title}</p>
          <nav className="agenda-chapters-nav" aria-label="Jump to time of day">{chapters.map(chapter => <a key={chapter.id} href={`#agenda-${activeDay}-${chapter.id}`}>{chapter.title}</a>)}</nav>
          <span className="tiny-label">ALL TIMES IN IST · SUBJECT TO CONFIRMATION</span><FancyButton to="/registration" secondary>Join the summit</FancyButton>
        </aside>
        <div className="agenda-main">
          <div className="agenda-filter"><label htmlFor="session-filter">Find your moment</label><select id="session-filter" value={filter} onChange={e => setFilter(e.target.value)}>{types.map(t => <option value={t} key={t}>{t === 'all' ? 'All sessions' : t}</option>)}</select><span aria-live="polite">{count} sessions</span>
            <div className="agenda-view" role="group" aria-label="Programme view"><button aria-pressed={view === 'stage'} onClick={() => setView('stage')}>Interactive</button><button aria-pressed={view === 'list'} onClick={() => setView('list')}>Full list</button></div></div>
          {view === 'stage'
            ? <ProgrammeStage key={`${activeDay}-${filter}`} sessions={chapters.flatMap(chapter => chapter.sessions.map(item => item.session))} />
            : <div key={`${activeDay}-${filter}`}>{chapters.map(chapter => <TimelineChapter key={chapter.id} chapter={chapter} day={activeDay} />)}</div>}
        </div>
      </div>
      <Reveal className="agenda-outro"><span className="eyebrow">MAKE ROOM FOR POSSIBILITY</span><h2>Your next idea<br />starts with <em>showing up.</em></h2><FancyButton to="/workshops">Explore hands-on workshops</FancyButton></Reveal>
    </div>
  </div>
}
