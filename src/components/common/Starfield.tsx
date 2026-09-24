type Star = {
  x: number
  y: number
  size: number
  opacity: number
  twinkle: boolean
  delay: number
  duration: number
}

/** Small seeded PRNG (mulberry32): the same seed always draws the same sky, so the layout is a stable composition, not noise. */
function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Glint = {
  x: number
  y: number
  size: number
  champagne: boolean
  delay: number
  duration: number
}

function drawStars(count: number, random: () => number): Star[] {
  return Array.from({ length: count }, () => {
    const size = random() < 0.2 ? 2.5 : random() < 0.5 ? 1.5 : 1
    return {
      x: random() * 100,
      y: random() * 100,
      size,
      opacity: 0.25 + random() * 0.45,
      // Most stars twinkle at their own pace; the rest stay still so the sky never feels busy.
      twinkle: random() < 0.6,
      delay: -random() * 6,
      duration: 3 + random() * 4,
    }
  })
}

function drawGlints(count: number, random: () => number): Glint[] {
  return Array.from({ length: count }, (_, index) => ({
    x: 4 + random() * 92,
    y: 6 + random() * 88,
    size: 8 + random() * 6,
    champagne: index % 3 === 0,
    delay: -random() * 8,
    duration: 5 + random() * 4,
  }))
}

type StarfieldProps = {
  count?: number
  /** Four-point star glints that fade in, turn slightly, and fade out. */
  glints?: number
  seed?: number
  /** Adds one comet that crosses every ~10s. */
  comet?: boolean
  className?: string
}

/**
 * Decorative twinkling starfield (CSS keyframes in global.css — no JS animation loop).
 * The parent must be `relative` with `overflow-hidden`; pass `-z-10` (plus `isolate` on the parent) to sit behind content.
 */
export function Starfield({ count = 32, glints = 0, seed = 7, comet = false, className = '' }: StarfieldProps) {
  const random = seededRandom(seed)
  const stars = drawStars(count, random)
  const glintStars = drawGlints(glints, random)

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {stars.map((star, index) => (
        <span
          key={index}
          className={`star ${star.twinkle ? 'star-twinkle' : ''} ${star.size > 2 ? 'star-bright' : ''}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
      {glintStars.map((glint, index) => (
        <svg
          key={`glint-${index}`}
          viewBox="0 0 24 24"
          className={`star-glint ${glint.champagne ? 'text-champagne' : 'text-starlight'}`}
          style={{
            left: `${glint.x}%`,
            top: `${glint.y}%`,
            width: glint.size,
            height: glint.size,
            animationDelay: `${glint.delay}s`,
            animationDuration: `${glint.duration}s`,
          }}
        >
          <path
            fill="currentColor"
            d="M12 1.5c.7 5.6 3.4 8.6 9.5 10.5-6.1 1.9-8.8 4.9-9.5 10.5-.7-5.6-3.4-8.6-9.5-10.5 6.1-1.9 8.8-4.9 9.5-10.5Z"
          />
        </svg>
      ))}
      {comet && (
        <span className="comet-track">
          <span className="comet" />
        </span>
      )}
    </div>
  )
}
