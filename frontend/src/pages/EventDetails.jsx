import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getEventById } from '../services/eventService'
import LoadingSpinner from '../components/LoadingSpinner'
import styles from './EventDetails.module.css'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event,   setEvent]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      try {
        const data = await getEventById(id)
        if (!cancelled) setEvent(data)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Event not found.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <LoadingSpinner fullPage />

  if (error) return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.errorBox} role="alert">
          <span>⚠️</span> {error}
        </div>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>← Go Back</button>
      </div>
    </div>
  )

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : 'Date TBD'

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Back */}
        <Link to="/events" className={styles.backBtn} id="event-details-back">← All Events</Link>

        {/* Hero image */}
        <div className={styles.imgWrap}>
          {event.image_url
            ? <img src={event.image_url} alt={event.title} className={styles.img} />
            : <div className={styles.imgPlaceholder} aria-hidden="true">🎉</div>
          }
          {event.category && <span className={styles.badge}>{event.category}</span>}
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.main}>
            <h1 className={styles.title}>{event.title}</h1>
            {event.description && <p className={styles.desc}>{event.description}</p>}
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoIcon}>📅</span>
                <div>
                  <span className={styles.infoLabel}>Date</span>
                  <span className={styles.infoVal}>{formattedDate}</span>
                </div>
              </div>
              {event.location && (
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>📍</span>
                  <div>
                    <span className={styles.infoLabel}>Location</span>
                    <span className={styles.infoVal}>{event.location}</span>
                  </div>
                </div>
              )}
              {event.price != null && (
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>🎫</span>
                  <div>
                    <span className={styles.infoLabel}>Price</span>
                    <span className={styles.infoVal}>
                      {event.price === 0 ? 'Free' : `₹${event.price}`}
                    </span>
                  </div>
                </div>
              )}
              <Link to="/register" className={styles.registerBtn} id="event-details-register">
                Register for This Event
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
