const clamp = value => Math.max(0, Math.min(1, value))

// Pure geometry: scrolling back to the same position produces the same frame.
export function revealFrame(top, viewportHeight, index = 0, heading = false) {
  const viewport = Math.max(1, viewportHeight)
  const start = viewport * (heading ? .96 : .94)
  const end = viewport * (heading ? .64 : .48)
  const stagger = heading ? 0 : Math.min(index, 3) * .055
  const progress = clamp(((start - top) / (start - end) - stagger) / (1 - stagger))
  const eased = 1 - Math.pow(1 - progress, 3)
  return { progress, y: (1 - eased) * (heading ? 36 : 85), scale: .94 + eased * .06, opacity: clamp(progress * 1.7), inset: (1 - eased) * 100 }
}
