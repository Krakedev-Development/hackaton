import { useState } from 'react'
import { POST_GAME_QUIZ } from '../constants/quizQuestions'
import './PostGameQuiz.css'

interface PostGameQuizProps {
  onClose: () => void
  onExit?: () => void
}

export default function PostGameQuiz({ onClose, onExit }: PostGameQuizProps) {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)

  const question = POST_GAME_QUIZ[index]
  const total = POST_GAME_QUIZ.length

  const handleAnswer = (optionIndex: number) => {
    if (selected !== null || !question) return
    setSelected(optionIndex)
    if (optionIndex === question.correctIndex) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (index + 1 >= total) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  if (finished) {
    const ratio = score / total
    const message =
      ratio >= 0.8
        ? '!Excelente! Tu michi sabe mucho de necesidades y deseos.'
        : ratio >= 0.5
          ? '!Bien! Repasa tus consejos y sigue practicando.'
          : '!Sigue intentando! Lee tus consejos otra vez.'

    return (
      <div className="post-quiz" role="dialog" aria-modal="true">
        <div className="post-quiz__panel">
          <h2 className="post-quiz__title">!Quiz terminado!</h2>
          <p className="post-quiz__score">
            Acertaste <strong>{score}</strong> de {total}
          </p>
          <p className="post-quiz__message">{message}</p>
          <button
            type="button"
            className="post-quiz__btn post-quiz__btn--primary"
            onClick={onClose}
          >
            Volver al resultado
          </button>
          {onExit && (
            <button type="button" className="post-quiz__btn" onClick={onExit}>
              Volver al menu
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!question) return null

  return (
    <div className="post-quiz" role="dialog" aria-modal="true">
      <div className="post-quiz__panel">
        <p className="post-quiz__progress">
          Pregunta {index + 1} de {total}
        </p>
        <h2 className="post-quiz__prompt">{question.prompt}</h2>
        <ul className="post-quiz__options">
          {question.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex
            const isCorrect = optionIndex === question.correctIndex
            let className = 'post-quiz__option'
            if (selected !== null) {
              if (isCorrect) className += ' post-quiz__option--correct'
              else if (isSelected) className += ' post-quiz__option--wrong'
            }

            return (
              <li key={option}>
                <button
                  type="button"
                  className={className}
                  onClick={() => handleAnswer(optionIndex)}
                  disabled={selected !== null}
                >
                  {option}
                </button>
              </li>
            )
          })}
        </ul>
        {selected !== null && (
          <>
            <p className="post-quiz__hint">{question.hint}</p>
            <button
              type="button"
              className="post-quiz__btn post-quiz__btn--primary"
              onClick={handleNext}
            >
              {index + 1 >= total ? 'Ver resultado' : 'Siguiente'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

