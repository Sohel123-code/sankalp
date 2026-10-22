import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { SCHEDULE } from '../data/sankalpData'
import styles from './Programme.module.css'

export default function Programme() {
  const [activeDay, setActiveDay] = useState('day1')
  const [filterType, setFilterType] = useState('all')

  const currentSchedule = activeDay === 'day1' ? SCHEDULE.day1 : SCHEDULE.day2

  const sessionTypes = useMemo(() => {
    const types = new Set(currentSchedule.sessions.map(s => s.type))
    return ['all', ...Array.from(types)]
  }, [currentSchedule])

  const filteredSessions = useMemo(() => {
    if (filterType === 'all') return currentSchedule.sessions
    return currentSchedule.sessions.filter(s => s.type === filterType)
  }, [currentSchedule, filterType])

  return (
    <div className={styles.page}>
      <PageHeader
        badge="Programme & Agenda"
        title="Summit Schedule & Timetable"
        subtitle="Two days of visionary keynotes, deep-tech research tracks, specialist workshops, and venture pitching in Andhra Pradesh."
        breadcrumb={[{ label: 'Programme & Schedule' }]}
      />

      <div className={styles.container}>
        {/* ── Schedule Resolution Notice Banner ── */}
        <div className={styles.alertBanner}>
          <span className={styles.alertIcon}>⚠️</span>
          <div className={styles.alertBody}>
            <strong>Programme Timing &amp; Overlap Advisory:</strong>
            <p>
              {SCHEDULE.disclaimer} On Day 1, the preliminary draft notes concurrent timings between the Inaugural Ceremony &amp; Keynote, as well as the Research Showcase &amp; Cultural Evening. These timings are being reconciled by the secretariat prior to final publication.
            </p>
          </div>
        </div>

        {/* ── Day Switcher Tabs ── */}
        <div className={styles.daySwitchContainer}>
          <div className={styles.dayTabs}>
            <button
              className={`${styles.dayBtn} ${activeDay === 'day1' ? styles.dayBtnActive : ''}`}
              onClick={() => {
                setActiveDay('day1')
                setFilterType('all')
              }}
            >
              <span className={styles.dayNum}>DAY 01</span>
              <span className={styles.dayTitle}>Research, Industry &amp; Strategic Dialogue</span>
            </button>
            <button
              className={`${styles.dayBtn} ${activeDay === 'day2' ? styles.dayBtnActive : ''}`}
              onClick={() => {
                setActiveDay('day2')
                setFilterType('all')
              }}
            >
              <span className={styles.dayNum}>DAY 02</span>
              <span className={styles.dayTitle}>Hands-On Innovation &amp; Industry Connect</span>
            </button>
          </div>
        </div>

        {/* ── Filter By Session Type ── */}
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>Filter Sessions:</span>
          <div className={styles.typePills}>
            {sessionTypes.map(type => (
              <button
                key={type}
                className={`${styles.typePill} ${filterType === type ? styles.typePillActive : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type === 'all' ? 'All Sessions' : type}
              </button>
            ))}
          </div>
        </div>

        {/* ── Timeline Display ── */}
        <div className={styles.timeline}>
          {filteredSessions.map((sess, idx) => (
            <div key={idx} className={styles.timelineItem}>
              {/* Left Time Column */}
              <div className={styles.timeCol}>
                <div className={styles.timeBadge}>{sess.time}</div>
                {sess.track && <span className={styles.trackTag}>{sess.track}</span>}
              </div>

              {/* Timeline Connector Dot */}
              <div className={styles.lineMarker}>
                <div className={styles.markerDot} />
                <div className={styles.markerLine} />
              </div>

              {/* Right Content Column */}
              <div className={styles.contentCol}>
                <div className={styles.cardHeader}>
                  <span className={styles.typeBadge}>{sess.type}</span>
                  <span className={styles.locationBadge}>📍 {sess.location}</span>
                </div>

                <h3 className={styles.sessionTitle}>{sess.title}</h3>
                <p className={styles.sessionDesc}>{sess.desc}</p>

                {sess.overlapNotice && (
                  <div className={styles.overlapWarning}>
                    <span className={styles.warningIcon}>ℹ️</span>
                    <span>{sess.overlapNotice}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Schedule Action Banner ── */}
        <div className={styles.bottomCtaBanner}>
          <div className={styles.bottomCtaInner}>
            <div>
              <h3>Participate in the Summit</h3>
              <p>Specialist workshops and pitch slots have limited room capacities. Book your delegate pass early.</p>
            </div>
            <div className={styles.bottomCtaBtns}>
              <Link to="/registration" className={styles.btnRegister}>
                Register for the Summit
              </Link>
              <Link to="/workshops" className={styles.btnWs}>
                View Workshop Syllabi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
