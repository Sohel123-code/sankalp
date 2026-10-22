import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  SUMMIT_INFO,
  HIGHLIGHTS,
  TRACKS,
  WHY_SANKALP,
  TARGET_AUDIENCE,
  WORKSHOPS,
  OPEN_SUMMIT_LABS,
  SCHEDULE,
  CONTACT_INFO,
} from '../data/sankalpData'
import styles from './Home.module.css'

export default function Home() {
  const [selectedDay, setSelectedDay] = useState('day1')

  return (
    <div className={styles.page}>
      {/* ── 1. Hero Section ────────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Summit Hero">
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.blob1} />
          <div className={styles.blob2} />
          <div className={styles.blob3} />
          <div className={styles.gridOverlay} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badgeRow}>
            <span className={styles.eventPill}>
              ✨ {SUMMIT_INFO.officialDescription}
            </span>
            <span className={styles.statusPill}>Proposed 2-Day Summit</span>
          </div>

          <h1 className={styles.heroH1}>
            <span className={styles.gradText}>{SUMMIT_INFO.name}</span>
          </h1>

          <p className={styles.heroTagline}>
            &ldquo;{SUMMIT_INFO.tagline}&rdquo;
          </p>

          <p className={styles.heroSub}>
            {SUMMIT_INFO.supportingDescription}
          </p>

          <div className={styles.metaRow}>
            <div className={styles.metaBadge}>
              <span className={styles.metaIcon}>📅</span>
              <div>
                <strong>Proposed Duration</strong>
                <p>Two Summit Days (Dates TBD)</p>
              </div>
            </div>
            <div className={styles.metaBadge}>
              <span className={styles.metaIcon}>📍</span>
              <div>
                <strong>Venue</strong>
                <p>Andhra Pradesh, India</p>
              </div>
            </div>
            <div className={styles.metaBadge}>
              <span className={styles.metaIcon}>🎯</span>
              <div>
                <strong>Focus</strong>
                <p>Deep-Tech R&amp;D to Deployment</p>
              </div>
            </div>
          </div>

          <div className={styles.heroCtas}>
            <Link to="/registration" className={styles.btnPrimary} id="hero-register-btn">
              🎟️ Register for the Summit
            </Link>
            <Link to="/tracks" className={styles.btnSecondary} id="hero-tracks-btn">
              Explore the Technology Tracks →
            </Link>
          </div>

          <div className={styles.subCtas}>
            <Link to="/programme" className={styles.subCtaLink}>View Programme</Link>
            <span className={styles.sep}>•</span>
            <Link to="/workshops" className={styles.subCtaLink}>Explore Workshops</Link>
            <span className={styles.sep}>•</span>
            <Link to="/innovation-challenge" className={styles.subCtaLink}>Submit Innovation Idea</Link>
            <span className={styles.sep}>•</span>
            <Link to="/partners" className={styles.subCtaLink}>Partner with SANKALP</Link>
            <span className={styles.sep}>•</span>
            <Link to="/contact" className={styles.subCtaLink}>Contact</Link>
          </div>
        </div>
      </section>

      {/* ── 2. Summit Highlights Strip ─────────────────────────────────── */}
      <section className={styles.highlightsSection} aria-label="Summit Highlights">
        <div className={styles.container}>
          <div className={styles.highlightsHeader}>
            <span className={styles.secEye}>At A Glance</span>
            <h2 className={styles.secTitle}>Summit Highlights</h2>
            <p className={styles.secDesc}>
              Two intense days curated to bridge the gap between academic labs, industrial facilities, and venture markets.
            </p>
          </div>

          <div className={styles.highlightsGrid}>
            {HIGHLIGHTS.map(item => (
              <div key={item.label} className={styles.highlightCard}>
                <div className={styles.hlIcon}>{item.icon}</div>
                <div className={styles.hlNum}>{item.num}</div>
                <div className={styles.hlLabel}>{item.label}</div>
                <p className={styles.hlDesc}>{item.desc}</p>
              </div>
            ))}
          </div>

          <p className={styles.approvalNote}>
            * All proposed highlights, session allocations, and cultural formats remain subject to formal institutional approval.
          </p>
        </div>
      </section>

      {/* ── 3. Four Technology Tracks ──────────────────────────────────── */}
      <section className={styles.tracksSection} aria-label="Four Technology Tracks">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Core Pillars</span>
            <h2 className={styles.secTitle}>Four Technology Tracks</h2>
            <p className={styles.secDesc}>
              Deep dive into transformative technological domains shaping industrial leadership and scientific progress in Andhra Pradesh.
            </p>
          </div>

          <div className={styles.tracksGrid}>
            {TRACKS.map(track => (
              <div
                key={track.id}
                className={styles.trackCard}
                style={{ '--track-accent': track.color }}
              >
                <div className={styles.trackTop}>
                  <span className={styles.trackNum}>{track.number}</span>
                  <span className={styles.trackIcon}>{track.icon}</span>
                </div>
                <h3 className={styles.trackTitle}>{track.title}</h3>
                <p className={styles.trackTheme}>&ldquo;{track.theme}&rdquo;</p>
                <p className={styles.trackDesc}>{track.description}</p>
                <div className={styles.topicTags}>
                  {track.topics.slice(0, 4).map((topic, i) => (
                    <span key={i} className={styles.topicTag}>{topic}</span>
                  ))}
                  {track.topics.length > 4 && (
                    <span className={styles.topicMore}>+{track.topics.length - 4} more</span>
                  )}
                </div>
                <Link to={`/tracks#${track.id}`} className={styles.trackLink}>
                  Explore Full Curriculum →
                </Link>
              </div>
            ))}
          </div>

          <div className={styles.centerAction}>
            <Link to="/tracks" className={styles.btnOutline}>
              View All Track Syllabi &amp; Topics
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Why SANKALP? ─────────────────────────────────────────────── */}
      <section className={styles.whySection} aria-label="Why Attend SANKALP">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Value Proposition</span>
            <h2 className={styles.secTitle}>Why SANKALP Andhra 2026?</h2>
            <p className={styles.secDesc}>
              Built from first principles to shift the paradigm from academic publishing alone to real-world technological deployment.
            </p>
          </div>

          <div className={styles.whyGrid}>
            {WHY_SANKALP.map(item => (
              <div key={item.title} className={styles.whyCard}>
                <span className={styles.whyIcon}>{item.icon}</span>
                <h3 className={styles.whyTitle}>{item.title}</h3>
                <p className={styles.whyDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Target Audience ─────────────────────────────────────────── */}
      <section className={styles.audienceSection} aria-label="Target Audience">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Ecosystem Stakeholders</span>
            <h2 className={styles.secTitle}>Who Should Attend?</h2>
            <p className={styles.secDesc}>
              SANKALP brings together the entire innovation helix across higher education, industry, government, and capital.
            </p>
          </div>

          <div className={styles.audienceGrid}>
            {TARGET_AUDIENCE.map(aud => (
              <div key={aud.role} className={styles.audCard}>
                <span className={styles.audIcon}>{aud.icon}</span>
                <h3 className={styles.audRole}>{aud.role}</h3>
                <p className={styles.audDesc}>{aud.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Featured Programme Preview ──────────────────────────────── */}
      <section className={styles.programmeSection} aria-label="Programme Preview">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Agenda Overview</span>
            <h2 className={styles.secTitle}>Featured Programme Sessions</h2>
            <p className={styles.secDesc}>
              Two thoughtfully planned days covering high-level policy dialogue, technical plenaries, and live prototype showcases.
            </p>
          </div>

          <div className={styles.dayTabs}>
            <button
              className={`${styles.dayTab} ${selectedDay === 'day1' ? styles.dayTabActive : ''}`}
              onClick={() => setSelectedDay('day1')}
            >
              📅 {SCHEDULE.day1.day}: {SCHEDULE.day1.title}
            </button>
            <button
              className={`${styles.dayTab} ${selectedDay === 'day2' ? styles.dayTabActive : ''}`}
              onClick={() => setSelectedDay('day2')}
            >
              🛠️ {SCHEDULE.day2.day}: {SCHEDULE.day2.title}
            </button>
          </div>

          <div className={styles.timelinePreview}>
            {(selectedDay === 'day1' ? SCHEDULE.day1.sessions : SCHEDULE.day2.sessions)
              .slice(0, 5)
              .map((sess, idx) => (
                <div key={idx} className={styles.sessionItem}>
                  <div className={styles.sessionTime}>{sess.time}</div>
                  <div className={styles.sessionContent}>
                    <div className={styles.sessionTypeBadge}>{sess.type}</div>
                    <h4 className={styles.sessionTitle}>{sess.title}</h4>
                    <p className={styles.sessionLocation}>📍 {sess.location}</p>
                    <p className={styles.sessionDesc}>{sess.desc}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className={styles.centerAction}>
            <Link to="/programme" className={styles.btnPrimary}>
              View Complete Two-Day Schedule &amp; Overlap Notes →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. Workshops & Open Summit Labs ────────────────────────────── */}
      <section className={styles.workshopsSection} aria-label="Workshops and Labs">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Hands-On Rigor</span>
            <h2 className={styles.secTitle}>Workshops &amp; Open Summit Labs</h2>
            <p className={styles.secDesc}>
              Step beyond listening. Build real agent workflows, QML simulations, digital twins, and healthcare predictive models.
            </p>
          </div>

          <div className={styles.wsTwoCol}>
            {/* Specialist Workshops */}
            <div className={styles.wsBlock}>
              <h3 className={styles.blockHeading}>🛠️ 4 Specialist Masterclass Workshops</h3>
              <div className={styles.wsCardList}>
                {WORKSHOPS.map(ws => (
                  <div key={ws.id} className={styles.wsMiniCard}>
                    <div className={styles.wsMiniTop}>
                      <span className={styles.wsBadge}>{ws.number}</span>
                      <span className={styles.wsLocation}>📍 {ws.location}</span>
                    </div>
                    <h4 className={styles.wsMiniTitle}>{ws.title}</h4>
                    <p className={styles.wsMiniOutput}>
                      <strong>Output:</strong> {ws.expectedOutput}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Summit Labs */}
            <div className={styles.wsBlock}>
              <h3 className={styles.blockHeading}>🧪 3 Open Summit Labs (Sprint, Design, Startup)</h3>
              <div className={styles.wsCardList}>
                {OPEN_SUMMIT_LABS.map(lab => (
                  <div key={lab.id} className={styles.wsMiniCard}>
                    <div className={styles.wsMiniTop}>
                      <span className={styles.labBadge}>{lab.number}</span>
                      <span className={styles.wsLocation}>⏰ {lab.time}</span>
                    </div>
                    <h4 className={styles.wsMiniTitle}>{lab.title}</h4>
                    <p className={styles.wsMiniOutput}>
                      <strong>Deliverable:</strong> {lab.output}
                    </p>
                  </div>
                ))}
              </div>
              <div className={styles.labCtaCard}>
                <h4>Ready to build?</h4>
                <p>All participants must bring a charged laptop with pre-requisite dev tools installed.</p>
                <Link to="/workshops" className={styles.btnSecondary}>
                  Explore Full Workshop Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Innovation Challenge & Investor Connect ─────────────────── */}
      <section className={styles.challengeSection} aria-label="Innovation and Capital">
        <div className={styles.container}>
          <div className={styles.twoColumnBanner}>
            {/* Challenge Card */}
            <div className={styles.ctaBoxGradient}>
              <span className={styles.badgeOrange}>Stage-Based Competition</span>
              <h3 className={styles.boxTitle}>SANKALP Innovation Challenge</h3>
              <p className={styles.boxDesc}>
                Pitch your research prototype or deep-tech startup across the 4 tracks before an expert jury of venture investors and research fellows.
              </p>
              <ul className={styles.boxBullets}>
                <li>✔ Open to Students, Faculty, Startups &amp; Industry Innovators</li>
                <li>✔ Multi-tier screening with live elevator pitches on Day 2</li>
                <li>✔ Student entry: ₹200/idea | Industry entry: ₹500/idea</li>
              </ul>
              <Link to="/innovation-challenge" className={styles.btnWhite}>
                Submit Innovation Idea →
              </Link>
            </div>

            {/* Investor Connect Card */}
            <div className={styles.ctaBoxCyan}>
              <span className={styles.badgeCyan}>Commercialisation Hub</span>
              <h3 className={styles.boxTitle}>Investor &amp; Industry Connect</h3>
              <p className={styles.boxDesc}>
                Direct 1-on-1 bilateral meetings between researchers, university spin-outs, early-stage deep-tech ventures, and institutional investors.
              </p>
              <ul className={styles.boxBullets}>
                <li>✔ Prototype validation and enterprise testbed scoping</li>
                <li>✔ University IP licensing and pilot project roadmaps</li>
                <li>✔ Registration-free for all confirmed summit delegates</li>
              </ul>
              <Link to="/investor-connect" className={styles.btnWhite}>
                Explore Investor Connect →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Research & Technology Showcase ─────────────────────────── */}
      <section className={styles.showcaseTeaser} aria-label="Tech Showcase">
        <div className={styles.container}>
          <div className={styles.showcaseInner}>
            <div className={styles.showcaseContent}>
              <span className={styles.secEye}>Exhibition Concourse</span>
              <h2 className={styles.showcaseTitle}>Research &amp; Technology Showcase</h2>
              <p className={styles.showcaseDesc}>
                Are you building pioneering technology in AI, Quantum, Mechatronics, or Precision Medicine? Showcase your working demonstration, patent prototype, or research lab output in our dedicated exhibition pavilions.
              </p>
              <div className={styles.showcaseCtas}>
                <Link to="/showcase" className={styles.btnPrimary}>
                  Express Showcase Interest
                </Link>
                <Link to="/partners" className={styles.btnGhost}>
                  Partner with SANKALP
                </Link>
              </div>
            </div>
            <div className={styles.showcaseBadgeGroup}>
              <div className={styles.metricCard}>
                <span className={styles.metricVal}>TRL 3-9</span>
                <span className={styles.metricLbl}>Eligible Tech Readiness Levels</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricVal}>100+</span>
                <span className={styles.metricLbl}>Expected Research Demos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Registration CTA ───────────────────────────────────────── */}
      <section className={styles.regBanner} aria-label="Registration Call to Action">
        <div className={styles.container}>
          <div className={styles.regBox}>
            <span className={styles.regPill}>Early Access Proposed Rates</span>
            <h2 className={styles.regTitle}>Secure Your Place at SANKALP Andhra 2026</h2>
            <p className={styles.regSub}>
              Registration passes include lunch on both days, full plenary access, delegate kit, and invitations to cultural gala evenings.
            </p>
            <div className={styles.regButtons}>
              <Link to="/registration" className={styles.btnPrimaryLg}>
                🎟️ View Registration Passes &amp; Fees
              </Link>
              <Link to="/contact" className={styles.btnOutlineLg}>
                Contact Secretariat
              </Link>
            </div>
            <p className={styles.regDisclaimer}>
              * Proposed fees: Students ₹800, Faculty ₹1,300, Startups ₹2,000, Industry ₹3,500. Group discounts of 10% available for student cohorts of 10+.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
