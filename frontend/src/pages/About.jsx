import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { SUMMIT_INFO, ABOUT_DETAILS } from '../data/sankalpData'
import styles from './About.module.css'

export default function About() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <div className={styles.page}>
      <PageHeader
        badge="About The Summit"
        title="From Research to Real-World Impact"
        subtitle={SUMMIT_INFO.supportingDescription}
        breadcrumb={[{ label: 'About' }]}
      />

      <div className={styles.container}>
        {/* ── Vision & Mission Split ─────────────────────────────────── */}
        <section className={styles.vmSection} aria-label="Vision and Mission">
          <div className={styles.vmCard}>
            <div className={styles.vmIcon}>👁️</div>
            <span className={styles.vmTag}>Summit Vision</span>
            <h2 className={styles.vmTitle}>Building a Resilient Regional Tech Ecosystem</h2>
            <p className={styles.vmText}>{ABOUT_DETAILS.vision}</p>
          </div>

          <div className={styles.vmCard}>
            <div className={styles.vmIcon}>🎯</div>
            <span className={styles.vmTag}>Summit Mission</span>
            <h2 className={styles.vmTitle}>Transforming Discovery into Deployment</h2>
            <p className={styles.vmText}>{ABOUT_DETAILS.mission}</p>
          </div>
        </section>

        {/* ── Research-to-Impact Workflow ────────────────────────────── */}
        <section className={styles.workflowSection} aria-label="Research-to-Impact Pipeline">
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Methodological Framework</span>
            <h2 className={styles.secTitle}>The Research-to-Impact Pipeline</h2>
            <p className={styles.secDesc}>
              A 6-stage structured continuum designed to transition scientific breakthroughs from academic laboratory benches to scalable societal and industrial deployment.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className={styles.stepTabs}>
            {ABOUT_DETAILS.workflow.map(item => (
              <button
                key={item.step}
                className={`${styles.stepTab} ${activeStep === item.step ? styles.stepTabActive : ''}`}
                onClick={() => setActiveStep(item.step)}
              >
                <span className={styles.stepNum}>0{item.step}</span>
                <span className={styles.stepName}>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Active Step Showcase */}
          <div className={styles.stepCard}>
            {ABOUT_DETAILS.workflow
              .filter(s => s.step === activeStep)
              .map(item => (
                <div key={item.step} className={styles.stepContent}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepBadge}>Stage 0{item.step} of 06</span>
                    <h3 className={styles.stepH3}>{item.name} Phase</h3>
                  </div>
                  <p className={styles.stepDetail}>{item.desc}</p>
                  <div className={styles.stepMeta}>
                    <div className={styles.metaCol}>
                      <strong>Key Stakeholders:</strong>
                      <p>
                        {item.step <= 2
                          ? 'Academic Researchers, PhD Scholars, Policy Think-Tanks'
                          : item.step <= 4
                          ? 'Design Engineers, Mechatronics Labs, Enterprise R&D'
                          : 'Venture Capital, Industrial Corridors, State Agencies'}
                      </p>
                    </div>
                    <div className={styles.metaCol}>
                      <strong>Primary Output:</strong>
                      <p>
                        {item.step === 1 && 'Published scientific theorems & exploratory experiments.'}
                        {item.step === 2 && 'Structured problem statement with commercial feasibility review.'}
                        {item.step === 3 && 'Functional proof-of-concept prototype & open code repository.'}
                        {item.step === 4 && 'Benchmarked field-test reports & compliance validation.'}
                        {item.step === 5 && 'Pilot installation with industrial or civic testbed.'}
                        {item.step === 6 && 'Incorporated spin-off, equity funding & statewide adoption.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ── Seven Core Objectives ──────────────────────────────────── */}
        <section className={styles.objectivesSection} aria-label="Summit Objectives">
          <div className={styles.sectionHeader}>
            <span className={styles.secEye}>Strategic Roadmap</span>
            <h2 className={styles.secTitle}>Seven Core Summit Objectives</h2>
            <p className={styles.secDesc}>
              Clear, measurable mandates guiding every keynote, technical workshop, and bilateral investor dialogue at SANKALP Andhra 2026.
            </p>
          </div>

          <div className={styles.objGrid}>
            {ABOUT_DETAILS.objectives.map((obj, index) => (
              <div key={index} className={styles.objCard}>
                <div className={styles.objNum}>0{index + 1}</div>
                <p className={styles.objText}>{obj}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── State Innovation Context ───────────────────────────────── */}
        <section className={styles.stateContextSection} aria-label="Regional Relevance">
          <div className={styles.contextInner}>
            <div className={styles.contextText}>
              <span className={styles.secEye}>Regional Deep-Tech Catalyst</span>
              <h2 className={styles.contextH2}>Why Andhra Pradesh?</h2>
              <p>
                Andhra Pradesh is entering an era of unprecedented industrial and technological momentum. With thriving industrial clusters in electronics, automotive, biotechnology, and renewable energy, alongside premier universities and research institutions, the state offers the ideal testbed for translational innovation.
              </p>
              <p>
                SANKALP serves as the collaborative platform where state leadership, academic visionaries, enterprise giants, and budding tech pioneers unite to build sovereign technological capabilities.
              </p>
              <div className={styles.contextCtas}>
                <Link to="/tracks" className={styles.btnPrimary}>
                  Explore the 4 Tech Tracks →
                </Link>
                <Link to="/partners" className={styles.btnOutline}>
                  Partner With SANKALP
                </Link>
              </div>
            </div>

            <div className={styles.contextStats}>
              <div className={styles.cStat}>
                <span className={styles.cStatVal}>4</span>
                <span className={styles.cStatLbl}>Cutting-Edge Focus Tracks</span>
              </div>
              <div className={styles.cStat}>
                <span className={styles.cStatVal}>7</span>
                <span className={styles.cStatLbl}>Specialist Workshops &amp; Labs</span>
              </div>
              <div className={styles.cStat}>
                <span className={styles.cStatVal}>100%</span>
                <span className={styles.cStatLbl}>Commitment to Real Impact</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
