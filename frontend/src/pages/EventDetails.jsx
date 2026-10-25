import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getEventById } from '../services/eventService'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'
import styles from './EventDetails.module.css'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
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
          <span></span> {error}
        </div>
        <button onClick={() => navigate(-1)} className={styles.backBtn}> Go Back</button>
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
      <PageHeader badge={event.category || 'Event details'} title={event.title} subtitle={`${formattedDate}${event.location ? ` · ${event.location}` : ''}`} breadcrumb={[{ label: 'Events', to: '/events' }, { label: 'Event details' }]} />
      <div className={styles.inner}>
        {/* Back */}
        <Link to="/events" className={styles.backBtn} id="event-details-back"> All Events</Link>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.main}>
            <h2 className={styles.title}>About this event</h2>
            {event.description && <p className={styles.desc}>{event.description}</p>}
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoIcon}></span>
                <div>
                  <span className={styles.infoLabel}>Date</span>
                  <span className={styles.infoVal}>{formattedDate}</span>
                </div>
              </div>
              {event.location && (
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}></span>
                  <div>
                    <span className={styles.infoLabel}>Location</span>
                    <span className={styles.infoVal}>{event.location}</span>
                  </div>
                </div>
              )}
              {event.price != null && (
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}></span>
                  <div>
                    <span className={styles.infoLabel}>Price</span>
                    <span className={styles.infoVal}>
                      {event.price === 0 ? 'Free' : `₹${event.price}`}
                    </span>
                  </div>
                </div>
              )}
              <Link to={user ? '/dashboard' : '/register'} className={styles.registerBtn} id="event-details-register">
                {user ? 'My profile' : 'Create an account'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
