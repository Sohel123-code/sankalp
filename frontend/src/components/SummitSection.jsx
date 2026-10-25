// The homepage chapters are choreographed by utils/homeMotion (data-home-scene).
// Initial markup stays visible, so a failed animation import never hides content.
export default function SummitSection({ children, id, className = '', label, title, intro, index }) {
  return <section id={id} className={`summit-section ${className}`} data-home-scene data-scroll-owned data-index={index}>
    {(label || title) && <div className="summit-section-heading"><div>{label && <span className="eyebrow">{label}</span>}<h2 aria-label={title}>{title?.split(' ').map((word,index)=><span className="summit-word-mask" key={index}><span data-reveal-word>{word}&nbsp;</span></span>)}</h2></div>{intro && <p>{intro}</p>}</div>}
    <div className="summit-section-body">{children}</div>
  </section>
}
