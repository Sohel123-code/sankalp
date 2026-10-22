import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { TRACKS } from '../data/sankalpData'
import styles from './Tracks.module.css'

export default function Tracks() {
  const [selectedTrackId, setSelectedTrackId] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTracks = useMemo(() => {
    return TRACKS.map(track => {
      const matchesSearch =
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTrack = selectedTrackId === 'all' || track.id === selectedTrackId

      const filteredTopics = searchQuery
        ? track.topics.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        : track.topics

      return {
        ...track,
        visible: matchesSearch && matchesTrack,
        displayTopics: filteredTopics.length > 0 ? filteredTopics : track.topics,
      }
    }).filter(t => t.visible)
  }, [selectedTrackId, searchQuery])

  return (
    <div className={styles.page}>
      <PageHeader
        badge="Technology Domains"
        title="Four Strategic Technology Tracks"
        subtitle="Explore the four deep-tech tracks anchored to accelerate research translation, industry adoption, and economic growth in Andhra Pradesh."
        breadcrumb={[{ label: 'Technology Tracks' }]}
      />

      <div className={styles.container}>
        {/* ── Filter & Search Controls ── */}
        <div className={styles.controlsBar}>
          <div className={styles.trackPills}>
            <button
              className={`${styles.pillBtn} ${selectedTrackId === 'all' ? styles.pillActive : ''}`}
              onClick={() => setSelectedTrackId('all')}
            >
              All 4 Tracks
            </button>
            {TRACKS.map(t => (
              <button
                key={t.id}
                className={`${styles.pillBtn} ${selectedTrackId === t.id ? styles.pillActive : ''}`}
                onClick={() => setSelectedTrackId(t.id)}
              >
                <span>{t.icon}</span> {t.shortTitle}
              </button>
            ))}
          </div>

          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search topics (e.g. LLM, QKD, Digital Twins, Genomics)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search topics"
            />
            {searchQuery && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ── Tracks Detailed List ── */}
        <div className={styles.trackList}>
          {filteredTracks.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🔍</span>
              <h3>No matching topics found</h3>
              <p>Try searching for a different keyword or reset your filter.</p>
              <button
                className={styles.resetBtn}
                onClick={() => {
                  setSelectedTrackId('all')
                  setSearchQuery('')
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredTracks.map(track => (
              <article
                key={track.id}
                id={track.id}
                className={styles.trackDetailCard}
                style={{ '--track-accent': track.color }}
              >
                <div className={styles.trackHeader}>
                  <div className={styles.headerLeft}>
                    <div className={styles.iconBadge}>{track.icon}</div>
                    <div>
                      <span className={styles.trackBadge}>TRACK {track.number}</span>
                      <h2 className={styles.trackTitle}>{track.title}</h2>
                    </div>
                  </div>
                  <span className={styles.trackThemeBadge}>
                    Theme: {track.theme}
                  </span>
                </div>

                <p className={styles.trackDescription}>{track.description}</p>

                <div className={styles.topicsSection}>
                  <h3 className={styles.topicsHeading}>
                    Syllabus Topics &amp; Research Areas ({track.displayTopics.length})
                  </h3>
                  <div className={styles.topicsGrid}>
                    {track.displayTopics.map((topic, i) => (
                      <div key={i} className={styles.topicChip}>
                        <span className={styles.chipBullet}>•</span>
                        <span className={styles.chipText}>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.trackFooter}>
                  <div className={styles.footerNote}>
                    Part of the SANKALP Innovation Challenge &amp; Day 2 Masterclasses
                  </div>
                  <div className={styles.footerCtas}>
                    <Link to="/workshops" className={styles.btnWs}>
                      Explore Specialist Workshop →
                    </Link>
                    <Link to="/innovation-challenge" className={styles.btnPitch}>
                      Pitch in this Track →
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
