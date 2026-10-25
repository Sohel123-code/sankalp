import { lazy, Suspense, useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { FancyButton } from './Motion'
import { VisualBoundary } from './FramerEnhancements'
import '../styles/workshop-cards.css'

const SwipeCardStack = lazy(() => import('./framer/SwipeCardStack'))

function WorkshopDetails({ item, kind }) {
  return <details className="workshop-card-details">
    <summary><span>{kind === 'workshop' ? 'Workshop details' : 'Lab details'}</span><span className="disclosure-toggle" aria-hidden="true"><span className="disclosure-show">Details</span><span className="disclosure-hide">Hide</span></span></summary>
    <div className="workshop-card-expanded">
      {kind === 'workshop' ? <>
        <p>{item.title}</p>
        <span className="tiny-label">WHAT YOU'LL DO</span>
        <ul>{item.activities.map(activity => <li key={activity}>{activity}</li>)}</ul>
        <span className="tiny-label">YOUR OUTPUT</span><p>{item.expectedOutput}</p>
        <span className="tiny-label">WHO IT'S FOR</span><p>{item.eligibility}</p>
        <FancyButton to="/registration" secondary>Registration details</FancyButton>
      </> : <>
        <p>{item.focus}</p><span className="tiny-label">YOUR OUTPUT</span><p>{item.output}</p>
        <small>Open for summit attendees</small>
      </>}
    </div>
  </details>
}

function WorkshopCard({ item, kind }) {
  return <article id={item.id} className="workshop-visual-card" aria-labelledby={`title-${item.id}`}>
    <div className="workshop-card-copy">
      {item.location && <span className="tiny-label">{item.location}</span>}
      <h2 id={`title-${item.id}`}>{item.cardTitle || item.title}</h2>
      <p className="workshop-card-time">{item.time}</p>
      <div className="workshop-card-outcome"><span className="tiny-label">Expected output</span><p>{kind === 'workshop' ? item.expectedOutput : item.output}</p></div>
      <WorkshopDetails item={item} kind={kind} />
    </div>
  </article>
}

export default function WorkshopCards({ items, kind = 'workshop' }) {
  const [view, setView] = useState('grid')
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const cards = useMemo(() => items.map(item => ({
    eyebrow: item.location || 'Open summit lab', title: item.cardTitle || item.title,
    description: `${item.time}\n\n${kind === 'workshop' ? item.expectedOutput : item.output}`, background: '#100e0a',
  })), [items, kind])
  const grid = <div className="workshop-card-grid">{items.map((item, index) => <WorkshopCard key={item.id} item={item} index={index} kind={kind} />)}</div>
  const selected = items[active] || items[0]
  const single = view === 'swipe' && !reduced
  return <div data-summit-scene className="workshop-collection" data-scroll-owned data-workshop-cards>
    {!reduced && <div className="workshop-view-options" role="group" aria-label="Browse cards">
      <button type="button" aria-pressed={!single} onClick={() => setView('grid')}>View all</button>
      <button type="button" aria-pressed={single} onClick={() => { setActive(0); setView('swipe') }}>Swipe through</button>
    </div>}
    {single ? <VisualBoundary fallback={grid}><Suspense fallback={grid}>
      <div className="workshop-swipe-layout" data-framer-effect="swipe-card-stack">
        <div>
          <div className="workshop-swipe-stage">
            <SwipeCardStack cards={cards} label={kind === 'workshop' ? 'Specialist workshops' : 'Open summit labs'}
              onIndexChange={setActive}
              stack={{ visibleCards: 3, rotation: 2, padding: '20px 20px 72px', cardWidth: 96, cardHeight: 96, aspectRatio: '4 / 5', offsetY: 8 }}
              interaction={{ autoplay: false, swipeThreshold: 65, swipeRotation: 10, exitDuration: .36 }}
              cardStyle={{ radius: '16px', borderWidth: 1, borderColor: '#a8713244', overlayStrength: .92, shadow: '0 18px 50px #0005' }}
              typography={{ padding: '24px', titleColor: '#f5eee4', eyebrowColor: '#ffbf77', descriptionColor: '#d3c2ae', titleFont: { fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,32px)', lineHeight: '1.18', fontWeight: 600, letterSpacing: '-.035em' } }}
              ui={{ buttonSize: 44, buttonBackground: '#19130d', buttonColor: '#f1e3d3', buttonBorder: '1px solid #805c3944', buttonRadius: '8px', counterBackground: 'transparent', counterColor: '#b9aa97', inset: 6 }} />
          </div>
          <p className="workshop-swipe-hint">Swipe a card, use the buttons, or press the arrow keys.</p>
        </div>
        <article key={selected.id} id={selected.id} className="workshop-swipe-detail">
          <span className="tiny-label">{selected.location || 'Open summit lab'}</span>
          <h2 aria-live="polite">{selected.cardTitle || selected.title}</h2>
          <p className="workshop-card-time">{selected.time}</p>
          <WorkshopDetails item={selected} kind={kind} />
        </article>
      </div>
    </Suspense></VisualBoundary> : grid}
  </div>
}
