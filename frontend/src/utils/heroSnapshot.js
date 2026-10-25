// Draws the hero's real text into a transparent image the size of the hero, so the opening dots
// assemble exactly where the heading, sub-heading and tagline sit (same font, colour and position).

const translateY = (element, stop) => {
  let total = 0
  for (let node = element; node && node !== stop; node = node.parentElement) {
    const transform = getComputedStyle(node).transform
    if (transform && transform !== 'none') total += new DOMMatrixReadOnly(transform).m42
  }
  return total
}

const fontOf = style => `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`

export async function buildHeroSnapshot(hero) {
  // The glyph positions come from the live layout, so the exact fonts must be loaded first. A slow
  // font host must not stall the opening for long, so the wait is capped.
  const wanted = [...hero.querySelectorAll('.hero-liquid-name, .hero-subname, .hero-tagline')].flatMap(line => [line, ...line.children])
  const loads = wanted.map(element => document.fonts?.load(fontOf(getComputedStyle(element)), element.textContent).catch(() => {}))
  await Promise.race([Promise.all(loads), new Promise(resolve => setTimeout(resolve, 1500))])
  const box = hero.getBoundingClientRect()
  const scale = Math.min(2, window.devicePixelRatio || 1)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(box.width * scale)
  canvas.height = Math.round(box.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2D context')
  ctx.scale(scale, scale)
  ctx.textBaseline = 'alphabetic'

  const lines = ['.hero-liquid-name', '.hero-subname', '.hero-tagline'].map(selector => hero.querySelector(selector)).filter(Boolean)
  if (!lines.length) throw new Error('Hero text not found')
  const range = document.createRange()
  for (const line of lines) {
    const shift = translateY(line, hero)
    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const holder = node.parentElement
      const style = getComputedStyle(holder)
      ctx.font = fontOf(style)
      ctx.fillStyle = style.color === 'rgba(0, 0, 0, 0)' ? '#f1ece4' : style.color
      const ascent = ctx.measureText('M').fontBoundingBoxAscent
      // One glyph at a time: each box already includes tracking, kerning and line wrapping.
      for (let index = 0; index < node.length; index++) {
        const character = node.data[index]
        if (!character.trim()) continue
        range.setStart(node, index); range.setEnd(node, index + 1)
        const rect = range.getBoundingClientRect()
        ctx.fillText(character, rect.left - box.left, rect.top + ascent - shift - box.top)
      }
    }
  }
  return { url: canvas.toDataURL('image/png'), width: box.width, height: box.height }
}
