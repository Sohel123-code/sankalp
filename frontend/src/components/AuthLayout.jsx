import ParticleCanvas from './ParticleCanvas'
import styles from './AuthLayout.module.css'

/**
 * AuthLayout — split two-panel wrapper used by both Register and Login.
 * @param {React.ReactNode} brandPanel  — left branding content
 * @param {React.ReactNode} formPanel   — right form content
 * @param {boolean} reversed            — swap columns (login page)
 */
export default function AuthLayout({ brandPanel, formPanel, reversed = false }) {
  return (
    <div className={styles.page}>
      {/* Animated background */}
      <div className={styles.blobs} aria-hidden="true">
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>
      <ParticleCanvas />

      <main className={`${styles.wrapper} ${reversed ? styles.reversed : ''}`}>
        <section className={styles.brand} aria-label="Branding">
          {brandPanel}
        </section>
        <section className={styles.form} aria-label="Auth form">
          {formPanel}
        </section>
      </main>
    </div>
  )
}
