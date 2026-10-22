import { Link } from 'react-router-dom'
import { SUMMIT_INFO, CONTACT_INFO } from '../data/sankalpData'
import styles from './Footer.module.css'

const QUICK_LINKS = [
  { label: 'About the Summit', to: '/about' },
  { label: 'Technology Tracks', to: '/tracks' },
  { label: 'Programme & Schedule', to: '/programme' },
  { label: 'Workshops & Labs', to: '/workshops' },
  { label: 'Innovation Challenge', to: '/innovation-challenge' },
  { label: 'Investor & Industry Connect', to: '/investor-connect' },
  { label: 'Research Showcase', to: '/showcase' },
  { label: 'Speakers & Experts', to: '/speakers' },
  { label: 'Partners & Sponsorship', to: '/partners' },
  { label: 'Registration & Fees', to: '/registration' },
  { label: 'Venue & Travel', to: '/venue' },
  { label: 'FAQs', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

const POLICY_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Cancellation & Refund Policy', to: '/cancellation-refund' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Top Banner Notice */}
      <div className={styles.topNotice}>
        <div className={styles.noticeInner}>
          <span className={styles.noticeBadge}>Proposed Summit</span>
          <p className={styles.noticeText}>
            {SUMMIT_INFO.statusNotice}
          </p>
        </div>
      </div>

      <div className={styles.inner}>
        {/* Brand Column */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} aria-label="SANKALP Andhra 2026">
            <span className={styles.logoIcon}>S</span>
            <div className={styles.logoTextGroup}>
              <span className={styles.logoTitle}>{SUMMIT_INFO.name}</span>
              <span className={styles.logoSubtitle}>{SUMMIT_INFO.officialDescription}</span>
            </div>
          </Link>

          <p className={styles.themeBadge}>
            Theme: <strong>{SUMMIT_INFO.tagline}</strong>
          </p>

          <p className={styles.tagline}>
            {SUMMIT_INFO.supportingDescription}
          </p>

          <div className={styles.metaPill}>
            <span>📍 {SUMMIT_INFO.venue}</span>
            <span>📅 {SUMMIT_INFO.dates}</span>
          </div>

          <div className={styles.socials}>
            <span className={styles.socialLabel}>Connect:</span>
            {CONTACT_INFO.socials.map(s => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label={s.platform}
                title={s.platform}
              >
                <span>{s.icon}</span> {s.platform}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Summit Navigation</h3>
          <ul className={styles.colGrid}>
            {QUICK_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className={styles.colLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies and Governance */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Policies &amp; Legal</h3>
          <ul className={styles.colList}>
            {POLICY_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className={styles.colLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.quickContactBox}>
            <h4 className={styles.contactBoxTitle}>Secretariat Enquiries</h4>
            <p className={styles.contactBoxText}>{CONTACT_INFO.generalEmail}</p>
            <p className={styles.contactBoxSub}>{CONTACT_INFO.phone}</p>
            <Link to="/contact" className={styles.contactBtn}>Contact Desk →</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p>© 2026 {SUMMIT_INFO.name}. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link to="/privacy-policy">Privacy</Link>
            <span>•</span>
            <Link to="/terms">Terms</Link>
            <span>•</span>
            <Link to="/cancellation-refund">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
