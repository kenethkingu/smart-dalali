import confetti from 'canvas-confetti'

const BURST_MS = 2000

function themeColors(): string[] {
  const styles = getComputedStyle(document.documentElement)
  return ['--pl-accent', '--pl-text', '--pl-line'].map(name => styles.getPropertyValue(name).trim()).filter(Boolean)
}

export function fireSuccessConfetti(): void {
  const colors = themeColors()
  const end = Date.now() + BURST_MS
  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors, disableForReducedMotion: true })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors, disableForReducedMotion: true })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}
