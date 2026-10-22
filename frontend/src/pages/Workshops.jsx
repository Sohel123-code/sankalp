import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { WORKSHOPS, OPEN_SUMMIT_LABS, WORKSHOP_REQUIREMENTS, REGISTRATION_FEES } from '../data/sankalpData'
import styles from './Workshops.module.css'

export default function Workshops() {
  const [activeTab, setActiveTab] = useState('specialist')

  return (
    <div className={styles.page}>
      <PageHeader
        badge="Hands-On Masterclasses"
        title="Workshops &amp; Open Summit Labs"
        subtitle="Intensive, outcome-driven technical masterclasses designed to equip researchers, students, and engineers with production-grade engineering skills."
        breadcrumb={[{ label: 'Workshops & Labs' }]}
      />

      <div className={styles.container}>
        {/* ── Fee & Registration Notice Strip ── */}
        <div className={styles.infoStrip}>
          <div className={styles.infoCol}>
            <span className={styles.infoLabel}>Workshop Schedule</span>
            <p>Day 2: 9:15 AM – 1:00 PM (Parallel Rooms)</p>
          </div>
          <div className={styles.infoCol}>
            <span className={styles.infoLabel}>Proposed Add-on Fees</span>
            <p>Students: ₹350 | Faculty: ₹500 | Industry: ₹700</p>
          </div>
          <div className={styles.infoCol}>
            <span className={styles.infoLabel}>Requirement</span>
            <p>Summit Base Registration + Workshop Pass</p>
          </div>
          <Link to="/registration" className={styles.btnSmall}>
            Book Workshop Pass →
          </Link>
        </div>

        {/* ── Section Switcher ── */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'specialist' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('specialist')}
          >
            🛠️ 4 Specialist Masterclasses
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'labs' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('labs')}
          >
            🧪 3 Open Summit Labs
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'guidelines' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('guidelines')}
          >
            📋 Participant Checklist &amp; Rules
          </button>
        </div>

        {/* ── Tab 1: Specialist Workshops ── */}
        {activeTab === 'specialist' && (
          <div className={styles.workshopList}>
            {WORKSHOPS.map(ws => (
              <article key={ws.id} className={styles.wsCard}>
                <div className={styles.wsHeader}>
                  <div className={styles.wsHeaderMain}>
                    <span className={styles.wsNumber}>{ws.number}</span>
                    <h2 className={styles.wsTitle}>{ws.title}</h2>
                  </div>
                  <div className={styles.wsMetaTags}>
                    <span className={styles.metaTagLocation}>📍 {ws.location}</span>
                    <span className={styles.metaTagTrack}>⚡ {ws.track}</span>
                    <span className={styles.metaTagTime}>⏰ {ws.time}</span>
                  </div>
                </div>

                <div className={styles.wsBody}>
                  <div className={styles.activitiesCol}>
                    <h3 className={styles.subHeading}>Hands-on Activities &amp; Curriculum</h3>
                    <ul className={styles.activitiesList}>
                      {ws.activities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.outputCol}>
                    <div className={styles.outputBox}>
                      <span className={styles.boxTag}>Expected Deliverable Output</span>
                      <p className={styles.outputText}>{ws.expectedOutput}</p>
                    </div>

                    <div className={styles.eligibilityBox}>
                      <span className={styles.boxTag}>Target Audience / Pre-requisite</span>
                      <p className={styles.eligibilityText}>{ws.eligibility}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.wsFooter}>
                  <span className={styles.inclusionsNote}>
                    Includes: Completion Certificate, Sandbox Repos, Exercise Sheets &amp; 30-Day Recording Access
                  </span>
                  <Link to="/registration" className={styles.btnEnroll}>
                    Enroll in this Workshop →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ── Tab 2: Open Summit Labs ── */}
        {activeTab === 'labs' && (
          <div className={styles.labsGrid}>
            {OPEN_SUMMIT_LABS.map(lab => (
              <article key={lab.id} className={styles.labCard}>
                <div className={styles.labTop}>
                  <span className={styles.labIcon}>{lab.icon}</span>
                  <span className={styles.labNumber}>{lab.number}</span>
                </div>
                <h3 className={styles.labTitle}>{lab.title}</h3>
                <span className={styles.labTimeBadge}>⏰ {lab.time}</span>

                <div className={styles.labSection}>
                  <strong>Core Focus:</strong>
                  <p>{lab.focus}</p>
                </div>

                <div className={styles.labSection}>
                  <strong>Expected Tangible Output:</strong>
                  <p>{lab.output}</p>
                </div>

                <div className={styles.labCardFooter}>
                  <span className={styles.freeBadge}>Open for Summit Attendees</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ── Tab 3: Participant Guidelines ── */}
        {activeTab === 'guidelines' && (
          <div className={styles.guidelinesSection}>
            <div className={styles.checklistCard}>
              <h2 className={styles.checklistTitle}>Mandatory Participant Checklist</h2>
              <p className={styles.checklistSub}>
                To ensure a smooth, high-impact learning experience, all workshop participants must adhere to the following prerequisites:
              </p>

              <div className={styles.checklistItems}>
                {WORKSHOP_REQUIREMENTS.map((req, idx) => (
                  <div key={idx} className={styles.checkItem}>
                    <span className={styles.checkIcon}>✅</span>
                    <p className={styles.checkText}>{req}</p>
                  </div>
                ))}
              </div>

              <div className={styles.noticeBox}>
                <strong>Responsible AI &amp; Research Ethics Protocol:</strong>
                <p>
                  All participants will be provided sandboxed APIs and approved open datasets. The use of unauthorized proprietary materials or violation of intellectual property and data safety protocols is strictly prohibited.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Fee Inclusions Summary ── */}
        <section className={styles.inclusionsSection}>
          <h2 className={styles.inclusionsH2}>Proposed Workshop Inclusions</h2>
          <div className={styles.inclusionsGrid}>
            {REGISTRATION_FEES.workshopInclusions.map((inc, i) => (
              <div key={i} className={styles.incItem}>
                <span className={styles.incBullet}>✦</span>
                <p>{inc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
