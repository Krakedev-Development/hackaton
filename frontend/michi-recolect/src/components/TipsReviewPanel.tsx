import type { DecisionScenario } from '../constants/decisionScenarios'
import type { InfoTip } from '../constants/gameCopy'
import type { CrashChoice } from '../types/game'
import { MAX_COLLECTED_TIPS } from '../hooks/collectedTips'
import './TipsReviewPanel.css'

export interface MilestoneReview {
  milestone: number
  scenario: DecisionScenario
  choice: CrashChoice
}

interface TipsReviewPanelProps {
  tips: InfoTip[]
  milestones: MilestoneReview[]
  onClose: () => void
}

export default function TipsReviewPanel({
  tips,
  milestones,
  onClose,
}: TipsReviewPanelProps) {
  const displayTips = tips.slice(0, MAX_COLLECTED_TIPS)
  const sortedMilestones = [...milestones].sort((a, b) => a.milestone - b.milestone)

  return (
    <div className="tips-review" role="dialog" aria-modal="true" aria-labelledby="tips-review-title">
      <div className="tips-review__panel">
        <header className="tips-review__header">
          <h2 id="tips-review-title" className="tips-review__title">
            Tus consejos
          </h2>
          <p className="tips-review__subtitle">5 consejos del tema + tus 3 decisiones</p>
        </header>

        <div className="tips-review__body">
          <section className="tips-review__col" aria-labelledby="tips-list-title">
            <h3 id="tips-list-title" className="tips-review__col-title">
              Consejos ({displayTips.length}/5)
            </h3>
            <ol className="tips-review__tips-list">
              {displayTips.map((tip, index) => (
                <li key={`${tip.text}-${index}`} className="tips-review__tip">
                  <span className="tips-review__badge tips-review__badge--a">!</span>
                  <span className="tips-review__tip-text">{tip.text}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="tips-review__col" aria-labelledby="tips-milestones-title">
            <h3 id="tips-milestones-title" className="tips-review__col-title">
              Preguntas 150 / 300 / 500
            </h3>
            <ul className="tips-review__milestones">
              {sortedMilestones.map((entry) => (
                <li key={entry.milestone} className="tips-review__milestone">
                  <span className="tips-review__milestone-pts">{entry.milestone}</span>
                  <p className="tips-review__milestone-q">{entry.scenario.question}</p>
                  <p className="tips-review__milestone-choice">
                    {entry.choice === 'need'
                      ? entry.scenario.need.label
                      : entry.scenario.desire.label}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <button type="button" className="tips-review__btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  )
}

