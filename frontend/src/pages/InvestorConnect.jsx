import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { INVESTOR_CONNECT, TRACKS } from '../data/sankalpData'
import styles from './InvestorConnect.module.css'

export default function InvestorConnect() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    roleType: 'founder',
    trackId: 'ai',
    focusArea: '',
    stageOfProject: 'prototype',
    meetingGoal: '',
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
        badge="Capital & Commercialisation"
        title={INVESTOR_CONNECT.title}
        subtitle={INVESTOR_CONNECT.tagline}
        breadcrumb={[{ label: 'Investor & Industry Connect' }]}
      />

      <div data-summit-scene className={styles.container}>
        {/* ── Key Highlights Strip ── */}
        <div className={styles.strip}>
          <div className={styles.stripItem}>
            <span className={styles.stripIcon}></span>
            <div>
              <strong>Structured 1-on-1 Bilaterals</strong>
              <p>Curated introductions; final format to be confirmed</p>
            </div>
          </div>
          <div className={styles.stripItem}>
            <span className={styles.stripIcon}></span>
            <div>
              <strong>Investor Access</strong>
              <p>Angel networks, VCs, and state innovation funds</p>
            </div>
          </div>
          <div className={styles.stripItem}>
            <span className={styles.stripIcon}></span>
            <div>
              <strong>Access Model</strong>
              <p>Complimentary for confirmed Summit delegates</p>
            </div>
          </div>
        </div>

        {/* ── Purpose and Activities ── */}
        <section data-summit-scene className={styles.activitiesSection}>
          <div data-reveal-heading className={styles.sectionHeader}>
            <span className={styles.secEye}>Bilateral Focus</span>
            <h2 className={styles.secTitle}>Collaboration opportunities</h2>
            <details className="disclosure"><summary>About this programme <span className="disclosure-toggle" aria-hidden="true"><span className="disclosure-show">Details</span><span className="disclosure-hide">Hide</span></span></summary><p>{INVESTOR_CONNECT.purpose}</p></details>
          </div>

          <div className={styles.activitiesGrid}>
            {INVESTOR_CONNECT.activities.map((act, idx) => (
              <div key={idx} data-reveal-card className={styles.actCard}>
                <span className={styles.actNum}>0{idx + 1}</span>
                <p className={styles.actText}>{act}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Participation Rules & Meeting Request Form ── */}
        <div className={styles.twoCol}>
          {/* Rules and Guidelines */}
          <div className={styles.rulesCol}>
            <details className="disclosure"><summary>Participation guidelines <span className="disclosure-toggle" aria-hidden="true"><span className="disclosure-show">Details</span><span className="disclosure-hide">Hide</span></span></summary>
            <ul className={styles.rulesList}>
              {INVESTOR_CONNECT.participationRules.map((rule, idx) => (
                <li key={idx}>
                  <span className={styles.ruleBullet}></span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul></details>

            <div className={styles.disclaimerCard}>
              <strong>Official Disclaimer:</strong>
              <p>{INVESTOR_CONNECT.disclaimer}</p>
            </div>

            <div className={styles.regReminder}>
              <h4>Summit Pass is Mandatory</h4>
              <p>Only confirmed delegates are eligible to reserve meeting slots in the Investor Lounge.</p>
              <Link to="/registration" className={styles.btnSmall}>
                Get Your Summit Pass
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Request 1-on-1 Meeting Slot</h3>
              <p className={styles.formSub}>
                Submit your profile. Our industry partnership desk will align your request with relevant institutional investors or corporate heads.
              </p>

              {submitted ? (
                <div className={styles.formSuccess}>
                  <span className={styles.successIcon}></span>
                  <h4>Meeting request preview</h4>
                  <p>
                    Thank you, {formData.fullName}. Your request for the <strong>{formData.organization}</strong> project is shown in this preview.
                  </p>
                  <p className={styles.subNote}>
                    No meeting has been booked. Your entered email is <strong>{formData.email}</strong>. Matchmaking arrangements are to be confirmed.
                  </p>
                  <button
                    className={styles.btnReset}
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.requestForm}>
                  <div className={styles.inputGroup}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Rajesh Varma"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Official Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@domain.com"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Institution / Company Name *</label>
                    <input
                      type="text"
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Organization name"
                    />
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                      <label>Your Role *</label>
                      <select
                        name="roleType"
                        value={formData.roleType}
                        onChange={handleChange}
                      >
                        <option value="founder">Startup Founder</option>
                        <option value="researcher">University Researcher / Faculty</option>
                        <option value="investor">Angel / VC Investor</option>
                        <option value="industry">Corporate R&amp;D Executive</option>
                      </select>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Technology Track *</label>
                      <select
                        name="trackId"
                        value={formData.trackId}
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

                  <div className={styles.inputGroup}>
                    <label>Primary Collaboration Goal *</label>
                    <textarea
                      name="meetingGoal"
                      required
                      rows={3}
                      value={formData.meetingGoal}
                      onChange={handleChange}
                      placeholder="e.g. Seeking seed funding, seeking enterprise pilot validation, university IP licensing..."
                    />
                  </div>

                  <button type="submit" className={styles.btnSubmit}>
                    Request Meeting Slot
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
