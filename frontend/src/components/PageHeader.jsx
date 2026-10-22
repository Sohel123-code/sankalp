import { Link } from 'react-router-dom'
import styles from './PageHeader.module.css'

export default function PageHeader({ badge, title, subtitle, breadcrumb = [] }) {
  return (
    <section className={styles.header}>
      <div className={styles.bgBlobs} aria-hidden="true">
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </div>

      <div className={styles.inner}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.bcHome}>Home</Link>
          {breadcrumb.map((crumb, idx) => (
            <span key={idx} className={styles.bcItem}>
              <span className={styles.bcSep}>/</span>
              {crumb.to ? (
                <Link to={crumb.to} className={styles.bcLink}>{crumb.label}</Link>
              ) : (
                <span className={styles.bcCurrent}>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {badge && <span className={styles.badge}>{badge}</span>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </section>
  )
}
