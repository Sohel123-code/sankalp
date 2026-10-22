import { useState, useEffect, useCallback } from 'react'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getEvents, getEventsByCategory, searchEvents } from '../services/eventService'
import styles from './Events.module.css'

const CATEGORIES = ['All', 'Music', 'Tech', 'Sports', 'Art', 'Food', 'Business']

export default function Events() {
  const [events,   setEvents]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      let data
      if (search.trim()) {
        data = await searchEvents(search.trim())
      } else if (category !== 'All') {
        data = await getEventsByCategory(category)
      } else {
        data = await getEvents()
      }
      setEvents(data ?? [])
    } catch (err) {
      setError(err.message || 'Failed to load events.')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [search, category])

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(fetchEvents, 320)
    return () => clearTimeout(t)
  }, [fetchEvents])

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Explore</p>
            <h1 className={styles.heading}>All Events</h1>
          </div>

          {/* Search */}
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              id="events-search"
              type="search"
              placeholder="Search events…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Search events"
            />
          </div>
        </div>

        {/* ── Category pills ── */}
        <div className={styles.categories} role="group" aria-label="Filter by category">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`${styles.catPill} ${category === cat ? styles.catActive : ''}`}
              id={`cat-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {loading && <LoadingSpinner size="lg" fullPage />}

        {!loading && error && (
          <div className={styles.errorMsg} role="alert">{error}</div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">🔍</span>
            <p>No events found. Try a different search or category.</p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            <p className={styles.count}>{events.length} event{events.length !== 1 ? 's' : ''} found</p>
            <div className={styles.grid}>
              {events.map(ev => <EventCard key={ev.id} event={ev} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
