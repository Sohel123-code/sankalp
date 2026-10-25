import { motion, useReducedMotion } from 'framer-motion'

// React adaptation of the supplied Interactive Components/Preloader/LoadScreen.
// Preserve its five columns and centre-out, three-stage opening. Framer's
// generated variant runtime is replaced by the site's existing Motion runtime.
export default function LoadScreen() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return <div className="framer-load-screen" aria-hidden="true">
    {[2, 1, 0, 1, 2].map((stage, index) => <motion.div key={index}
      initial={{ scaleY: 1 }} animate={{ scaleY: 0 }}
      transition={{ delay: .08 + stage * .1, duration: .58, ease: [.76, 0, .24, 1] }}
      style={{ '--panel': index }} />)}
  </div>
}
