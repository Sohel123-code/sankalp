import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { SPEAKERS_INFO, TRACKS } from '../data/sankalpData'
import styles from './Speakers.module.css'

export default function Speakers() {
  const [proposalSubmitted, setProposalSubmitted] = useState(false)
  const [proposal, setProposal] = useState({
    name: '',
    role: '',
    institution: '',
    email: '',
    trackId: 'ai',
    sessionType: 'plenary',
    topicSummary: '',
    profileLink: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProposal(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setProposalSubmitted(true)
  }

  return (
    <div className={styles.page}>
      <PageHeader
        badge="Eminent Experts"
        title="Speakers &amp; Subject Matter Experts"
        subtitle="Convening national policymakers, global scientific researchers, venture partners, and enterprise engineering pioneers."
        breadcrumb={[{ label: 'Speakers & Experts' }]}
      />

      <div className={styles.container}>
        {/* ── Formal Status Advisory Banner ── */}
        <div className={styles.statusBanner}>
          <span className={styles.statusIcon}>📢</span>
          <div className={styles.statusText}>
            <strong>{SPEAKERS_INFO.status}</strong>
            <p>{SPEAKERS_INFO.statusMessage}</p>
          </div>
        </div>

        {/* ── Speaker Categories ── */}
        <section className={styles.categoriesSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Session Classifications</span>
            <h2 className={styles.secTitle}>Speaker Roles &amp; Line-up Structure</h2>
            <p className={styles.secDesc}>
              Our programme encompasses seven dedicated expert capacities spanning visionary keynotes to hands-on laboratory facilitators.
            </p>
          </div>

          <div className={styles.catGrid}>
            {SPEAKERS_INFO.categories.map((cat, idx) => (
              <div key={idx} className={styles.catCard}>
                <span className={styles.catNum}>0{idx + 1}</span>
                <h3 className={styles.catTitle}>{cat.title}</h3>
                <p className={styles.catDesc}>{cat.desc}</p>
                <span className={styles.tbdTag}>Profile Confirmation in Progress</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Call for Speaker Submissions / Proposal Form ── */}
        <section className={styles.nominationSection}>
          <div className={styles.nominationInner}>
            <div className={styles.nominationText}>
              <span className={styles.secEye}>Open Call</span>
              <h2 className={styles.nominationH2}>Speaker Nomination &amp; Session Proposals</h2>
              <p>
                Are you a recognized academic researcher, laboratory director, or deep-tech enterprise architect with pioneering work in AI, Quantum, Mechatronics, or Bioengineering?
              </p>
              <p>
                The SANKALP Andhra 2026 Academic Advisory Committee invites proposals for keynote talks, technical plenaries, and panel moderation.
              </p>

              <div className={styles.vettingCriteria}>
                <h4>Speaker Evaluation Criteria:</h4>
                <ul>
                  <li>✔ Concrete translational relevance (Research to Deployment)</li>
                  <li>✔ Peer-reviewed scientific pedigree or enterprise scale</li>
                  <li>✔ Strict non-promotional, vendor-neutral educational content</li>
                </ul>
              </div>
            </div>

            <div className={styles.nominationFormCard}>
              <h3 className={styles.formTitle}>Submit Speaker Expression of Interest</h3>

              {proposalSubmitted ? (
                <div className={styles.successBox}>
                  <span className={styles.successIcon}>🎉</span>
                  <h4>Proposal Received!</h4>
                  <p>
                    Thank you, {proposal.name}. Your proposed session on <strong>{proposal.topicSummary}</strong> has been forwarded to the review committee.
                  </p>
                  <p className={styles.subText}>
                    Our secretariat will reach out to <strong>{proposal.email}</strong> regarding evaluation outcomes.
                  </p>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => setProposalSubmitted(false)}
                  >
                    Submit Another Nomination
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Full Name &amp; Title *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={proposal.name}
                      onChange={handleChange}
                      placeholder="e.g. Prof. Aruna Chandrasekhar"
                    />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label>Designation / Role *</label>
                      <input
                        type="text"
                        name="role"
                        required
                        value={proposal.role}
                        onChange={handleChange}
                        placeholder="e.g. Head of Quantum Labs"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Institution / Company *</label>
                      <input
                        type="text"
                        name="institution"
                        required
                        value={proposal.institution}
                        onChange={handleChange}
                        placeholder="University or Firm"
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label>Work Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={proposal.email}
                        onChange={handleChange}
                        placeholder="aruna@domain.ac.in"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Target Track *</label>
                      <select
                        name="trackId"
                        value={proposal.trackId}
                        onChange={handleChange}
                      >
                        {TRACKS.map(t => (
                          <option key={t.id} value={t.id}>
                            Track {t.number}: {t.shortTitle}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Preferred Session Type *</label>
                    <select
                      name="sessionType"
                      value={proposal.sessionType}
                      onChange={handleChange}
                    >
                      <option value="keynote">Inaugural Keynote</option>
                      <option value="plenary">Plenary Lecture</option>
                      <option value="featured">Featured Industry Talk</option>
                      <option value="panel">Panel Discussion Participant</option>
                      <option value="workshop">Specialist Workshop Facilitator</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Proposed Talk Title &amp; Abstract (Max 200 words) *</label>
                    <textarea
                      name="topicSummary"
                      required
                      rows={3}
                      value={proposal.topicSummary}
                      onChange={handleChange}
                      placeholder="Summarize the core engineering or scientific breakthrough..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>LinkedIn / Google Scholar / Faculty Profile URL *</label>
                    <input
                      type="url"
                      name="profileLink"
                      required
                      value={proposal.profileLink}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>

                  <button type="submit" className={styles.btnSubmit}>
                    Submit Speaker Dossier
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
