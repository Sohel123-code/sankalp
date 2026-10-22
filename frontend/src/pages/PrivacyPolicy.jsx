import PageHeader from '../components/PageHeader'
import { SUMMIT_INFO, CONTACT_INFO } from '../data/sankalpData'
import styles from './Policy.module.css'

export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      <PageHeader
        badge="Legal &amp; Compliance"
        title="Privacy Policy"
        subtitle="How SANKALP Andhra 2026 collects, protects, processes, and respects delegate, researcher, and sponsor data."
        breadcrumb={[{ label: 'Privacy Policy' }]}
      />

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.calloutBanner}>
            <span className={styles.calloutIcon}>🛡️</span>
            <p>
              This Privacy Policy outlines data handling practices for <strong>{SUMMIT_INFO.name}</strong>. By accessing our registration portal, submitting pitch dossiers, or enrolling in workshops, you consent to the practices described herein.
            </p>
          </div>

          <div className={styles.section}>
            <h2>1. Information We Collect</h2>
            <p>
              We collect information directly from you when you register for the summit, submit an innovation idea, or request partnership briefings:
            </p>
            <ul>
              <li><strong>Contact &amp; Identification Data:</strong> Full name, institutional or company affiliation, email address, mobile telephone number, and professional role.</li>
              <li><strong>Academic &amp; Student Verification:</strong> Institutional ID card copies, enrollment numbers, or faculty affiliation credentials required for discounted tiers.</li>
              <li><strong>Submission Content:</strong> Problem statements, prototype descriptions, source code URLs, and venture pitch decks submitted for the Innovation Challenge or Showcase.</li>
              <li><strong>Technical &amp; Log Data:</strong> IP address, browser type, device information, and session timestamps collected to secure the web portal.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>2. Purpose of Data Processing</h2>
            <p>Your personal and organizational data is utilized strictly for summit-related operations, including:</p>
            <ul>
              <li>Processing delegate registration passes and generating physical/digital access credentials.</li>
              <li>Coordinating specialist workshop enrollments, software sandbox provisioning, and certificate issuance.</li>
              <li>Managing academic screening and pitch scheduling for the SANKALP Innovation Challenge.</li>
              <li>Matching startups and researchers with potential partners during Investor &amp; Industry Connect sessions.</li>
              <li>Transmitting essential logistics advisories, venue schedule changes, and security bulletins.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>3. Payment &amp; Financial Information</h2>
            <p>
              All registration and workshop transactions are processed through authorized, PCI-DSS compliant third-party payment gateways. SANKALP Andhra 2026 does not store credit/debit card numbers, CVVs, or net-banking credentials on its application servers.
            </p>
          </div>

          <div className={styles.section}>
            <h2>4. Data Sharing &amp; Third Parties</h2>
            <p>
              We do not sell, rent, or lease delegate information. Data may be shared only under the following limited operational circumstances:
            </p>
            <ul>
              <li><strong>Accredited Venue &amp; Security Services:</strong> For campus gate entry verification, parking clearance, and disaster management protocols.</li>
              <li><strong>Academic Juries &amp; Reviewers:</strong> Anonymized or team dossiers shared under confidentiality agreements for pitch evaluation.</li>
              <li><strong>Statutory Authorities:</strong> If required by Indian law, public safety regulations, or valid governmental order.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>5. Data Retention &amp; Security</h2>
            <p>
              We maintain robust administrative, physical, and technical safeguards including encryption at rest and in transit (TLS 1.3), hashed passwords, and tokenized JWT sessions. Delegate records are retained only as long as necessary to fulfill summit certification, audit requirements, and state compliance.
            </p>
          </div>

          <div className={styles.section}>
            <h2>6. User Rights &amp; Consent Withdrawal</h2>
            <p>
              You possess the right to inspect, correct, or request deletion of your personal contact records prior to physical badge printing. To exercise these rights or lodge a privacy inquiry, contact the Data Protection Officer at <strong>{CONTACT_INFO.generalEmail}</strong>.
            </p>
          </div>

          <div className={styles.section}>
            <h2>7. Cookies &amp; Portal Analytics</h2>
            <p>
              Our website employs minimal, privacy-centric cookies strictly for session persistence, authentication state management, and anonymous traffic aggregation. We do not use third-party behavioral advertising trackers.
            </p>
          </div>

          <div className={styles.metaFooter}>
            <span>Document Reference: SANKALP-AP-PRIV-2026-V1</span>
            <span>Last Updated: October 2026</span>
          </div>
        </div>
      </div>
    </div>
  )
}
