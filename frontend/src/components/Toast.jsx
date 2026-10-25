import styles from './Toast.module.css'

export default function ToastContainer({ toasts }) {
  if (!toasts.length) return null
  return (
    <div className={styles.container} role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>

          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
