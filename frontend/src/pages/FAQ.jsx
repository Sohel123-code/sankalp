import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { FAQS } from '../data/sankalpData'
import styles from './FAQ.module.css'

export default function FAQ() {
  const [openId, setOpenId] = useState(1) // first open by default
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', 'General', 'Attendance', 'Tracks', 'Workshops', 'Challenge', 'Industry', 'Showcase']

  const filteredFaqs = useMemo(() => {
    return FAQS.filter(faq => {
      const matchesCat = selectedCategory === 'All' || faq.category === selectedCategory
      const matchesQuery =
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesQuery
    })
  }, [selectedCategory, searchQuery])

  const toggleAccordion = (id) => {
    setOpenId(prev => (prev === id ? null : id))
  }

  return (
    <div className={styles.page}>
      <PageHeader
        badge="Frequently Asked Questions"
        title="Everything You Need to Know"
        subtitle="Answers to all 19 standard questions on registration, specialist workshops, challenge submission, and summit policies."
        breadcrumb={[{ label: 'FAQs' }]}
      />

      <div className={styles.container}>
        {/* ── Search and Filter Controls ── */}
        <div className={styles.searchBar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className={styles.catPills}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.catBtn} ${selectedCategory === cat ? styles.catBtnActive : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Accordion List ── */}
        <div className={styles.accordionList}>
          {filteredFaqs.length === 0 ? (
            <div className={styles.emptyCard}>
              <span className={styles.emptyIcon}>❓</span>
              <h3>No matching questions found</h3>
              <p>Try searching for a different keyword or view all categories.</p>
              <button
                className={styles.btnReset}
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchQuery('')
                }}
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredFaqs.map(faq => {
              const isOpen = openId === faq.id
              return (
                <div
                  key={faq.id}
                  className={`${styles.accordionItem} ${isOpen ? styles.itemOpen : ''}`}
                >
                  <button
                    className={styles.accordionHeader}
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <div className={styles.headerLeft}>
                      <span className={styles.faqNum}>#{faq.id}</span>
                      <span className={styles.faqQ}>{faq.q}</span>
                    </div>
                    <div className={styles.headerRight}>
                      <span className={styles.faqCategory}>{faq.category}</span>
                      <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
                        ▾
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className={styles.accordionBody}>
                      <p className={styles.faqA}>{faq.a}</p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* ── Still have questions banner ── */}
        <div className={styles.helpBanner}>
          <div className={styles.helpInner}>
            <div>
              <h3>Still have questions?</h3>
              <p>Our organizing secretariat is available to clarify delegate queries and group registrations.</p>
            </div>
            <Link to="/contact" className={styles.btnContact}>
              Contact Secretariat Desk →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
