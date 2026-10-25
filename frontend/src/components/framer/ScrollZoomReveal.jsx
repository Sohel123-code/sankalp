import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

// Content-slot adaptation of the supplied Scroll Zoom Reveal. Retains its
// sticky expanding aperture, rounded-corner spring and delayed content reveal.
// Real summit content replaces the reference's stock showreel photograph.
export default function ScrollZoomReveal({ children }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const aperture = useTransform(scrollYProgress, [0, .65], ['inset(38% 38% round 80px)', 'inset(0% 0% round 16px)'])
  const scaleRaw = useTransform(scrollYProgress, [0, .65], [.88, 1])
  const scale = useSpring(scaleRaw, { stiffness: 90, damping: 25, mass: .6 })
  const opacity = useTransform(scrollYProgress, [.25, .65], [0, 1])
  const y = useTransform(scrollYProgress, [.25, .65], [60, 0])
  return <section ref={ref} className="workshop-zoom" data-framer-effect="scroll-zoom-reveal" data-effect-owned data-scroll-owned>
    <div className="workshop-zoom-stage">
      <motion.div className="workshop-zoom-aperture" style={reduced ? undefined : { clipPath: aperture, scale }}>
        <motion.div style={reduced ? undefined : { opacity, y }}>{children}</motion.div>
      </motion.div>
    </div>
  </section>
}
