import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const DESTINATION = 'Kakinada, Andhra Pradesh, India'
const mapsSearch = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
const mapsRoute = origin => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(DESTINATION)}&travelmode=driving`
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(DESTINATION)}&z=11&output=embed`

// Distances and times are approximate road figures from tourism and institutional guides; sources differ slightly.
const MODES = [
  {
    id: 'air', label: 'By air', summary: 'Fly to Rajahmundry or Visakhapatnam, then continue by road.',
    icon: 'M2 16l20-8-8 12-3-5-5-1zM11 15l-1 5',
    routes: [
      { name: 'Rajahmundry Airport (RJA)', note: 'Nearest airport. Taxis and app cabs run to Kakinada.', distance: '≈ 65 km', time: '1.5–2 h by road', origin: 'Rajahmundry Airport' },
      { name: 'Visakhapatnam Airport (VTZ)', note: 'More flight options. Continue by taxi or bus.', distance: '≈ 155 km', time: '3–3.5 h by road', origin: 'Visakhapatnam Airport' },
    ],
  },
  {
    id: 'rail', label: 'By train', summary: 'Kakinada has its own stations, and Samalkot Junction is the nearby main-line hub.',
    icon: 'M7 3h10a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3l2 3M8 18l-2 3M5 5v10a3 3 0 0 0 3 3M7 14h.01M17 14h.01M6 10h12',
    routes: [
      { name: 'Kakinada Town Railway Station', note: 'The city\'s main station. Bus stand is about 1.5 km away.', distance: 'In the city', time: 'Auto or cab onward', origin: 'Kakinada Town Railway Station' },
      { name: 'Samalkot Junction', note: 'Main-line junction with many long-distance trains. Local trains, buses and cabs reach Kakinada.', distance: '≈ 15–20 km', time: '30–40 min by road', origin: 'Samalkot Junction Railway Station' },
    ],
  },
  {
    id: 'road', label: 'By road', summary: 'Regular APSRTC and private buses, plus taxis and app cabs, serve Kakinada.',
    icon: 'M5 17h14M6 17l1-6h10l1 6M8 17v2M16 17v2M9 11l1-4h4l1 4',
    routes: [
      { name: 'From Rajahmundry', note: 'Frequent buses and shared taxis.', distance: '≈ 65 km', time: '1.5–2 h', origin: 'Rajahmundry' },
      { name: 'From Visakhapatnam', note: 'Direct buses along the coastal highway.', distance: '≈ 155 km', time: '3–3.5 h', origin: 'Visakhapatnam' },
      { name: 'From Vijayawada', note: 'Direct buses and cabs; figures vary by route.', distance: '≈ 200 km', time: '4–5 h', origin: 'Vijayawada' },
    ],
  },
]

export default function TravelRoutes() {
  const [active, setActive] = useState(0), reduced = useReducedMotion()
  const mode = MODES[active]
  const onKey = event => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (active + step + MODES.length) % MODES.length
    setActive(next)
    event.currentTarget.querySelectorAll('button')[next]?.focus()
  }
  return <div className="tr">
    <div className="tr-main">
      <div className="tr-modes" role="tablist" aria-label="Ways to reach Kakinada" onKeyDown={onKey}>
        {MODES.map((item, index) => <button key={item.id} role="tab" id={`tr-tab-${item.id}`} aria-selected={index === active} aria-controls="tr-panel" tabIndex={index === active ? 0 : -1} onClick={() => setActive(index)}>
          {index === active && <motion.span className="tr-indicator" layoutId="tr-active" transition={{ type: 'spring', stiffness: 320, damping: 32 }} />}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={item.icon} /></svg>
          <span>{item.label}</span>
        </button>)}
      </div>
      <div className="tr-panel" id="tr-panel" role="tabpanel" aria-labelledby={`tr-tab-${mode.id}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={mode.id} initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -10 }} transition={{ duration: .25, ease: [.22, 1, .36, 1] }}>
            <p className="tr-summary">{mode.summary}</p>
            <ul className="tr-routes">{mode.routes.map(route => <li key={route.name}>
              <div><h3>{route.name}</h3><p>{route.note}</p></div>
              <dl><div><dt>Distance</dt><dd>{route.distance}</dd></div><div><dt>Travel</dt><dd>{route.time}</dd></div></dl>
              <a href={mapsRoute(route.origin)} target="_blank" rel="noreferrer">Directions <span aria-hidden="true">↗</span><span className="effect-sr-only"> from {route.origin} to Kakinada in Google Maps (opens in a new tab)</span></a>
            </li>)}</ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    <aside className="tr-map" aria-label="Kakinada on Google Maps">
      <iframe title="Map of Kakinada, Andhra Pradesh" src={MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      <div className="tr-map-actions">
        <a className="tr-primary" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(DESTINATION)}&travelmode=driving`} target="_blank" rel="noreferrer">Navigate to Kakinada <span aria-hidden="true">↗</span><span className="effect-sr-only"> in Google Maps, opens in a new tab</span></a>
        <a href={mapsSearch(DESTINATION)} target="_blank" rel="noreferrer">Open in Google Maps <span className="effect-sr-only">(opens in a new tab)</span></a>
      </div>
    </aside>
  </div>
}
