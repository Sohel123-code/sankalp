import { Link } from 'react-router-dom'
import PageHeader from './PageHeader'
import styles from '../pages/Policy.module.css'

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function PolicyContent({ title, description, sections }) {
  return (
    <div className={styles.page}>
      <PageHeader badge="Summit policies · Pending approval" title={title} subtitle={description} breadcrumb={[{ label: title }]} />
      <div className={styles.container}>
        <div className={styles.card}>
          <nav className={styles.toc} aria-label="On this page">
            <p>On this page</p>
            {sections.map(([heading], i) => <a key={heading} href={`#${slug(heading)}`}><span>{String(i + 1).padStart(2, '0')}</span>{heading}</a>)}
            <Link className={styles.tocContact} to="/contact">Contact us →</Link>
          </nav>
          <div className={styles.body}>
            <p className={styles.status}>Draft · final policy follows organiser approval.</p>
            {sections.map(([heading, text], i) => (
              <section key={heading} id={slug(heading)} className={styles.section}>
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                <div><h2>{heading}</h2><p>{text}</p></div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
