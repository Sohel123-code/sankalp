import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { SHOWCASE_INFO, TRACKS } from '../data/sankalpData'
import styles from './Showcase.module.css'

export default function Showcase() {
  const [showModal, setShowModal] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    techArea: 'ai',
    institution: '',
    leadName: '',
    email: '',
    description: '',
    intendedApplication: '',
    trlStage: 'TRL 4 - Lab Validated Prototype',
    powerRequirements: 'Standard 230V 5A single-phase + Wi-Fi',
    spaceRequirements: 'Single Booth (2m x 2m)',
    ipNotes: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className={styles.page}>
      <PageHeader
        badge="Technology Exhibition"
        title={SHOWCASE_INFO.title}
        subtitle={SHOWCASE_INFO.purpose}
        breadcrumb={[{ label: 'Research & Tech Showcase' }]}
      />

      <div data-summit-scene className={styles.container}>
        <section className="sc-intro" aria-labelledby="sc-intro-title">
          <div>
            <span className="eyebrow">LIVE DEMONSTRATIONS PAVILION</span>
            <h2 id="sc-intro-title">Put research on display.</h2>
            <p>Demonstrate your prototype to researchers, industry teams and summit participants.</p>
            <p className="sc-note">{SHOWCASE_INFO.pendingDetails}</p>
          </div>
          <div className="sc-cta">
            <h3>Exhibit your innovation</h3>
            <p>Booth allocation is subject to technical review and room capacity.</p>
            <button type="button" className="sc-cta-button" onClick={() => { setShowModal(true); setSubmitted(false) }}>Express showcase interest <span aria-hidden="true">→</span></button>
          </div>
        </section>

        <section className="sc-section" aria-labelledby="sc-who-title">
          <span className="eyebrow">EXHIBITOR COHORTS</span>
          <h2 id="sc-who-title">Who can exhibit?</h2>
          <p className="sc-lede">Open to academic, industrial and entrepreneurial research teams working on high-impact technology systems.</p>
          <ul className="sc-cohorts">{SHOWCASE_INFO.potentialParticipants.map((part, index) => <li key={part}><span>{String(index + 1).padStart(2, '0')}</span><p>{part}</p></li>)}</ul>
        </section>

        <section className="sc-section" aria-labelledby="sc-prep-title">
          <span className="eyebrow">SUBMISSION REQUIREMENTS</span>
          <h2 id="sc-prep-title">What to prepare</h2>
          <p className="sc-lede">The screening committee evaluates demonstrations on safety, technology readiness and statewide impact.</p>
          <ol className="sc-fields">{SHOWCASE_INFO.requiredFields.map(field => <li key={field}>{field}</li>)}</ol>
        </section>
      </div>

      {/* ── Application Modal ── */}
      {showModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <button
              className={styles.closeBtn}
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            ><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" /></svg></button>

            {submitted ? (
              <div className={styles.successState}>
                <span className={styles.successIcon}></span>
                <h2>Showcase interest preview</h2>
                <p>
                  Thank you, <strong>{formData.leadName}</strong>. Your exhibit proposal{' '}
                  <strong>&ldquo;{formData.title}&rdquo;</strong> on behalf of{' '}
                  <strong>{formData.institution}</strong> is shown in this preview.
                </p>
                <p className={styles.successSub}>
                  No proposal has been sent. Your entered email is <strong>{formData.email}</strong>. Official showcase arrangements are to be confirmed.
                </p>
                <button
                  className={styles.btnPrimary}
                  onClick={() => setShowModal(false)}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                <h2 className={styles.modalTitle}>Express Showcase Interest</h2>
                <p className={styles.modalSub}>
                  Preview your exhibition requirements below. Space, equipment, selection and fees remain subject to confirmation.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Project / Exhibit Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Autonomous Hybrid Drone for Precision Citrus Orchard Spraying"
                    />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label>Technology Area *</label>
                      <select
                        name="techArea"
                        value={formData.techArea}
                        onChange={handleChange}
                      >
                        {TRACKS.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.title}
                          </option>
                        ))}
                        <option value="aerospace">Aerospace &amp; Satellite Systems</option>
                        <option value="semiconductors">Semiconductors &amp; Microelectronics</option>
                        <option value="materials">Advanced Materials &amp; Polymers</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Institution / Company Name *</label>
                      <input
                        type="text"
                        name="institution"
                        required
                        value={formData.institution}
                        onChange={handleChange}
                        placeholder="e.g. Andhra University / BioTech Labs"
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label>Team Lead / Exhibitor Name *</label>
                      <input
                        type="text"
                        name="leadName"
                        required
                        value={formData.leadName}
                        onChange={handleChange}
                        placeholder="Principal Investigator / Founder"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="lead@institution.ac.in"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Project Description &amp; What Will Be Demonstrated *</label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Explain physical hardware, software screen demo, sensors or mechanical models..."
                    />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label>Technology Readiness Level (TRL) *</label>
                      <select
                        name="trlStage"
                        value={formData.trlStage}
                        onChange={handleChange}
                      >
                        <option value="TRL 3 - Proof of Concept">TRL 3 - Proof of Concept</option>
                        <option value="TRL 4 - Lab Validated Prototype">TRL 4 - Lab Validated Prototype</option>
                        <option value="TRL 5 - Component Validation in Relevant Environment">TRL 5 - Component Validation</option>
                        <option value="TRL 6 - Prototype Demonstration in Operational Environment">TRL 6 - Operational Prototype</option>
                        <option value="TRL 7 - System Prototype in Field">TRL 7 - Field Prototype</option>
                        <option value="TRL 8-9 - Commercial Ready System">TRL 8-9 - Commercial Ready</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Space Requirement *</label>
                      <select
                        name="spaceRequirements"
                        value={formData.spaceRequirements}
                        onChange={handleChange}
                      >
                        <option value="Single Booth (2m x 2m)">Single Booth (2m x 2m)</option>
                        <option value="Double Booth (4m x 2m)">Double Booth (4m x 2m)</option>
                        <option value="Special High-Clearance Open Floor Area">Special High-Clearance Floor Area</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Power, High-Speed Network &amp; Equipment Safety Needs</label>
                    <input
                      type="text"
                      name="powerRequirements"
                      value={formData.powerRequirements}
                      onChange={handleChange}
                      placeholder="e.g. 3-phase 15A power, water inlet, gigabit ethernet..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>IP, Confidentiality &amp; Patent Considerations</label>
                    <input
                      type="text"
                      name="ipNotes"
                      value={formData.ipNotes}
                      onChange={handleChange}
                      placeholder="e.g. Provisional patent filed; public demo approved"
                    />
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.btnCancel}
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.btnPrimary}>
                      Submit Showcase Interest
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
