import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { PARTNERS_INFO, TRACKS } from '../data/sankalpData'
import styles from './Partners.module.css'

export default function Partners() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    organization: '',
    contactPerson: '',
    role: '',
    workEmail: '',
    phone: '',
    partnershipType: 'knowledge',
    trackId: 'ai',
    proposedContribution: '',
    message: '',
    privacyConsent: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className={styles.page}>
      <PageHeader
        badge="Collaborative Ecosystem"
        title="Partners &amp; Institutional Sponsorship"
        subtitle="Join hands with Andhra Pradesh's premier technology summit to empower student talent, co-host specialist labs, and drive regional commercialisation."
        breadcrumb={[{ label: 'Partners & Sponsorship' }]}
      />

      <div className={styles.container}>
        {/* ── Governance Notice ── */}
        <div className={styles.governanceNotice}>
          <span className={styles.govIcon}>🛡️</span>
          <div className={styles.govBody}>
            <strong>Partnership Governance Protocol:</strong>
            <p>{PARTNERS_INFO.notice}</p>
          </div>
        </div>

        {/* ── Potential Partnership Types ── */}
        <section className={styles.typesSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Engagement Modes</span>
            <h2 className={styles.secTitle}>Seven Strategic Partnership Avenues</h2>
            <p className={styles.secDesc}>
              Flexible, value-oriented collaboration frameworks designed for academic societies, technology multinationals, and regional industrial leaders.
            </p>
          </div>

          <div className={styles.typesGrid}>
            {PARTNERS_INFO.types.map((type, idx) => (
              <div key={type.id} className={styles.typeCard}>
                <span className={styles.typeNum}>0{idx + 1}</span>
                <h3 className={styles.typeTitle}>{type.name}</h3>
                <p className={styles.typeDesc}>{type.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Potential Benefits ── */}
        <section className={styles.benefitsSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Mutual Value</span>
            <h2 className={styles.secTitle}>Why Partner With SANKALP 2026?</h2>
          </div>

          <div className={styles.benefitsGrid}>
            {PARTNERS_INFO.benefits.map((benefit, i) => (
              <div key={i} className={styles.benefitCard}>
                <span className={styles.bIcon}>✦</span>
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Partnership Enquiry Form ── */}
        <section className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <span className={styles.secEye}>Direct Enquiry</span>
              <h2 className={styles.formH2}>Partnership Enquiry Form</h2>
              <p className={styles.formSubtitle}>
                Submit your organisation details below. Our corporate relations and sponsorship secretariat will provide the official partnership prospectus and schedule a briefing.
              </p>
            </div>

            {submitted ? (
              <div className={styles.successState}>
                <span className={styles.successIcon}>🎉</span>
                <h3>Enquiry Successfully Received</h3>
                <p>
                  Thank you, <strong>{formData.contactPerson}</strong>. Your expression of interest on behalf of{' '}
                  <strong>{formData.organization}</strong> has been logged.
                </p>
                <p className={styles.successSub}>
                  A partnership prospectus dossier will be delivered to <strong>{formData.workEmail}</strong>.
                </p>
                <button
                  className={styles.btnReset}
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.enquiryForm}>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label>Organisation / Corporate Name *</label>
                    <input
                      type="text"
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g. Acme DeepTech Labs Pvt Ltd"
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Contact Person Name *</label>
                    <input
                      type="text"
                      name="contactPerson"
                      required
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="e.g. Smt. K. Bhavani"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label>Designation / Role *</label>
                    <input
                      type="text"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g. Director, University Partnerships"
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Work Email Address *</label>
                    <input
                      type="email"
                      name="workEmail"
                      required
                      value={formData.workEmail}
                      onChange={handleChange}
                      placeholder="corporate@domain.com"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label>Phone / WhatsApp Number (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Partnership Type *</label>
                    <select
                      name="partnershipType"
                      value={formData.partnershipType}
                      onChange={handleChange}
                    >
                      {PARTNERS_INFO.types.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Primary Relevant Technology Track *</label>
                  <select
                    name="trackId"
                    value={formData.trackId}
                    onChange={handleChange}
                  >
                    <option value="cross">Cross-Summit / Multiple Tracks</option>
                    {TRACKS.map(t => (
                      <option key={t.id} value={t.id}>
                        Track {t.number}: {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Proposed Contribution / Collaboration Mode *</label>
                  <textarea
                    name="proposedContribution"
                    required
                    rows={3}
                    value={formData.proposedContribution}
                    onChange={handleChange}
                    placeholder="e.g. Cloud credits for student labs, sponsorship of keynote session, supply of industrial datasets..."
                  />
                </div>

                <div className={styles.field}>
                  <label>Additional Message / Brief Remarks</label>
                  <textarea
                    name="message"
                    rows={2}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any specific timelines, questions, or requirements..."
                  />
                </div>

                <div className={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    id="partnerPrivacy"
                    name="privacyConsent"
                    required
                    checked={formData.privacyConsent}
                    onChange={handleChange}
                  />
                  <label htmlFor="partnerPrivacy">
                    I consent to the collection and processing of organizational contact information strictly for SANKALP Andhra 2026 partnership coordination.
                  </label>
                </div>

                <button type="submit" className={styles.btnSubmit}>
                  Submit Partnership Enquiry
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
