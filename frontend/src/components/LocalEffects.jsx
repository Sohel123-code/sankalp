import { useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'

// Adapted from the user's effects/esummit gravity mesh, warp comet and reactor.
// See effects/README.md for source paths and lifecycle changes.
export function GravityMesh() {
  const host = useRef(null), canvas = useRef(null)
  const visible = useInView(host, { margin: '80px' })
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!visible || !canvas.current) return
    const ctx = canvas.current.getContext('2d')
    if (!ctx) return
    let frame, width, height, points, cols, rows, tick = 0
    const pointer = { x: -1000, y: -1000 }
    const resize = () => {
      const box = host.current.getBoundingClientRect()
      width = box.width; height = box.height
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.current.width = width * dpr; canvas.current.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.floor(width / 60) + 2; rows = Math.floor(height / 60) + 2
      points = Array.from({ length: cols * rows }, (_, i) => ({ x: i % cols * 60, y: Math.floor(i / cols) * 60, ox: i % cols * 60, oy: Math.floor(i / cols) * 60, vx: 0, vy: 0 }))
    }
    const move = e => { const box = host.current.getBoundingClientRect(); pointer.x = e.clientX - box.left; pointer.y = e.clientY - box.top }
    const leave = () => { pointer.x = -1000 }
    const draw = () => {
      tick += .006
      const mx = pointer.x < 0 ? width * (.52 + Math.sin(tick) * .15) : pointer.x
      const my = pointer.x < 0 ? height * (.5 + Math.cos(tick * .7) * .12) : pointer.y
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'
      for (const p of points) {
        const dx = mx - p.ox, dy = my - p.oy, distance = Math.hypot(dx, dy)
        const pull = distance < 250 ? (250 - distance) / 250 * .7 : 0
        p.vx = (p.vx + (p.ox + dx * pull - p.x) * .15) * .65
        p.vy = (p.vy + (p.oy + dy * pull - p.y) * .15) * .65
        p.x += p.vx; p.y += p.vy
      }
      ctx.strokeStyle = '#ff9349'; ctx.lineWidth = .8; ctx.beginPath()
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const p = points[r * cols + c]
        if (c + 1 < cols) { const n = points[r * cols + c + 1]; ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y) }
        if (r + 1 < rows) { const n = points[(r + 1) * cols + c]; ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y) }
      }
      ctx.stroke()
      ctx.globalCompositeOperation = 'destination-in'
      const mask = ctx.createRadialGradient(mx, my, 0, mx, my, 310)
      mask.addColorStop(0, 'rgba(255,255,255,.85)'); mask.addColorStop(1, 'transparent')
      ctx.fillStyle = mask; ctx.fillRect(0, 0, width, height)
      if (!reduced) frame = requestAnimationFrame(draw)
    }
    resize(); draw()
    const observer = new ResizeObserver(() => { resize(); if (reduced) draw() }); observer.observe(host.current)
    const parent = host.current.parentElement
    parent.addEventListener('pointermove', move); parent.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); parent.removeEventListener('pointermove', move); parent.removeEventListener('pointerleave', leave) }
  }, [visible, reduced])
  return <div ref={host} className="local-effect gravity-mesh" aria-hidden="true"><canvas ref={canvas} /></div>
}

export function Reactor({ progress = 0 }) {
  const ref = useRef(null), visible = useInView(ref), reduced = useReducedMotion()
  return <svg ref={ref} className={`reactor-art ${visible && !reduced ? 'is-active' : ''}`} viewBox="0 0 1000 1000" fill="none" aria-hidden="true">
    <g transform="translate(500 500)">
      <g className="reactor-orbit"><ellipse rx="458" ry="188" stroke="#ffb400" strokeWidth=".6" strokeDasharray="60 340" /><ellipse rx="450" ry="180" stroke="#ff8200" strokeWidth="2.5" strokeDasharray="400 600" /></g>
      <g className="reactor-counter"><ellipse rx="380" ry="150" stroke="#ff8a00" strokeWidth="1.2" strokeDasharray="300 500" /><ellipse rx="384" ry="154" stroke="#993300" strokeDasharray="40 400" /></g>
      <g className="reactor-spokes">{Array.from({ length: 38 }, (_, i) => <path key={i} transform={`rotate(${i * 137.508})`} d={`M ${145 + i % 3 * 12} 0 H ${[250, 320, 390][i % 3]}`} stroke={i % 3 ? '#993300' : '#ffb400'} strokeWidth={i % 2 ? '.6' : '1.2'} />)}</g>
      {Array.from({ length: 24 }, (_, i) => <g key={i} transform={`rotate(${i * 137.508}) translate(${320 + i % 5 * 28} 0)`}><circle r={i % 4 + 2} stroke="#ff8a00" /><circle r="1" fill="#ffb400" /></g>)}
      <motion.g animate={{ rotate: progress * 60 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 45, damping: 20 }}>
        <circle r="130" stroke="#ff8a00" strokeWidth="2" strokeDasharray="80 40" />
        {[30, 60, 90, 135, 180, 225, 270, 315].map(a => <rect key={a} transform={`rotate(${a}) translate(130 0)`} x="-4" y="-5" width="8" height="10" fill="#ffb400" />)}
      </motion.g>
      <g className="reactor-gyro"><ellipse rx="90" ry="50" stroke="#ff8200" /><ellipse rx="70" ry="35" stroke="#ffb400" transform="rotate(65)" /></g>
      <circle r="32" fill="#090909" stroke="#993300" /><circle r="20" stroke="#ff8a00" strokeWidth=".5" /><path d="M-15 0H15M0 -15V15" stroke="#ffb400" /><circle r="4.5" fill="#ffb400" />
    </g>
  </svg>
}

export function CometReveal({ children }) {
  const ref = useRef(null), reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const pathLength = useTransform(scrollYProgress, [0, .65, 1], [.15, 1, 1])
  const rotate = useTransform(scrollYProgress, [0, 1], [-12, 16])
  return <section ref={ref} className="comet-section">
    <motion.svg style={{ rotate: reduced ? 0 : rotate }} className="comet-art" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {Array.from({ length: 30 }, (_, i) => <motion.path key={i} d={`M -160 ${650 + i * 7} C 960 ${580 + i * 4}, 920 ${-150 + i * 3}, 570 -70`} fill="none" stroke={i % 4 === 0 ? '#ffbc68' : '#ff6f22'} strokeWidth={i % 4 === 0 ? 2 : .7} opacity={.12 + Math.sin(i / 30 * Math.PI) * .4} style={{ pathLength: reduced ? 1 : pathLength }} />)}
    </motion.svg>
    <div className="comet-content section-shell">{children}</div>
  </section>
}
