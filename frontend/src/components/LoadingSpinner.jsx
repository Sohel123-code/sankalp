import styles from './LoadingSpinner.module.css'

/**
 * LoadingSpinner
 * @param {boolean} fullPage — centers spinner in the full viewport if true
 * @param {string}  size     — 'sm' | 'md' | 'lg'
 */
export default function LoadingSpinner({ fullPage = false, size = 'md' }) {
  return (
    <div className={`${styles.wrapper} ${fullPage ? styles.fullPage : ''}`}
         role="status"
         aria-label="Loading…"
    >
      <div className={`${styles.ring} ${styles[size]}`} />
      {fullPage && <p className={styles.label}>Loading…</p>}
    </div>
  )
}
