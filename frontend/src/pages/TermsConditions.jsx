import PageHeader from '../components/PageHeader'
import { SUMMIT_INFO, CONTACT_INFO } from '../data/sankalpData'
import styles from './Policy.module.css'

export default function TermsConditions() {
  return (
    <div className={styles.page}>
      <PageHeader
        badge="Legal &amp; Governance"
        title="Terms &amp; Conditions"
        subtitle="Standard terms of participation, registration eligibility, workshop criteria, and intellectual property provisions for SANKALP Andhra 2026."
        breadcrumb={[{ label: 'Terms & Conditions' }]}
      />

      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.calloutBanner}>
            <span className={styles.calloutIcon}>📜</span>
            <p>
              Please read these Terms &amp; Conditions carefully. By registering, attending, exhibiting, or submitting intellectual materials to <strong>{SUMMIT_INFO.name}</strong>, you agree to comply with all provisions set forth below.
            </p>
          </div>

          <div className={styles.section}>
            <h2>1. Event Identity &amp; Organiser</h2>
            <p>
              <strong>{SUMMIT_INFO.name}</strong> ({SUMMIT_INFO.officialDescription}) is organized to foster research translation, deep-tech skills, and industry-academia collaborations in Andhra Pradesh, India. All administrative notices emanate from the official organizing secretariat.
            </p>
          </div>

          <div className={styles.section}>
            <h2>2. Registration, Verification &amp; Eligibility</h2>
            <ul>
              <li>Registration passes are personal, non-transferable without prior secretariat approval, and tied to the designated delegate category.</li>
              <li>Delegates registering under student or faculty rates must present a valid government-recognized institutional ID card at physical registration counters. Failure to provide verification may result in entry refusal or re-classification to full industry rates.</li>
              <li>The organizers reserve the right to revoke passes or refuse admission to any party providing fraudulent accreditation.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>3. Proposed Fees, Taxes &amp; GST Invoicing</h2>
            <p>
              All fee amounts published in preliminary documents represent proposed estimates. Official GST invoices detailing applicable statutory taxes, HSN codes, and input credit will be provided upon gateway launch and payment confirmation.
            </p>
          </div>

          <div className={styles.section}>
            <h2>4. Programme Changes &amp; Rescheduling</h2>
            <p>
              While every effort is made to adhere to the announced schedule, the organizers reserve the right to modify session timings, keynote speakers, room allocations, or workshop facilitators without prior individual liability due to unforeseen academic, logistical, or governmental circumstances.
            </p>
          </div>

          <div className={styles.section}>
            <h2>5. Workshop Attendance &amp; Certification Criteria</h2>
            <ul>
              <li>Specialist workshop attendance requires a valid base summit pass in addition to the workshop add-on pass.</li>
              <li>Official Certificates of Workshop Completion are awarded exclusively to attendees who actively participate in the scheduled laboratory hours and submit the required practical exercise output.</li>
              <li>Attendees are solely responsible for bringing computing hardware adhering to stated minimum requirements (charged laptop and chargers).</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>6. Innovation Challenge &amp; Intellectual Property (IP)</h2>
            <ul>
              <li>Participants in the SANKALP Innovation Challenge retain full ownership of their underlying patents, source code, and design prototypes.</li>
              <li>By submitting a proposal, teams warrant that their submission does not infringe upon third-party copyrights, patents, or trade secrets.</li>
              <li>Presenting concepts in public pitching rooms constitutes public disclosure. Participants intending to file formal patent applications are advised to secure provisional patent protection prior to the summit.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>7. Funding &amp; Investment Disclaimers</h2>
            <p>
              Participation in the Innovation Challenge, Technology Showcase, or Investor &amp; Industry Connect does not guarantee grant funding, incubator admission, venture investment, or government procurement contracts. Bilateral negotiations occur strictly between independent parties at their sole discretion.
            </p>
          </div>

          <div className={styles.section}>
            <h2>8. Photography, Audio-Visual Recording &amp; Publicity</h2>
            <p>
              The summit organizers, accredited media, and authorized partners may document proceedings via photography, video recording, and live streaming. By attending, delegates grant permission for non-commercial educational, archival, and promotional usage of event footage.
            </p>
          </div>

          <div className={styles.section}>
            <h2>9. Venue Safety, Conduct &amp; Liability</h2>
            <p>
              Delegates must conduct themselves professionally, respect institutional campus decorum, and adhere to venue health and safety protocols. The organizers assume no liability for personal loss, theft of hardware, or transit disruptions.
            </p>
          </div>

          <div className={styles.section}>
            <h2>10. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms &amp; Conditions are governed by and construed in accordance with the laws of the Republic of India. Any legal disputes arising in connection with the summit shall be subject to the exclusive jurisdiction of the competent courts in Andhra Pradesh, India.
            </p>
          </div>

          <div className={styles.metaFooter}>
            <span>Document Reference: SANKALP-AP-TNC-2026-V1</span>
            <span>Secretariat Inquiries: {CONTACT_INFO.generalEmail}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
