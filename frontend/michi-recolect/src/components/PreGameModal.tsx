import { BRIEFING_ITEMS, BRIEFING_TITLE } from '../constants/guideContent'
import './PreGameModal.css'

interface PreGameModalProps {
  stageTitle: string
  ageRange: string
  onStart: () => void
  onExit?: () => void
}

export default function PreGameModal({
  stageTitle,
  ageRange,
  onStart,
  onExit,
}: PreGameModalProps) {
  return (
    <div className="pre-game" role="dialog" aria-modal="true" aria-labelledby="pre-game-title">
      <div className="pre-game__panel">
        <p className="pre-game__eyebrow">{ageRange}</p>
        <h2 id="pre-game-title" className="pre-game__title">
          {stageTitle}
        </h2>
        <p className="pre-game__subtitle">{BRIEFING_TITLE}</p>

        <section className="pre-game__guide" aria-labelledby="pre-game-guide-title">
          <h3 id="pre-game-guide-title" className="pre-game__guide-title">
            Guia rapida
          </h3>
          <ol className="pre-game__guide-list">
            {BRIEFING_ITEMS.map((item, index) => (
              <li key={item} className="pre-game__guide-item">
                <span className="pre-game__guide-num" aria-hidden>
                  {index + 1}
                </span>
                <span className="pre-game__guide-text">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="pre-game__actions">
          <button
            type="button"
            className="pre-game__btn pre-game__btn--start"
            onClick={onStart}
          >
            !Empezar a jugar!
          </button>
          {onExit && (
            <button
              type="button"
              className="pre-game__btn pre-game__btn--back"
              onClick={onExit}
            >
              Volver al menu
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
