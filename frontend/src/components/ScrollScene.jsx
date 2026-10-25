import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const SceneProgress = createContext(null)
const MotionLink = motion.create(Link)

/** A native-scroll chapter: enter, assemble, briefly hold, then recede.
 * Tall content stays in normal flow; no wheel interception or nested scroller.
 */
export function ScrollScene({ children, name, className = '' }) {
  const ref = useRef(null), content = useRef(null), reduced = useReducedMotion()
  const [pinned, setPinned] = useState(false)
  // Measure the content, not the outer runway: centered headings must start
  // revealing when they reach the screen, rather than while still below it.
  const { scrollYProgress: enter } = useScroll({ target: content, offset: ['start .98', 'start .58'] })
  const { scrollYProgress: exit } = useScroll({ target: ref, offset: ['end end', 'end start'] })
  const y = useTransform(enter, [0, 1], [100, 0])
  const scale = useTransform(() => (.90 + Math.max(0, Math.min(1, enter.get())) * .10) * (pinned ? 1 - Math.max(0, Math.min(1, exit.get())) * .06 : 1))
  const enterOpacity = useTransform(enter, [0, .18, .65, 1], [0, .25, 1, 1])
  const exitOpacity = useTransform(exit, [0, .25, .85, 1], [1, 1, .12, 0])
  const opacity = useTransform(() => enterOpacity.get() * exitOpacity.get())
  const clipPath = useTransform(enter, [0, 1], ['inset(12% 5% 0% 5% round 30px)', 'inset(0% 0% 0% 0% round 0px)'])
  useEffect(() => {
    if (!content.current || reduced) return
    const measure = () => {
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 88
      setPinned(window.innerWidth >= 900 && content.current.offsetHeight <= window.innerHeight - header - 12)
    }
    measure()
    const resize = new ResizeObserver(measure); resize.observe(content.current)
    window.addEventListener('resize', measure)
    return () => { resize.disconnect(); window.removeEventListener('resize', measure) }
  }, [reduced])
  return <div ref={ref} id={`chapter-${name}`} className={`scroll-scene ${className}`} data-scene={name} data-pinned={pinned && !reduced ? 'true' : 'false'}>
    <div className="scene-stage"><motion.div ref={content} className="scene-surface" style={reduced ? undefined : { y, scale, opacity, clipPath }}>
      <SceneProgress.Provider value={reduced ? null : enter}>{children}</SceneProgress.Provider>
    </motion.div></div>
  </div>
}

function HeadingCharacter({ character, index, total, progress }) {
  const start = .04 + index / total * .32
  const y = useTransform(progress, [start, start + .23], ['115%', '0%'])
  const opacity = useTransform(progress, [start, start + .18], [0, 1])
  const rotateX = useTransform(progress, [start, start + .23], [65, 0])
  return <motion.span className="scene-character" style={{ y, opacity, rotateX }}>{character}</motion.span>
}

export function ScrollHeading({ text, className = '' }) {
  const context = useContext(SceneProgress), ready = useMotionValue(1)
  const progress = context || ready
  let cursor = 0
  return <h2 className={`scene-heading ${className}`} aria-label={text}>
    <span aria-hidden="true">{text.split(' ').map((word, i) => <span className="scene-word" key={`${word}-${i}`}>{[...word].map(character => { const index = cursor++; return <HeadingCharacter key={index} character={character} index={index} total={text.length} progress={progress} /> })}{' '}</span>)}</span>
  </h2>
}

export function ScrollItem({ children, index = 0, className = '', as = 'div', ...props }) {
  const context = useContext(SceneProgress), ready = useMotionValue(1)
  const progress = context || ready, start = .18 + Math.min(index, 5) * .055
  const opacity = useTransform(progress, [start, start + .3], [0, 1])
  const y = useTransform(progress, [start, start + .36], [65, 0])
  const rotateX = useTransform(progress, [start, start + .36], [9, 0])
  const Tag = as === 'link' ? MotionLink : motion.div
  return <Tag className={`scene-item ${className}`} style={{ opacity, y, rotateX }} {...props}>{children}</Tag>
}
