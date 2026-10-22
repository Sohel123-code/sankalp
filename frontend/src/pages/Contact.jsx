import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { CONTACT_INFO } from '../data/sankalpData'
import styles from './Contact.module.css'

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

      <div className={styles.container}>
        {/* ── Status Advisory ── */}
        <div className={styles.advisoryBanner}>
          <span className={styles.advIcon}>ℹ️</span>
          <p>
            All official contact details, helplines, and secretariat offices are preliminary placeholders pending formal state gazette announcement.
          </p>
        </div>

        <div className={styles.twoCol}>
          {/* Left Column: Direct Communication Channels */}
          <div className={styles.infoCol}>
            <div className={styles.secretariatCard}>
              <h3 className={styles.cardTitle}>🏛️ Organizing Secretariat</h3>
              <p className={styles.addressText}>{CONTACT_INFO.officeAddress}</p>
              <p className={styles.phoneText}>📞 {CONTACT_INFO.phone}</p>
            </div>

            <div className={styles.emailChannelsCard}>
              <h3 className={styles.cardTitle}>✉️ Direct Department Desks</h3>
              <ul className={styles.deskList}>
                <li>
                  <span className={styles.deskName}>General Enquiries:</span>
                  <a href={`mailto:${CONTACT_INFO.generalEmail}`} className={styles.deskLink}>
                    {CONTACT_INFO.generalEmail}
                  </a>
                </li>
                <li>
                  <span className={styles.deskName}>Registration &amp; Delegate Support:</span>
                  <a href={`mailto:${CONTACT_INFO.registrationEmail}`} className={styles.deskLink}>
                    {CONTACT_INFO.registrationEmail}
                  </a>
                </li>
                <li>
                  <span className={styles.deskName}>Partnership &amp; Sponsorship:</span>
                  <a href={`mailto:${CONTACT_INFO.partnershipsEmail}`} className={styles.deskLink}>
                    {CONTACT_INFO.partnershipsEmail}
                  </a>
                </li>
                <li>
                  <span className={styles.deskName}>Innovation Challenge Desk:</span>
                  <a href={`mailto:${CONTACT_INFO.challengeEmail}`} className={styles.deskLink}>
                    {CONTACT_INFO.challengeEmail}
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.socialCard}>
              <h3 className={styles.cardTitle}>🌐 Official Social Channels</h3>
              <div className={styles.socialLinks}>
                {CONTACT_INFO.socials.map(s => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.socBtn}
                  >
                    <span>{s.icon}</span> {s.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <h3 className={styles.formH3}>Send An Official Enquiry</h3>
              <p className={styles.formSub}>
                Fill out the dispatch form below. Our response time is typically within 1 business day.
              </p>

              {submitted ? (
                <div className={styles.formSuccess}>
                  <span className={styles.successIcon}>🎉</span>
                  <h4>Message Dispatched Successfully!</h4>
                  <p>
                    Thank you, <strong>{formData.name}</strong>. Your enquiry regarding{' '}
                    <strong>{formData.category}</strong> has been logged.
                  </p>
                  <p className={styles.subText}>
                    An acknowledgment has been dispatched to <strong>{formData.email}</strong>.
                  </p>
                  <button
                    className={styles.btnSecondary}
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.contactForm}>
                  <div className={styles.field}>
                    <label>Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Dr. K. Venkat"
                    />
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@domain.com"
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Organisation / University *</label>
                      <input
                        type="text"
                        name="organization"
                        required
                        value={formData.organization}
                        onChange={handleChange}
                        placeholder="Organization name"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Enquiry Category *</label>
                    <select
                      name="category"
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
                    <label>Detailed Message *</label>
                    <textarea
                      name="message"
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

                  <button type="submit" className={styles.btnSubmit}>
                    Dispatch Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
