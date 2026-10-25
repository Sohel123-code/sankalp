import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FancyButton } from './Motion'

// Specialist workshops: pick one from the list, read it in a single focused panel.
export function WorkshopExplorer({ items }) {
  const [active, setActive] = useState(0), reduced = useReducedMotion()
  const item = items[active]
  const onKey = event => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (active + step + items.length) % items.length
    setActive(next)
    event.currentTarget.querySelectorAll('button')[next]?.focus()
  }
  return <div className="wx-explorer">
    <div className="wx-list" role="tablist" aria-label="Specialist workshops" aria-orientation="vertical" onKeyDown={onKey}>
      {items.map((workshop, index) => <button key={workshop.id} role="tab" id={`tab-${workshop.id}`} aria-selected={index === active} aria-controls="wx-panel" tabIndex={index === active ? 0 : -1} onClick={() => setActive(index)}>
        {index === active && <motion.span className="wx-list-indicator" layoutId="wx-active" transition={{ type: 'spring', stiffness: 300, damping: 32 }} />}
        <b>{String(index + 1).padStart(2, '0')}</b>
        <span><strong>{workshop.cardTitle}</strong><small>{workshop.track} · {workshop.location}</small></span>
      </button>)}
    </div>
    <div className="wx-panel" id="wx-panel" role="tabpanel" aria-labelledby={`tab-${item.id}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.article key={item.id} initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -12 }} transition={{ duration: .28, ease: [.22, 1, .36, 1] }}>
          <div className="wx-chips"><span>{item.number}</span><span>{item.location}</span><span>{item.time}</span></div>
          <h2>{item.title}</h2>
          <span className="tiny-label">WHAT YOU'LL DO</span>
          <ul className="wx-activities">{item.activities.map((activity, index) => <li key={activity}><i aria-hidden="true">{index + 1}</i>{activity}</li>)}</ul>
          <div className="wx-outcome">
            <div><span className="tiny-label">YOU LEAVE WITH</span><p>{item.expectedOutput}</p></div>
            <div><span className="tiny-label">WHO IT'S FOR</span><p>{item.eligibility}</p></div>
          </div>
          <FancyButton to="/registration" secondary>Registration details</FancyButton>
        </motion.article>
      </AnimatePresence>
    </div>
  </div>
}

// Open labs: three sessions laid out in running order.
export function LabTrack({ items }) {
  return <div className="wx-labs">{items.map((lab, index) => <article key={lab.id} className="wx-lab">
    <span className="wx-lab-step" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    <span className="wx-lab-time">{lab.time.replace(' (Day 2)', '')}</span>
    <h2>{lab.title}</h2>
    <p>{lab.focus}</p>
    <div><span className="tiny-label">YOU LEAVE WITH</span><p>{lab.output}</p></div>
    <small>Open for summit attendees</small>
  </article>)}</div>
}

// Checklist the participant can tick off, with a readiness bar.
export function ReadinessChecklist({ items }) {
  const [done, setDone] = useState(() => new Set())
  const toggle = index => setDone(previous => { const next = new Set(previous); next.has(index) ? next.delete(index) : next.add(index); return next })
  const ready = done.size === items.length
  return <div className="wx-check">
    <div className="wx-check-head"><div><h2>Are you ready for Day 2?</h2><p>Tick each item as you prepare. This list is only for you; nothing is saved.</p></div>
      <div className="wx-check-meter" aria-live="polite"><strong>{done.size}/{items.length}</strong><span>{ready ? 'All set' : 'ready'}</span></div></div>
    <div className="wx-check-bar" aria-hidden="true"><motion.span animate={{ width: `${done.size / items.length * 100}%` }} /></div>
    <ul>{items.map((requirement, index) => <li key={requirement}><label className={done.has(index) ? 'is-done' : ''}><input type="checkbox" checked={done.has(index)} onChange={() => toggle(index)} /><span aria-hidden="true" />{requirement}</label></li>)}</ul>
  </div>
}

// The half-day, as a running order.
export function WorkshopRhythm({ steps }) {
  return <ol className="wx-rhythm">{steps.map(([time, activity], index) => <li key={time} className={/break/i.test(activity) ? 'is-break' : ''}>
    <span className="wx-rhythm-dot" aria-hidden="true">{index + 1}</span><span className="tiny-label">{time}</span><h3>{activity}</h3>
  </li>)}</ol>
}
