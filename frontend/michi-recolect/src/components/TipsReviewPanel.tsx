import type { DecisionScenario } from '../constants/decisionScenarios'
import type { CrashChoice } from '../types/game'
import type { TipPair } from '../hooks/collectedTips'
import './TipsReviewPanel.css'

export interface MilestoneReview {
  milestone: number
  scenario: DecisionScenario
  choice: CrashChoice
}

interface TipsReviewPanelProps {
  pairs: TipPair[]
  milestones: MilestoneReview[]
  onClose: () => void
}

export default function TipsReviewPanel({
  pairs,
  milestones,
  onClose,
}: TipsReviewPanelProps) {
  const sortedMilestones = [...milestones].sort((a, b) => a.milestone - b.milestone)

  return (
    <div className="tips-review" role="dialog" aria-modal="true" aria-labelledby="tips-review-title">
      <div className="tips-review__panel">
        <h2 id="tips-review-title" className="tips-review__title">
          Tus consejos
        </h2>
        <p className="tips-review__subtitle">
          Preguntas y datos que atrapaste con el circulo verde
        </p>

        <section className="tips-review__section" aria-labelledby="tips-pairs-title">
          <h3 id="tips-pairs-title" className="tips-review__section-title">
            Consejos emparejados
          </h3>
          <ul className="tips-review__pairs">
            {pairs.map((pair, index) => (
              <li key={`${pair.pregunta}-${index}`} className="tips-review__pair">
                <p className="tips-review__pair-q">
                  <span className="tips-review__badge tips-review__badge--q">?</span>
                  {pair.pregunta}
                </p>
                <p className="tips-review__pair-a">
                  <span className="tips-review__badge tips-review__badge--a">!</span>
                  {pair.consejo}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="tips-review__section" aria-labelledby="tips-milestones-title">
          <h3 id="tips-milestones-title" className="tips-review__section-title">
            Tus 3 preguntas del juego
          </h3>
          <ul className="tips-review__milestones">
            {sortedMilestones.map((entry) => (
              <li key={entry.milestone} className="tips-review__milestone">
                <p className="tips-review__milestone-pts">{entry.milestone} pts</p>
                <p className="tips-review__milestone-q">{entry.scenario.question}</p>
                <p className="tips-review__milestone-choice">
                  Tu elegiste:{' '}
                  <strong>
                    {entry.choice === 'need'
                      ? entry.scenario.need.label
                      : entry.scenario.desire.label}
                  </strong>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <button type="button" className="tips-review__btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  )
}
