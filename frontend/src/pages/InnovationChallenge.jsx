import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { INNOVATION_CHALLENGE, TRACKS } from '../data/sankalpData'
import styles from './InnovationChallenge.module.css'

export default function InnovationChallenge() {
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    teamLeadName: '',
    email: '',
    phone: '',
    affiliation: '',
    participantType: 'student',
    trackId: 'ai',
    projectTitle: '',
    problemStatement: '',
    solution: '',
    stage: 'prototype',
    repoUrl: '',
    acceptedTerms: false,
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
        badge="Pitch Competition"
        title={INNOVATION_CHALLENGE.title}
        subtitle={INNOVATION_CHALLENGE.tagline}
        breadcrumb={[{ label: 'Innovation Challenge' }]}
      />

      <div className={styles.container}>
        {/* ── Overview & Call to Action Banner ── */}
        <div className={styles.heroCard}>
          <div className={styles.heroText}>
            <span className={styles.heroBadge}>Elevator Pitch Across 4 Tracks</span>
            <h2 className={styles.heroH2}>Turn Your Tech Prototype into a Validated Solution</h2>
            <p className={styles.heroDesc}>{INNOVATION_CHALLENGE.purpose}</p>
            <div className={styles.feeBadges}>
              <div className={styles.fBadge}>
                <strong>Students / Scholars:</strong>
                <span>{INNOVATION_CHALLENGE.fees.student}</span>
              </div>
              <div className={styles.fBadge}>
                <strong>Industry / Startups:</strong>
                <span>{INNOVATION_CHALLENGE.fees.industry}</span>
              </div>
            </div>
            <p className={styles.feeNotice}>{INNOVATION_CHALLENGE.fees.notice}</p>
          </div>

          <div className={styles.heroActionBox}>
            <h3>Ready to pitch?</h3>
            <p>Pitch slots are allocated following rigorous jury screening.</p>
            <button
              className={styles.btnPrimary}
              onClick={() => {
                setShowSubmitModal(true)
                setSubmitted(false)
              }}
            >
              🚀 Submit Your Innovation Idea
            </button>
            <Link to="/registration" className={styles.linkRegister}>
              * Summit registration pass required →
            </Link>
          </div>
        </div>

        {/* ── 7-Step Process ── */}
        <section className={styles.processSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Evaluation Workflow</span>
            <h2 className={styles.secTitle}>7-Step Participation Process</h2>
            <p className={styles.secDesc}>
              From proposal submission to the main-stage elevator pitch before industry CTOs and venture capital juries.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {INNOVATION_CHALLENGE.steps.map(s => (
              <div key={s.step} className={styles.stepCard}>
                <span className={styles.stepNumber}>Step 0{s.step}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Eligible Participants & Required Info ── */}
        <div className={styles.twoColSection}>
          {/* Eligibility */}
          <div className={styles.panelBox}>
            <h3 className={styles.panelTitle}>👥 Eligible Participants</h3>
            <ul className={styles.bulletList}>
              {INNOVATION_CHALLENGE.eligibleParticipants.map((p, idx) => (
                <li key={idx}>
                  <span className={styles.bulletCheck}>✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Submission Fields */}
          <div className={styles.panelBox}>
            <h3 className={styles.panelTitle}>📝 Required Submission Dossier</h3>
            <ul className={styles.bulletList}>
              {INNOVATION_CHALLENGE.requiredFields.map((f, idx) => (
                <li key={idx}>
                  <span className={styles.bulletDot}>•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Disclaimer Box ── */}
        <div className={styles.disclaimerBox}>
          <strong>Notice &amp; Disclaimer:</strong>
          <p>{INNOVATION_CHALLENGE.disclaimer}</p>
        </div>
      </div>

      {/* ── Interactive Idea Submission Modal ── */}
      {showSubmitModal && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <button
              className={styles.closeBtn}
              onClick={() => setShowSubmitModal(false)}
              aria-label="Close modal"
            >
              ✕
            </button>

            {submitted ? (
              <div className={styles.successState}>
                <span className={styles.successIcon}>🎉</span>
                <h2 className={styles.successTitle}>Idea Submitted Successfully!</h2>
                <p className={styles.successText}>
                  Your submission <strong>&ldquo;{formData.projectTitle}&rdquo;</strong> has been logged with reference ID{' '}
                  <code>SANKALP-CH-{Math.floor(100000 + Math.random() * 900000)}</code>.
                </p>
                <p className={styles.successSub}>
                  A confirmation email has been dispatched to <strong>{formData.email}</strong>. Our academic review jury will evaluate your dossier against track criteria and notify you of shortlisting status.
                </p>
                <button
                  className={styles.btnPrimary}
                  onClick={() => setShowSubmitModal(false)}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className={styles.modalTitle}>Submit Innovation Idea</h2>
                <p className={styles.modalSubtitle}>
                  Fill out the pitch dossier below. Summit registration is mandatory for all team delegates.
                </p>

                <form onSubmit={handleSubmit} className={styles.modalForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Team Lead / Author Name *</label>
                      <input
                        type="text"
                        name="teamLeadName"
                        required
                        value={formData.teamLeadName}
                        onChange={handleChange}
                        placeholder="e.g. Dr. Priya Rao / Teja Mamidi"
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
                        placeholder="you@institution.ac.in"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Institution / Company Name *</label>
                      <input
                        type="text"
                        name="affiliation"
                        required
                        value={formData.affiliation}
                        onChange={handleChange}
                        placeholder="University or Startup name"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Category *</label>
                      <select
                        name="participantType"
                        value={formData.participantType}
                        onChange={handleChange}
                      >
                        <option value="student">Student / Scholar (₹200)</option>
                        <option value="faculty">Faculty / Academician (₹500)</option>
                        <option value="startup">Startup Founder (₹500)</option>
                        <option value="industry">Industry Innovator (₹500)</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Select Technology Track *</label>
                      <select
                        name="trackId"
                        value={formData.trackId}
                        onChange={handleChange}
                      >
                        {TRACKS.map(t => (
                          <option key={t.id} value={t.id}>
                            Track {t.number}: {t.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Current Development Stage *</label>
                      <select
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                      >
                        <option value="idea">Conceptual Idea / Architecture</option>
                        <option value="poc">Proof of Concept (PoC)</option>
                        <option value="prototype">Working Hardware / Software Prototype</option>
                        <option value="pilot">Early Pilot Deployment (TRL 5-7)</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Idea / Project Title *</label>
                    <input
                      type="text"
                      name="projectTitle"
                      required
                      value={formData.projectTitle}
                      onChange={handleChange}
                      placeholder="e.g. Edge-AI Transformer for High-Speed Solar Cell Defect Sorting"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Problem Statement (Max 250 words) *</label>
                    <textarea
                      name="problemStatement"
                      required
                      rows={3}
                      value={formData.problemStatement}
                      onChange={handleChange}
                      placeholder="Clearly define the scientific, industrial or public challenge being addressed..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Proposed Solution &amp; Technical Approach *</label>
                    <textarea
                      name="solution"
                      required
                      rows={3}
                      value={formData.solution}
                      onChange={handleChange}
                      placeholder="Describe algorithms, models, hardware design and expected impact..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Repository / Demo Link / Architecture PDF (Optional)</label>
                    <input
                      type="url"
                      name="repoUrl"
                      value={formData.repoUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/... or Google Drive URL"
                    />
                  </div>

                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="acceptedTerms"
                      name="acceptedTerms"
                      required
                      checked={formData.acceptedTerms}
                      onChange={handleChange}
                    />
                    <label htmlFor="acceptedTerms">
                      I confirm that our team holds intellectual property rights to this proposal and acknowledge that summit registration is mandatory for all pitching members.
                    </label>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.btnCancel}
                      onClick={() => setShowSubmitModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.btnPrimary}>
                      Submit Pitch Dossier
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
