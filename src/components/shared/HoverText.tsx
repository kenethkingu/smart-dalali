export function HoverText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`group inline-flex ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="transition-all duration-300 group-hover:hover:text-pl-accent"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
