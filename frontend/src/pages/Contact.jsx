import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FancyButton } from '../components/Motion'
import PageHeader from '../components/PageHeader'
import { CONTACT_INFO } from '../data/sankalpData'
import styles from './Contact.module.css'

const DESKS = [
  { key: 'generalEmail', label: 'GENERAL', title: 'General enquiries', about: 'The summit, programme, venue and anything not covered elsewhere.', category: 'General Enquiries' },
  { key: 'registrationEmail', label: 'DELEGATES', title: 'Registration & delegate support', about: 'Passes, group bookings, fees, invoices and accessibility needs.', category: 'Registration & Delegate Support' },
  { key: 'partnershipsEmail', label: 'PARTNERS', title: 'Partnership & sponsorship', about: 'Institutional partners, sponsors, exhibitors and investors.', category: 'Partnerships & Sponsorship Opportunities' },
  { key: 'challengeEmail', label: 'INNOVATORS', title: 'Innovation Challenge desk', about: 'Eligibility, submissions and mentoring for the pitch challenge.', category: 'SANKALP Innovation Challenge' },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    category: CONTACT_INFO.enquiryCategories[0],
    message: '',
    privacyConsent: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // A desk card pre-selects its category and moves the reader to the form.
  const chooseDesk = category => {
    setFormData(prev => ({ ...prev, category })); setSubmitted(false)
    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className={styles.page}>
      <PageHeader
        badge="Summit Secretariat"
        title="Contact Organising Committee"
        subtitle="Get in touch with the SANKALP Andhra 2026 secretariat for delegate support, group registrations, workshops, and institutional partnerships."
        breadcrumb={[{ label: 'Contact' }]}
      />

      <div data-summit-scene className={styles.container} id="contact-details">
        <p className="ct-note">Verified contact details and official channels will be announced by the organising team.</p>

        <section aria-labelledby="ct-desks-title" id="contact-desks">
          <h2 id="ct-desks-title" className="ct-heading">Who should you write to?</h2>
          <div className="ct-desks">
            {DESKS.map(desk => {
              const value = CONTACT_INFO[desk.key], live = value.includes('@')
              return <article key={desk.key} className="ct-desk">
                <span className="tiny-label">{desk.label}</span>
                <h3>{desk.title}</h3>
                <p>{desk.about}</p>
                {live ? <a className="ct-desk-email" href={`mailto:${value}`}>{value}</a> : <span className="ct-desk-email is-pending">Email to be announced</span>}
                <button type="button" className="ct-desk-action" onClick={() => chooseDesk(desk.category)}>Prepare an enquiry →</button>
              </article>
            })}
          </div>
        </section>

        <div className="ct-split">
          <aside className="ct-aside" aria-label="Secretariat and channels">
            <div data-reveal-card className="ct-aside-block">
              <span className="tiny-label">ORGANISING SECRETARIAT</span>
              <p>{CONTACT_INFO.officeAddress}</p>
              <p>{CONTACT_INFO.phone}</p>
            </div>
            <div className="ct-aside-block">
              <span className="tiny-label">OFFICIAL SOCIAL CHANNELS</span>
              {CONTACT_INFO.socials.length
                ? <div className={styles.socialLinks}>{CONTACT_INFO.socials.map(s => <a key={s.platform} href={s.url} target="_blank" rel="noreferrer" className={styles.socBtn}>{s.platform}</a>)}</div>
                : <p>To be announced.</p>}
            </div>
            <div className="ct-aside-block">
              <span className="tiny-label">BEFORE YOU WRITE</span>
              <p>Dates, fees and venue questions are often answered already.</p>
              <Link className="editorial-link" to="/faq">Read the FAQs</Link>
            </div>
          </aside>

          <div className={styles.formCol} id="enquiry-form">
            <div className={styles.formCard}>
              <h3 className={styles.formH3}>Prepare your enquiry</h3>
              <p className={styles.formSub}>
                Preview your enquiry. Official submission channels will be announced.
              </p>

              {submitted ? (
                <div className={styles.formSuccess}>
                  <span className={styles.successIcon}></span>
                  <h4>Enquiry preview ready</h4>
                  <p>
                    Thank you, <strong>{formData.name}</strong>. Your enquiry regarding{' '}
                    <strong>{formData.category}</strong> is shown in this preview.
                  </p>
                  <p className={styles.subText}>
                    No enquiry has been sent. Your entered email is <strong>{formData.email}</strong>.
                  </p>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => setSubmitted(false)}
                  >
                    Edit enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.contactForm}>
                  <div className={styles.field}>
                    <label htmlFor="contact-name">Your Full Name *</label>
                    <input
                      type="text"
                      id="contact-name" name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Dr. K. Venkat"
                    />
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label htmlFor="contact-email">Email Address *</label>
                      <input
                        type="email"
                        id="contact-email" name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@domain.com"
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="contact-organization">Organisation / University *</label>
                      <input
                        type="text"
                        id="contact-organization" name="organization"
                        required
                        value={formData.organization}
                        onChange={handleChange}
                        placeholder="Organization name"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="contact-category">Enquiry Category *</label>
                    <select
                      id="contact-category" name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {CONTACT_INFO.enquiryCategories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="contact-message">Detailed Message *</label>
                    <textarea
                      id="contact-message" name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Detail your question, delegate requirement, or partnership scope..."
                    />
                  </div>

                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="contactPrivacy"
                      name="privacyConsent"
                      required
                      checked={formData.privacyConsent}
                      onChange={handleChange}
                    />
                    <label htmlFor="contactPrivacy">
                      I acknowledge that the submitted contact data will be processed solely to address my enquiry according to the SANKALP privacy policy.
                    </label>
                  </div>

                  <FancyButton type="submit">Preview enquiry</FancyButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
