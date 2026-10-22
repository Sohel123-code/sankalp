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

      <div className={styles.container}>
        {/* ── Hero Banner ── */}
        <div className={styles.heroBox}>
          <div className={styles.heroLeft}>
            <span className={styles.tag}>Live Demonstrations Pavilion</span>
            <h2 className={styles.heroH2}>Give Your Research Real-World Visibility</h2>
            <p className={styles.heroP}>
              The Research &amp; Technology Showcase offers physical exhibition concourses for university research labs, corporate R&amp;D divisions, and deep-tech startups to demonstrate live working prototypes before 2,000+ delegates.
            </p>
            <div className={styles.pendingCard}>
              <span className={styles.pendingIcon}>ℹ️</span>
              <p>{SHOWCASE_INFO.pendingDetails}</p>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.ctaCard}>
              <h3>Exhibit Your Innovation</h3>
              <p>Booth allocation is subject to technical review and room capacity.</p>
              <button
                className={styles.btnPrimary}
                onClick={() => {
                  setShowModal(true)
                  setSubmitted(false)
                }}
              >
                🔬 Express Showcase Interest
              </button>
            </div>
          </div>
        </div>

        {/* ── Potential Participants Grid ── */}
        <section className={styles.participantsSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Exhibitor Cohorts</span>
            <h2 className={styles.secTitle}>Who Can Exhibit?</h2>
            <p className={styles.secDesc}>
              Open to academic, industrial, and entrepreneurial research teams working on high-impact technology systems.
            </p>
          </div>

          <div className={styles.partGrid}>
            {SHOWCASE_INFO.potentialParticipants.map((part, idx) => (
              <div key={idx} className={styles.partCard}>
                <span className={styles.partNum}>0{idx + 1}</span>
                <p className={styles.partName}>{part}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Required Application Dossier ── */}
        <section className={styles.fieldsSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Submission Requirements</span>
            <h2 className={styles.secTitle}>Showcase Application Parameters</h2>
            <p className={styles.secDesc}>
              The screening committee evaluates demonstrations according to safety, technology readiness, and statewide impact.
            </p>
          </div>

          <div className={styles.fieldsGrid}>
            {SHOWCASE_INFO.requiredFields.map((f, i) => (
              <div key={i} className={styles.fItem}>
                <span className={styles.fDot}>•</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
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
            >
              ✕
            </button>

            {submitted ? (
              <div className={styles.successState}>
                <span className={styles.successIcon}>🎉</span>
                <h2>Showcase Interest Logged!</h2>
                <p>
                  Thank you, <strong>{formData.leadName}</strong>. Your exhibit proposal{' '}
                  <strong>&ldquo;{formData.title}&rdquo;</strong> on behalf of{' '}
                  <strong>{formData.institution}</strong> has been submitted.
                </p>
                <p className={styles.successSub}>
                  Our technical curation desk will contact <strong>{formData.email}</strong> once booth space allocations and logistical floor plans are finalized.
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
                  Complete the exhibition parameters below. All approved exhibits receive structured booth spaces and power facilities.
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
