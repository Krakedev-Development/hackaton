import { useRef, useState } from 'react'
import { getQuizForStage, type QuizQuestion } from '../constants/quizQuestions'
import { getQuizPassRequirement } from '../hooks/stageProgress'
import './PostGameQuiz.css'

interface PostGameQuizProps {
  stageId: number
  quizOnly?: boolean
  onClose: () => void
  onExit?: () => void
  onQuizPassed?: (stageId: number, score: number) => void
}

export default function PostGameQuiz({
  stageId,
  quizOnly = false,
  onClose,
  onExit,
  onQuizPassed,
}: PostGameQuizProps) {
  const questions: QuizQuestion[] = getQuizForStage(stageId)
  const { min: passMin, total } = getQuizPassRequirement()
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [passed, setPassed] = useState(false)

  const question = questions[index]

  const handleAnswer = (optionIndex: number) => {
    if (selected !== null || !question) return
    setSelected(optionIndex)
    if (optionIndex === question.correctIndex) {
      scoreRef.current += 1
      setScore(scoreRef.current)
    }
  }

  const handleNext = () => {
    if (!question) return
    if (index + 1 >= total) {
      const finalScore = scoreRef.current
      const didPass = finalScore >= passMin
      setPassed(didPass)
      setFinished(true)
      if (didPass) {
        onQuizPassed?.(stageId, finalScore)
      }
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  const retryQuiz = () => {
    scoreRef.current = 0
    setIndex(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
    setPassed(false)
  }

  if (finished) {
    const didPass = passed || score >= passMin
    const message = didPass
      ? '!Excelente! Desbloqueaste el siguiente nivel.'
      : `Necesitas al menos ${passMin} de ${total}. Intenta otra vez.`

    return (
      <div className="post-quiz" role="dialog" aria-modal="true">
        <div className="post-quiz__panel">
          <h2 className="post-quiz__title">!Quiz terminado!</h2>
          <p className="post-quiz__score">
            Acertaste <strong>{score}</strong> de {total}
          </p>
          <p className={`post-quiz__message${didPass ? ' post-quiz__message--ok' : ''}`}>
            {message}
          </p>
          {didPass ? (
            <button
              type="button"
              className="post-quiz__btn post-quiz__btn--primary"
              onClick={onExit ?? onClose}
            >
              Volver al menu
            </button>
          ) : (
            <>
              <button
                type="button"
                className="post-quiz__btn post-quiz__btn--primary"
                onClick={retryQuiz}
              >
                Reintentar quiz
              </button>
              {!quizOnly && (
                <button type="button" className="post-quiz__btn" onClick={onClose}>
                  Volver al resultado
                </button>
              )}
            </>
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
          Pregunta {index + 1} de {total} · minimo {passMin} correctas
        </p>
        <h2 className="post-quiz__prompt font-readable">{question.prompt}</h2>
        <ul className="post-quiz__options">
          {question.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex
            const isCorrect = optionIndex === question.correctIndex
            let className = 'post-quiz__option font-readable'
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
            <p className="post-quiz__hint font-readable">{question.hint}</p>
            <button
              type="button"
              className="post-quiz__btn post-quiz__btn--primary"
              onClick={handleNext}
            >
              {index + 1 >= total ? 'Ver resultado' : 'Siguiente'}
            </button>
          </>
        )}
        {quizOnly && onExit && (
          <button type="button" className="post-quiz__btn post-quiz__btn--ghost" onClick={onExit}>
            Volver al menu
          </button>
        )}
      </div>
    </div>
  )
}
