import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <span className={styles.code} aria-hidden="true">404</span>
        <h1 className={styles.heading}>Page Not Found</h1>
        <p className={styles.sub}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link to="/"       className={styles.btnPrimary} id="notfound-home">Back to Home</Link>
          <Link to="/events" className={styles.btnGhost}   id="notfound-events">Browse Events</Link>
        </div>
      </div>
    </div>
  )
}
