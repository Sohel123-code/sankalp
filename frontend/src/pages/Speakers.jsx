import { useState } from 'react'
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

      <div data-summit-scene className={styles.container}>
        <p className="sp-status"><strong>{SPEAKERS_INFO.status}</strong><span>{SPEAKERS_INFO.statusMessage}</span></p>

        <section className="sp-section" aria-labelledby="sp-voices-title">
          <span className="eyebrow">SESSION CLASSIFICATIONS</span>
          <h2 id="sp-voices-title">Voices across the programme</h2>
          <p className="sp-lede">Keynotes, specialist talks, panels and hands-on sessions.</p>
          <ul className="sp-cats">{SPEAKERS_INFO.categories.map((cat, index) => <li key={cat.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{cat.title}</h3><p>{cat.desc}</p></li>)}</ul>
        </section>

        <section className="sp-call" aria-labelledby="sp-call-title">
          <div className="sp-call-text">
            <span className="eyebrow">OPEN CALL</span>
            <h2 id="sp-call-title">Speaker nomination &amp; session proposals</h2>
            <p>Share your expertise in one of the four technology tracks. Propose a talk, workshop or panel session.</p>
            <div className="sp-criteria"><span className="tiny-label">HOW PROPOSALS ARE JUDGED</span>
              <ul><li>Concrete translational relevance, from research to deployment</li><li>Peer-reviewed scientific pedigree or enterprise scale</li><li>Non-promotional, vendor-neutral educational content</li></ul></div>
          </div>
          <div className="sp-call-form">
            <div className={styles.nominationFormCard}>
              <h3 className={styles.formTitle}>Submit Speaker Expression of Interest</h3>

              {proposalSubmitted ? (
                <div className={styles.successBox}>
                  <span className={styles.successIcon}></span>
                  <h4>Speaker proposal preview</h4>
                  <p>
                    Thank you, {proposal.name}. Your proposed session on <strong>{proposal.topicSummary}</strong> is shown in this preview.
                  </p>
                  <p className={styles.subText}>
                    No proposal has been sent. Your entered email is <strong>{proposal.email}</strong>. Speaker proposal arrangements are to be confirmed.
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
