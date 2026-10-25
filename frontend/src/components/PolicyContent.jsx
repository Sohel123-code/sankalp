import { Link } from 'react-router-dom'
import PageHeader from './PageHeader'
import styles from '../pages/Policy.module.css'

export default function PolicyContent({ title, description, sections }) {
  return <div className={styles.page}><PageHeader badge="Summit policies · Pending approval" title={title} subtitle={description} breadcrumb={[{ label: title }]} /><div className={styles.container}><div className={styles.card}><div className={styles.calloutBanner}><p><strong>Policy awaiting approval.</strong> The content master provides an outline. The final policy and organising entity details will be published following approval.</p></div>{sections.map(([heading, text], i) => <section key={heading} className={styles.section}><h2>{String(i + 1).padStart(2, '0')} / {heading}</h2><p>{text}</p></section>)}<Link className="fancy-button secondary" to="/contact">Contact information </Link></div></div></div>
}
