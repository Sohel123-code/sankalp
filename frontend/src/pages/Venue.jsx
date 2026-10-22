import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { VENUE_INFO, CONTACT_INFO } from '../data/sankalpData'
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

      <div className={styles.container}>
        {/* ── Status Disclaimer Banner ── */}
        <div className={styles.statusBanner}>
          <span className={styles.statusIcon}>📍</span>
          <div className={styles.statusBody}>
            <strong>{VENUE_INFO.status}</strong>
            <p>
              The proposed two-day summit will be held at a premier academic or convention campus in Andhra Pradesh, India. Final venue selection, official address, campus map links, and confirmed event dates will be announced upon formal state clearance.
            </p>
          </div>
        </div>

        {/* ── Venue Overview ── */}
        <section className={styles.venueSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Campus Architecture</span>
            <h2 className={styles.secTitle}>Proposed Campus Facilities</h2>
            <p className={styles.secDesc}>{VENUE_INFO.description}</p>
          </div>

          <div className={styles.facilitiesGrid}>
            {VENUE_INFO.sections.map((sec, i) => (
              <div key={i} className={styles.facCard}>
                <span className={styles.facIcon}>{sec.icon}</span>
                <h3 className={styles.facTitle}>{sec.title}</h3>
                <p className={styles.facDesc}>{sec.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Transit & Travel Connectivity ── */}
        <section className={styles.travelSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Transit Options</span>
            <h2 className={styles.secTitle}>Reaching Andhra Pradesh</h2>
            <p className={styles.secDesc}>
              Centrally connected across domestic and regional transportation networks.
            </p>
          </div>

          <div className={styles.travelGrid}>
            {VENUE_INFO.travelGuidance.map((item, i) => (
              <div key={i} className={styles.travelCard}>
                <span className={styles.tNum}>0{i + 1}</span>
                <h3 className={styles.tTitle}>{item.title}</h3>
                <p className={styles.tDesc}>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Venue Access, Security & Travel Assistance ── */}
        <div className={styles.twoCol}>
          <div className={styles.boxCard}>
            <h3 className={styles.boxH3}>🛡️ Security, Badges &amp; Accessibility</h3>
            <ul className={styles.rulesList}>
              <li>
                <strong>Badge Checkpoints:</strong> Physical RFID or barcode summit badges must be visibly displayed at all auditorium and lab entrance points.
              </li>
              <li>
                <strong>Wheelchair Access:</strong> All proposed main auditoriums, workshop halls, and dining facilities feature step-free ramps and elevator access.
              </li>
              <li>
                <strong>Luggage Cloakroom:</strong> Secure baggage storage available near the Registration Foyer for delegates arriving directly from airport/rail transit.
              </li>
              <li>
                <strong>First Aid &amp; Health Desk:</strong> Dedicated campus paramedic station and ambulance standby available throughout summit operating hours.
              </li>
            </ul>
          </div>

          <div className={styles.boxCardNotify}>
            <h3 className={styles.boxH3}>🔔 Venue Confirmation Alerts</h3>
            <p className={styles.notifyDesc}>
              Want to receive immediate notification the moment the official venue campus, hotel partner discount codes, and transit schedules are announced?
            </p>

            {notified ? (
              <div className={styles.notifySuccess}>
                <span className={styles.checkIcon}>✅</span>
                <h4>You are on the alert list!</h4>
                <p>We will email <strong>{email}</strong> as soon as the venue and calendar dates are approved.</p>
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
