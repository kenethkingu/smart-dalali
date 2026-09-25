interface LogoProps {
  size?: number
  tone?: 'dark' | 'light'
  showWordmark?: boolean
  className?: string
}

export function Logo({ size = 40, tone, showWordmark = true, className }: LogoProps) {
  const fill = tone === 'light' ? '#FFFFFF' : tone === 'dark' ? '#0B0B0C' : 'var(--pl-text)'
  const gapColor = tone === 'light' ? '#0B0B0C' : tone === 'dark' ? '#FFFFFF' : 'var(--pl-bg)'

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className ?? ''}`}>
      <svg width={size} height={size * 0.7} viewBox="0 0 200 140" fill="none">
        {/* roof */}
        <path d="M100 10 L180 100 L20 100 Z" fill={fill} />
        {/* notch cut into the roof's base to create the doorway gap */}
        <rect x="78" y="78" width="44" height="22" fill={gapColor} />
        {/* base bar */}
        <rect x="50" y="112" width="100" height="18" rx="9" fill={fill} />
      </svg>
      {showWordmark && (
        <span
          className="font-extrabold tracking-[0.25em]"
          style={{ color: fill, fontSize: size * 0.34 }}
        >
          PROLAND
        </span>
      )}
    </div>
  )
}
