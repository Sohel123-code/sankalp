import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const BASE = `${import.meta.env.BASE_URL}media/kakinada/`
const photo = (file, alt) => ({ src: `${BASE}${file}.jpg`, alt })

// Distances are approximate road or boat distances from Kakinada and vary by source.
const PLACES = [
  {
    id: 'coringa', name: 'Coringa Wildlife Sanctuary', kind: 'Mangrove sanctuary',
    blurb: 'Walk wooden boardwalks through dense mangroves on the Godavari delta. The sanctuary shelters the Indian marsh crocodile and many wetland birds, and boats cruise its tidal creeks.',
    facts: [['From Kakinada', '15–20 km, Yanam road'], ['Best for', 'Boardwalk, boat ride, birds']],
    photos: [photo('coringa-1', 'Wooden boardwalk winding through green mangroves at Coringa'), photo('coringa-2', 'Mangrove trees on the water\'s edge at Coringa with egrets standing in the shallows')],
  },
  {
    id: 'hope-island', name: 'Hope Island', kind: 'Sand-spit island',
    blurb: 'A long, narrow sand spit in the Bay of Bengal that shelters Kakinada Bay. Boat trips from the Kakinada coast pass the breakwater, ships at anchor and old jetties on the way to the island.',
    facts: [['Reached by', 'Boat from the Kakinada coast'], ['Boat ride', 'About 45 minutes, per operators']],
    photos: [photo('hope-island-1', 'Concrete tetrapod breakwater seen from the water near Hope Island'), photo('hope-island-2', 'Cargo ship with cranes at anchor in Kakinada Bay'), photo('hope-island-3', 'Tourist boat moored at a jetty with waves in the foreground')],
  },
  {
    id: 'kakinada-beach', name: 'Kakinada Beach', kind: 'Coastline',
    blurb: 'A shoreline of about 15 km that runs from the port towards Uppada. Rocky stretches, surf and a calm blue evening skyline make it the city\'s favourite place to unwind. Vakalpudi Lighthouse stands near the port.',
    facts: [['Shoreline', 'About 15 km'], ['Best for', 'Sunset, sea breeze, evening walks']],
    photos: [photo('kakinada-beach-1', 'Waves breaking along a rocky stretch of Kakinada Beach under a blue sky'), photo('kakinada-beach-2', 'Aerial view of a long pier crossing the beach into the sea'), photo('kakinada-beach-3', 'Kakinada coast at dusk with lights along the horizon')],
  },
  {
    id: 'bhavanarayana', name: 'Sri Bhavanarayana Swamy Temple', kind: 'Heritage temple · Sarpavaram',
    blurb: 'A Vishnu temple at Sarpavaram with a richly carved gopuram. Inscriptions record gifts from the Eastern Chalukyas, the Chola king Kulottunga and the Reddi kings. It is a protected ancient monument and busiest in the month of Magha.',
    facts: [['From Kakinada', 'About 5 km'], ['Dedicated to', 'Lord Vishnu']],
    photos: [photo('bhavanarayana-temple', 'Sculpted white gopuram of the Bhavanarayana Swamy Temple at Sarpavaram')],
  },
  {
    id: 'uppada', name: 'Uppada Beach & Village', kind: 'Coastal village',
    blurb: 'A fishing village on the Bay of Bengal, a short drive up the coast. Uppada is also famous for its Jamdani silk sarees, which hold a Geographical Indication tag and are woven by hand in the village.',
    facts: [['From Kakinada', 'About 20 km along the coast'], ['Known for', 'Beach, Uppada Jamdani silk']],
    photos: [photo('uppada', 'Blue sea and sky at Uppada beach')],
  },
]

// Five expanding panels: one is open at a time, and a place with several photos cycles through them.
export default function KakinadaPlaces() {
  const [active, setActive] = useState(0), [shot, setShot] = useState(0), [hold, setHold] = useState(false)
  const reduced = useReducedMotion()
  const place = PLACES[active]
  const choose = index => { setActive(index); setShot(0) }
  useEffect(() => {
    if (reduced || hold || place.photos.length < 2) return
    const timer = setInterval(() => setShot(current => (current + 1) % place.photos.length), 4200)
    return () => clearInterval(timer)
  }, [place, reduced, hold])
  return <div className="kk" onPointerEnter={event => { if (event.pointerType === 'mouse') setHold(true) }} onPointerLeave={() => setHold(false)}>
    {PLACES.map((item, index) => {
      const open = index === active
      return <article key={item.id} className={`kk-panel${open ? ' is-open' : ''}`} onPointerEnter={event => { if (event.pointerType === 'mouse' && !open) choose(index) }}>
        <button type="button" className="kk-hit" aria-expanded={open} aria-controls={`kk-body-${item.id}`} onClick={() => choose(index)}><span className="effect-sr-only">{item.name}</span></button>
        {item.photos.map((image, photoIndex) => <img key={image.src} className={`kk-photo${open && photoIndex === shot ? ' is-shown' : ''}${!open && photoIndex === 0 ? ' is-cover' : ''}`} src={image.src} alt={open && photoIndex === shot ? image.alt : ''} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />)}
        <div className="kk-shade" aria-hidden="true" />
        <span className="kk-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className="kk-rail-title" aria-hidden="true">{item.name}</span>
        <div className="kk-body" id={`kk-body-${item.id}`} hidden={!open}>
          <span className="kk-kind">{item.kind}</span>
          <h3>{item.name}</h3>
          <p>{item.blurb}</p>
          <dl>{item.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          {item.photos.length > 1 && <div className="kk-dots" role="group" aria-label={`${item.name} photos`}>{item.photos.map((image, photoIndex) => <button key={image.src} type="button" aria-label={`Show photo ${photoIndex + 1} of ${item.photos.length}`} aria-pressed={photoIndex === shot} onClick={event => { event.stopPropagation(); setShot(photoIndex) }} />)}</div>}
        </div>
      </article>
    })}
  </div>
}
