import { createElement as h, useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { addPropertyControls, ControlType } from './runtime'

// Supplied Arc Carousel geometry and angle wrapping, adapted to one DOM copy
// per track with a controlled circular selection and a timed reading interval.
const wrap = (value, length) => ((value % length) + length) % length

export default function ArcCarousel({ slides = [], radius = 1100, spacing = 25, activeIndex = 0, onIndexChange, autoplay = false, autoplayDelay = 3000 }) {
  const count = slides.length
  const totalArc = Math.max(count, 1) * spacing
  const rotation = useMotionValue(-activeIndex * spacing)
  const callback = useRef(onIndexChange)
  const control = useRef(null), timer = useRef(0), startRotation = useRef(0)
  const [dragging, setDragging] = useState(false)
  useEffect(() => { callback.current = onIndexChange }, [onIndexChange])
  useEffect(() => {
    if (dragging || count < 2) return
    // 4 -> 1 travels forward one slot, never backwards across the collection.
    const base = -activeIndex * spacing
    const target = base + Math.round((rotation.get() - base) / totalArc) * totalArc
    const schedule = () => {
      if (autoplay) timer.current = window.setTimeout(() => callback.current?.(wrap(activeIndex + 1, count)), autoplayDelay)
    }
    if (Math.abs(rotation.get() - target) < .01) schedule()
    else control.current = animate(rotation, target, { duration: .7, ease: [.22, 1, .36, 1], onComplete: schedule })
    return () => { clearTimeout(timer.current); control.current?.stop() }
  }, [activeIndex, count, spacing, totalArc, autoplay, autoplayDelay, dragging, rotation])
  const select = step => {
    clearTimeout(timer.current)
    callback.current?.(wrap(activeIndex + step, count))
  }
  const onKeyDown = event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault(); select(event.key === 'ArrowRight' ? 1 : -1)
  }
  const onPanStart = () => {
    clearTimeout(timer.current); control.current?.stop()
    startRotation.current = rotation.get(); setDragging(true)
  }
  const onPan = (_event, info) => {
    const movement = Math.max(-spacing * 1.05, Math.min(spacing * 1.05, info.offset.x / 10))
    rotation.set(startRotation.current + movement)
  }
  const onPanEnd = (_event, info) => {
    const distance = rotation.get() - startRotation.current
    const step = Math.abs(distance) > spacing * .15 ? (distance < 0 ? 1 : -1) : Math.abs(info.velocity.x) > 350 ? (info.velocity.x < 0 ? 1 : -1) : 0
    if (step) select(step)
    setDragging(false)
  }
  if (!count) return null
  return h('div', { style: containerStyle, tabIndex: 0, onKeyDown, role: 'region', 'aria-roledescription': 'carousel', 'aria-label': 'Technology track carousel' },
    h(motion.div, { style: { ...trackStyle, cursor: dragging ? 'grabbing' : 'grab' }, onPanStart, onPan, onPanEnd },
      slides.map((child, index) => h(CarouselItem, { key: index, index, child, active: index === activeIndex, rotation, spacing, totalArc, radius }))))
}
function CarouselItem({ index, child, active, rotation, spacing, totalArc, radius }) {
  const angle = useTransform(rotation, value => wrap(index * spacing + value + totalArc / 2, totalArc) - totalArc / 2)
  const opacity = useTransform(angle, value => {
    const edge = totalArc / 2, fadeStart = Math.min(spacing * 1.65, edge * .83)
    return Math.max(0, Math.min(1, (edge - Math.abs(value)) / (edge - fadeStart)))
  })
  const zIndex = useTransform(angle, value => Math.round(1000 - Math.abs(value)))
  const startX = useRef(0)
  return h(motion.div, { 'data-arc-slide': index, style: { position: 'absolute', left: '50%', top: '50%', x: '-50%', y: '-50%', rotate: angle, transformOrigin: `center ${radius}px`, opacity, zIndex, willChange: 'transform' } },
    h('div', {
      inert: active ? undefined : true, 'aria-hidden': active ? undefined : true,
      onPointerDown: event => { startX.current = event.clientX },
      onClickCapture: event => { if (event.detail !== 0 && Math.abs(event.clientX - startX.current) > 5) { event.preventDefault(); event.stopPropagation() } },
      onDragStart: event => event.preventDefault(),
      style: { display: 'inline-block', position: 'relative', touchAction: 'pan-y', userSelect: 'none', pointerEvents: 'auto' },
    }, child))
}
const containerStyle = { width: '100%', height: '100%', position: 'relative', backgroundColor: 'transparent', perspective: '1000px', overflow: 'hidden', userSelect: 'none' }
const trackStyle = { position: 'relative', width: '100%', height: '100%', touchAction: 'pan-y' }
addPropertyControls(ArcCarousel, {
  slides: { type: ControlType.Array, control: { type: ControlType.ComponentInstance } },
  radius: { type: ControlType.Number, defaultValue: 1100 },
  spacing: { type: ControlType.Number, defaultValue: 25 },
  autoplay: { type: ControlType.Boolean, defaultValue: false },
  autoplayDelay: { type: ControlType.Number, defaultValue: 3000 },
})
