import './PixelHearts.css'

interface PixelHeartsProps {
  total?: number
  filled: number
  label?: string
}

export default function PixelHearts({
  total = 3,
  filled,
  label = 'Vidas',
}: PixelHeartsProps) {
  return (
    <div className="pixel-hearts" aria-label={`${label}: ${filled} de ${total}`}>
      <span className="pixel-hearts__label">{label}</span>
      <div className="pixel-hearts__row">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`pixel-hearts__heart${i < filled ? ' pixel-hearts__heart--full' : ' pixel-hearts__heart--empty'}`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  )
}
