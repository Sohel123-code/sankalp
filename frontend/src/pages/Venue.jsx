import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { VENUE_INFO, CONTACT_INFO } from '../data/sankalpData'
import KakinadaPlaces from '../components/KakinadaPlaces'
import TravelRoutes from '../components/TravelRoutes'
import styles from './Venue.module.css'

export default function Venue() {
  const [notified, setNotified] = useState(false)
  const [email, setEmail] = useState('')

  const handleNotifySubmit = (e) => {
    e.preventDefault()
    setNotified(true)
  }

  return (
    <div className={styles.page}>
      <PageHeader
        badge="Location &amp; Logistics"
        title="Venue &amp; Travel Guide"
        subtitle="Planning your journey to Andhra Pradesh for SANKALP 2026. Explore regional connectivity, airport transit, and campus facilities."
        breadcrumb={[{ label: 'Venue & Travel' }]}
      />

      <div data-summit-scene className={styles.container}>
        {/* ── Status Disclaimer Banner ── */}
        <div className={styles.statusBanner}>
          <span className={styles.statusIcon}></span>
          <div className={styles.statusBody}>
            <strong>{VENUE_INFO.status}</strong>
            <p>
              The proposed two-day summit will be held at a premier academic or convention campus in Andhra Pradesh, India. Final venue selection, official address, campus map links, and confirmed event dates will be announced upon formal state clearance.
            </p>
          </div>
        </div>

        {/* ── Venue Overview ── */}
        <section data-summit-scene className={styles.venueSection}>
          <div data-reveal-heading className={styles.sectionHeader}>
            <span className={styles.secEye}>Campus Architecture</span>
            <h2 className={styles.secTitle}>Proposed Campus Facilities</h2>
            <p className={styles.secDesc}>{VENUE_INFO.description}</p>
          </div>

          <div className={styles.facilitiesGrid}>
            {VENUE_INFO.sections.map((sec, i) => (
              <div key={i} data-reveal-card className={styles.facCard}>
                <span className={styles.facIcon}>{sec.icon}</span>
                <h3 className={styles.facTitle}>{sec.title}</h3>
                <details className="disclosure"><summary>Details <span className="disclosure-toggle" aria-hidden="true"><span className="disclosure-show">Details</span><span className="disclosure-hide">Hide</span></span></summary><p className={styles.facDesc}>{sec.desc}</p></details>
              </div>
            ))}
          </div>
        </section>

        {/* ── Transit & Travel Connectivity ── */}
        <section data-summit-scene className={styles.travelSection}>
          <div data-reveal-heading className={styles.sectionHeader}>
            <span className={styles.secEye}>Transit Options</span>
            <h2 className={styles.secTitle}>Reaching Andhra Pradesh?</h2>
            <p className={styles.secDesc}>
              Centrally connected across domestic and regional transportation networks.
            </p>
          </div>

          <div className={styles.travelGrid}>
            {VENUE_INFO.travelGuidance.map((item, i) => (
              <div key={i} data-reveal-card className={styles.travelCard}>
                <span className={styles.tNum}>0{i + 1}</span>
                <h3 className={styles.tTitle}>{item.title}</h3>
                <details className="disclosure"><summary>Travel details <span className="disclosure-toggle" aria-hidden="true"><span className="disclosure-show">Details</span><span className="disclosure-hide">Hide</span></span></summary><p className={styles.tDesc}>{item.detail}</p></details>
              </div>
            ))}
          </div>
        </section>

        {/* ── Top tourist places near Kakinada ── */}
        <section className="kk-section" aria-labelledby="kk-title">
          <span className="eyebrow">EXPLORE KAKINADA</span>
          <h2 id="kk-title">Top tourist places near Kakinada</h2>
          <p className="kk-lede">Extend your trip: mangrove boardwalks, an island by boat, the beach, an ancient temple and a coastal village, all within a day trip of the city. Distances are approximate.</p>
          <KakinadaPlaces />
        </section>

        {/* ── How to reach Kakinada ── */}
        <section className="kk-section" aria-labelledby="tr-title">
          <span className="eyebrow">GETTING THERE</span>
          <h2 id="tr-title">How to reach Kakinada</h2>
          <p className="kk-lede">There are three ways to reach Kakinada: by air, by train and by road. Pick one below, then open the route in Google Maps. The final venue is still to be announced, so directions lead to Kakinada city.</p>
          <TravelRoutes />
        </section>

        {/* ── Venue Access, Security & Travel Assistance ── */}
        <div className={styles.twoCol}>
          <div className={styles.boxCard}>
            <h3 className={styles.boxH3}> Security, Badges &amp; Accessibility</h3>
            <ul className={styles.rulesList}>
              <li>
                <strong>Entry and ID:</strong> Badge and identification requirements will be announced with the approved venue.
              </li>
              <li>
                <strong>Accessibility:</strong> Verified step-free routes and assistance arrangements will be published before the event.
              </li>
              <li>
                <strong>Luggage:</strong> Storage facilities and arrival arrangements are to be confirmed.
              </li>
              <li>
                <strong>First Aid &amp; Support:</strong> Emergency assistance locations and support contacts will be announced by the organisers.
              </li>
            </ul>
          </div>

          <div className={styles.boxCardNotify}>
            <h3 className={styles.boxH3}> Venue Confirmation Alerts</h3>
            <p className={styles.notifyDesc}>
              Venue, transport and accommodation guidance will be published after verification. You can preview your interest below.
            </p>

            {notified ? (
              <div className={styles.notifySuccess}>
                <span className={styles.checkIcon}></span>
                <h4>Interest preview ready</h4>
                <p>Your entered email is <strong>{email}</strong>. No subscription has been created. Official announcement arrangements are to be confirmed.</p>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className={styles.notifyForm}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={styles.notifyInput}
                />
                <button type="submit" className={styles.btnNotify}>
                  Notify Me on Confirmation
                </button>
              </form>
            )}

            <div className={styles.deskContact}>
              <span>Direct Travel Support:</span>
              <strong>{CONTACT_INFO.generalEmail}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
