// Keep the contained WebGL stage in its own coordinate system. Browser-space
// offsets (the fixed header, scrolling, side gutters) only apply to full-screen stages.
export function openingTarget(box, width, height, contained) {
  if (contained || box.width < 2 || box.height < 2) {
    return { x: width / 2, y: height / 2, w: width, h: height }
  }
  return { x: box.left + box.width / 2, y: box.top + box.height / 2, w: box.width, h: box.height }
}

export function openingQuality(width, height, pixelRatio = 1) {
  const pixels = Math.max(1, width * height)
  return {
    // Bound fragment work even on 4K and high-DPI phones without reducing FPS.
    dpr: Math.min(pixelRatio, 1.5, Math.sqrt(1500000 / pixels)),
    segments: width < 640 ? 16 : 24,
  }
}
