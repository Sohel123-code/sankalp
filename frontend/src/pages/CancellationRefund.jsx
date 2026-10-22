import PageHeader from '../components/PageHeader'
import { SUMMIT_INFO, CONTACT_INFO } from '../data/sankalpData'
import styles from './Policy.module.css'

export default function CancellationRefund() {
  return (
    <div className={styles.page}>
      <PageHeader
        badge="Registration Policies"
        title="Cancellation &amp; Refund Policy"
        subtitle="Provisional cancellation provisions, delegate substitution rules, and event rescheduling protocols for SANKALP Andhra 2026."
        breadcrumb={[{ label: 'Cancellation & Refund' }]}
      />

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.calloutBanner}>
            <span className={styles.calloutIcon}>⚠️</span>
            <p>
              <strong>Notice Regarding Policy Approval Status:</strong> The source document does not specify final refund rules. The guidelines outlined below represent proposed institutional standards and must be formally approved prior to payment collection.
            </p>
          </div>

          <div className={styles.section}>
            <h2>1. Proposed Cancellation Window</h2>
            <p>
              Once payments are officially enabled, delegates will be subject to a tiered cancellation window to accommodate venue catering and personalized delegate kit manufacturing commitments:
            </p>
            <ul>
              <li><strong>More than 30 Days Prior to Summit:</strong> Eligible for an 80% refund of the base registration fee (20% retained towards banking and administrative processing overheads).</li>
              <li><strong>15 to 30 Days Prior to Summit:</strong> Eligible for a 50% refund of the base registration fee.</li>
              <li><strong>Less than 15 Days Prior to Summit:</strong> Non-refundable due to finalized institutional seating, kit procurement, and banquet reservations.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>2. Specialist Workshop Add-On Cancellations</h2>
            <p>
              Specialist masterclasses have strict laboratory seating caps (maximum 60 seats per hall). Workshop fee add-ons become non-refundable 14 calendar days prior to Day 2 to allow waitlisted scholars to fill vacant laboratory terminals.
            </p>
          </div>

          <div className={styles.section}>
            <h2>3. SANKALP Innovation Challenge Pitch Fees</h2>
            <p>
              Submission fees for idea evaluation (₹200 for students / ₹500 for industry) cover administrative and academic screening overheads and are strictly non-refundable once the submission dossier has entered the jury review cycle.
            </p>
          </div>

          <div className={styles.section}>
            <h2>4. Delegate Name Substitutions</h2>
            <p>
              If a registered delegate is unable to attend due to illness or institutional conflict, transfer of registration to a colleague of the identical delegate category (e.g., student to student, faculty to faculty) is permitted free of charge up to 72 hours prior to the summit inauguration, subject to written notice to <strong>{CONTACT_INFO.registrationEmail}</strong>.
            </p>
          </div>

          <div className={styles.section}>
            <h2>5. Event Postponement or Force Majeure</h2>
            <p>
              In the unlikely event of summit postponement or date alterations due to governmental directives, extreme weather, or circumstances of Force Majeure:
            </p>
            <ul>
              <li>All registered passes will be automatically transferred to the rescheduled calendar dates.</li>
              <li>Delegates unable to attend on the rescheduled dates will be entitled to a full 100% refund upon written application within 14 days of date notification.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>6. Media Consent &amp; Session Recording Protocol</h2>
            <p>
              Delegates, speakers, and workshop participants acknowledge that sessions, exhibitions, and galas will be professionally recorded, photographed, and broadcast. Attendees who require visual privacy or non-disclosure of classified research prototypes must register their request with the secretariat desk upon morning check-in.
            </p>
          </div>

          <div className={styles.metaFooter}>
            <span>Document Reference: SANKALP-AP-REFUND-DRAFT-V1</span>
            <span>Support Desk: {CONTACT_INFO.registrationEmail}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
