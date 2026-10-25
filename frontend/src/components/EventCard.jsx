import { Link } from 'react-router-dom'
import styles from './EventCard.module.css'

/**
 * EventCard
 * @param {{ id, title, description, event_date, location, category }} event
 */
export default function EventCard({ event }) {
  const {
    id,
    title       = 'Untitled Event',
    description = '',
    event_date,
    location    = 'TBD',
    category    = 'General',
  } = event

  const formattedDate = event_date
    ? new Date(event_date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : 'Date TBD'

  return (
    <article className={styles.card}>
      <div className={styles.categoryLabel}>{category || 'Summit event'}</div>

      {/* Content */}
      <div className={styles.body}>
        <p className={styles.date}>{formattedDate}</p>
        <h3 className={styles.title}>{title}</h3>
        {description && (
          <p className={styles.desc}>{description.slice(0, 120)}{description.length > 120 ? '…' : ''}</p>
        )}
        <div className={styles.meta}>
          <span className={styles.location}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {location}
          </span>
          <Link to={`/events/${id}`} className={styles.cta} id={`event-card-${id}`}>
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
