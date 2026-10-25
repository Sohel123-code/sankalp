import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { WORKSHOPS, OPEN_SUMMIT_LABS } from '../data/sankalpData'

const startOf = time => time.split(/\s*[–-]\s*/)[0]

// One session at a time: a scrubbable time rail drives a large detail stage.
export default function ProgrammeStage({ sessions }) {
  const [active, setActive] = useState(0), [direction, setDirection] = useState(1)
  const rail = useRef(null), reduced = useReducedMotion()
  const count = sessions.length, session = sessions[Math.min(active, count - 1)]
  const go = next => {
    const target = (next + count) % count
    setDirection(target >= active ? 1 : -1); setActive(target)
  }
  useEffect(() => {
    rail.current?.querySelector('[aria-current=step]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced ? 'auto' : 'smooth' })
  }, [active, reduced])
  if (!session) return null
  const onKey = event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); go(active + 1) }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); go(active - 1) }
  }
  const upcoming = [1, 2].map(step => sessions[active + step]).filter(Boolean)
  const isBreak = session.type === 'Break'
  const slide = reduced ? {} : { initial: { opacity: 0, x: 60 * direction }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -60 * direction } }
  return <div className="stage">
    <div className="stage-rail" ref={rail} role="group" aria-label="Session timeline" onKeyDown={onKey}>
      <div className="stage-rail-line" aria-hidden="true"><motion.span animate={{ width: `${count > 1 ? active / (count - 1) * 100 : 100}%` }} transition={{ duration: reduced ? 0 : .5, ease: [.22, 1, .36, 1] }} /></div>
      {sessions.map((item, index) => <button key={item.title} className={`stage-stop ${index <= active ? 'is-past' : ''} ${item.type === 'Break' ? 'is-break' : ''}`} aria-current={index === active ? 'step' : undefined} aria-label={`${item.time}: ${item.title}`} onClick={() => go(index)}>
        <i aria-hidden="true" /><span>{startOf(item.time)}</span>
      </button>)}
    </div>
    <div className="stage-panel">
      <AnimatePresence mode="wait" initial={false}>
        <motion.article key={session.title} className={`stage-card ${isBreak ? 'is-break' : ''}`} transition={{ duration: .3, ease: [.22, 1, .36, 1] }} {...slide}>
          <div className="stage-side">
            <span className="stage-count">{String(active + 1).padStart(2, '0')}<small> / {String(count).padStart(2, '0')}</small></span>
            <span className="stage-time">{session.time}</span><span className="stage-type">{session.type}</span>
          </div>
          <div className="stage-main">
          <h3>{session.title}</h3>
          <p className="stage-location">{session.location}{session.track && ` · ${session.track}`}</p>
          <p className="stage-desc">{session.desc}</p>
          {session.overlapNotice && <p className="stage-note">{session.overlapNotice}</p>}
          {session.type.toLowerCase().includes('workshop') && <div className="stage-rooms">
            {WORKSHOPS.map(w => <div key={w.id}><span>{w.location}</span><strong>{w.title}</strong></div>)}
            <div><span>Main Auditorium · Open Summit</span>{OPEN_SUMMIT_LABS.map(l => <strong key={l.id}>{l.time} · {l.title}</strong>)}</div>
          </div>}
          </div>
        </motion.article>
      </AnimatePresence>
      <div className="stage-controls"><button onClick={() => go(active - 1)} aria-label="Previous session">←</button><span aria-live="polite">{active + 1} of {count}</span><button onClick={() => go(active + 1)} aria-label="Next session">→</button></div>
    </div>
    {upcoming.length > 0 && <div className="stage-next"><span className="tiny-label">UP NEXT</span>{upcoming.map((item, offset) => <button key={item.title} onClick={() => go(active + offset + 1)}><b>{startOf(item.time)}</b><span>{item.title}</span></button>)}</div>}
  </div>
}
