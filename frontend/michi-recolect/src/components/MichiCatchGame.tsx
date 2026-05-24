import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GAMEOVER_LESSON,
  pickEndLesson,
  pickReflectionQuestion,
  type InfoTip,
} from '../constants/gameCopy'
import type { DecisionScenario } from '../constants/decisionScenarios'
import type {
  CrashChoice,
  FallingObject,
  FeedbackTone,
  GameModifiers,
  GamePhase,
  StageConfig,
} from '../types/game'
import { GAME_BACKGROUND, MICHI_SPRITE } from '../constants/assets'
import {
  BASE_FALL_SPEED,
  GAME_HEIGHT,
  MAX_LIVES,
  OBJECT_SIZE,
  PLAYER_ACCELERATION,
  PLAYER_FRICTION,
  PLAYER_MAX_SPEED,
  SHIELD_DURATION_MS,
  SLOW_DURATION_MS,
  SLOW_MULTIPLIER,
  getScorePressureMultiplier,
  getSpawnInterval,
} from '../constants/gameConfig'
import {
  checkScoreProgress,
  shouldWinAfterDecision,
} from '../hooks/scoreProgress'
import { useMovementInput } from '../hooks/useMovementInput'
import {
  boxesOverlap,
  clampPlayerX,
  createFallingObject,
} from '../hooks/gameUtils'
import { resolveCatch } from '../hooks/resolveCatch'
import {
  addUniqueTip,
  ensureMinimumTips,
  pairCollectedTips,
} from '../hooks/collectedTips'
import FallingItem from './FallingItem'
import PixelHearts from './PixelHearts'
import PostGameQuiz from './PostGameQuiz'
import PreGameModal from './PreGameModal'
import TipsReviewPanel, { type MilestoneReview } from './TipsReviewPanel'
import TouchControls from './TouchControls'
import './MichiCatchGame.css'

interface MichiCatchGameProps {
  stage: StageConfig
  onExit?: () => void
}

function applyPlayerTransform(el: HTMLDivElement | null, xPercent: number) {
  if (!el) return
  el.style.left = `${xPercent}%`
}

const INITIAL_MODIFIERS: GameModifiers = {
  shieldUntil: 0,
  slowUntil: 0,
  scoreMultiplier: 1,
  multiplierUntil: 0,
}

export default function MichiCatchGame({ stage, onExit }: MichiCatchGameProps) {
  const [showBriefing, setShowBriefing] = useState(true)
  const [phase, setPhase] = useState<GamePhase>('frozen')
  const [lives, setLives] = useState(MAX_LIVES)
  const [score, setScore] = useState(0)
  const [displayX, setDisplayX] = useState(50)
  const [objects, setObjects] = useState<FallingObject[]>([])
  const [modifiers, setModifiers] = useState<GameModifiers>(INITIAL_MODIFIERS)
  const [clock, setClock] = useState(() => performance.now())
  const [questionNumber, setQuestionNumber] = useState(1)
  const [lastCatch, setLastCatch] = useState<string | null>(null)
  const [catchTone, setCatchTone] = useState<FeedbackTone>('neutral')
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [infoIsQuestion, setInfoIsQuestion] = useState(false)
  const [endLesson, setEndLesson] = useState('')
  const [reflectionQuestion, setReflectionQuestion] = useState('')
  const [playerCelebrate, setPlayerCelebrate] = useState(false)
  const [activeDecision, setActiveDecision] = useState<DecisionScenario | null>(
    null,
  )
  const [showTipsReview, setShowTipsReview] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [sessionTipPairs, setSessionTipPairs] = useState<
    ReturnType<typeof pairCollectedTips>
  >([])
  const [sessionMilestones, setSessionMilestones] = useState<MilestoneReview[]>(
    [],
  )
  const [collectedTipsCount, setCollectedTipsCount] = useState(0)

  const phaseRef = useRef(phase)
  const activeDecisionRef = useRef<DecisionScenario | null>(null)
  const playerXRef = useRef(50)
  const velocityRef = useRef(0)
  const playerElRef = useRef<HTMLDivElement>(null)
  const objectsRef = useRef(objects)
  const modifiersRef = useRef(modifiers)
  const scoreRef = useRef(score)
  const milestonesTriggeredRef = useRef<Set<number>>(new Set())
  const usedScenarioIdsRef = useRef<string[]>([])
  const collectedTipsRef = useRef<InfoTip[]>([])
  const completedMilestonesRef = useRef<MilestoneReview[]>([])
  const activeMilestoneRef = useRef(0)
  const livesRef = useRef(MAX_LIVES)
  const lastSpawnRef = useRef(0)
  const rafRef = useRef(0)
  const lastFrameRef = useRef(0)
  const catchFlashRef = useRef(0)
  const infoTimeoutRef = useRef(0)

  const { inputRef, setLeft, setRight } = useMovementInput(phase === 'playing')

  phaseRef.current = phase
  objectsRef.current = objects
  modifiersRef.current = modifiers
  scoreRef.current = score
  activeDecisionRef.current = activeDecision

  const applyScoreProgress = useCallback(
    (newScore: number) => {
      if (phaseRef.current !== 'playing') return

      const progress = checkScoreProgress(
        newScore,
        stage,
        milestonesTriggeredRef.current,
        usedScenarioIdsRef.current,
      )

      if (progress.type === 'freeze' && progress.decision) {
        activeMilestoneRef.current = progress.milestone ?? 0
        setActiveDecision(progress.decision)
        activeDecisionRef.current = progress.decision
        setQuestionNumber(progress.questionNumber ?? 1)
        velocityRef.current = 0
        setPhase('frozen')
        return
      }
    },
    [stage],
  )

  const startGame = useCallback(() => {
    setScore(0)
    scoreRef.current = 0
    setLives(MAX_LIVES)
    livesRef.current = MAX_LIVES
    milestonesTriggeredRef.current = new Set()
    usedScenarioIdsRef.current = []
    collectedTipsRef.current = []
    completedMilestonesRef.current = []
    activeMilestoneRef.current = 0
    setShowTipsReview(false)
    setShowQuiz(false)
    setSessionTipPairs([])
    setSessionMilestones([])
    setCollectedTipsCount(0)
    setActiveDecision(null)
    activeDecisionRef.current = null
    setQuestionNumber(1)
    playerXRef.current = 50
    velocityRef.current = 0
    setDisplayX(50)
    applyPlayerTransform(playerElRef.current, 50)
    setObjects([])
    setModifiers({ ...INITIAL_MODIFIERS })
    modifiersRef.current = { ...INITIAL_MODIFIERS }
    setLastCatch(null)
    setCatchTone('neutral')
    setInfoMessage(null)
    setInfoIsQuestion(false)
    setPlayerCelebrate(false)
    setPhase('playing')
    lastSpawnRef.current = 0
    lastFrameRef.current = 0
  }, [])

  const handleBriefingStart = useCallback(() => {
    setShowBriefing(false)
    startGame()
  }, [startGame])

  const handleCrashChoice = useCallback((choice: CrashChoice) => {
    const now = performance.now()
    setModifiers((prev) => {
      const next = { ...prev }
      if (choice === 'need') {
        next.shieldUntil = now + SHIELD_DURATION_MS
      } else {
        next.slowUntil = now + SLOW_DURATION_MS
      }
      modifiersRef.current = next
      return next
    })
    const decision = activeDecisionRef.current
    if (!decision) {
      setPhase('playing')
      return
    }

    completedMilestonesRef.current.push({
      milestone: activeMilestoneRef.current,
      scenario: decision,
      choice,
    })

    setLastCatch(
      choice === 'need' ? decision.need.feedback : decision.desire.feedback,
    )
    setCatchTone(choice === 'need' ? 'celebrate' : 'careful')
    catchFlashRef.current = performance.now()

    if (
      shouldWinAfterDecision(
        scoreRef.current,
        stage,
        milestonesTriggeredRef.current,
      )
    ) {
      const scenarios = completedMilestonesRef.current.map((m) => m.scenario)
      const tips = ensureMinimumTips(collectedTipsRef.current, scenarios)
      setSessionTipPairs(pairCollectedTips(tips))
      setSessionMilestones([...completedMilestonesRef.current])
      setEndLesson(pickEndLesson())
      setReflectionQuestion(pickReflectionQuestion())
      setPhase('ended')
      return
    }

    setPhase('playing')
  }, [stage])

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'frozen') return

    const tick = (now: number) => {
      if (phaseRef.current === 'ended' || phaseRef.current === 'gameover') return

      if (lastFrameRef.current === 0) lastFrameRef.current = now
      const delta = Math.min(24, now - lastFrameRef.current)
      lastFrameRef.current = now

      if (phaseRef.current === 'playing') {
        const slowActive = now < modifiersRef.current.slowUntil
        const speedMul = slowActive ? SLOW_MULTIPLIER : 1
        const { left, right } = inputRef.current

        if (left && !right) {
          velocityRef.current -= PLAYER_ACCELERATION * delta * speedMul
        } else if (right && !left) {
          velocityRef.current += PLAYER_ACCELERATION * delta * speedMul
        } else {
          velocityRef.current *= Math.pow(PLAYER_FRICTION, delta / 16)
        }

        const max = PLAYER_MAX_SPEED * speedMul
        velocityRef.current = Math.max(-max, Math.min(max, velocityRef.current))

        const nextX = clampPlayerX(playerXRef.current + velocityRef.current * delta)
        playerXRef.current = nextX
        applyPlayerTransform(playerElRef.current, nextX)

        const pressure = getScorePressureMultiplier(scoreRef.current)
        const spawnInterval = getSpawnInterval(scoreRef.current)

        if (now - lastSpawnRef.current >= spawnInterval) {
          lastSpawnRef.current = now
          objectsRef.current = [
            ...objectsRef.current,
            createFallingObject(stage.objects),
          ]
          setObjects(objectsRef.current)
        }

        const fallSpeed = BASE_FALL_SPEED * pressure * delta
        const remaining: FallingObject[] = []
        let scoreDelta = 0
        let catchLabel: string | null = null

        for (const obj of objectsRef.current) {
          const nextY = obj.y + fallSpeed
          const moved = { ...obj, y: nextY }

          if (boxesOverlap(playerXRef.current, moved)) {
            const result = resolveCatch(
              moved.kind,
              stage,
              modifiersRef.current,
              now,
              activeDecisionRef.current,
            )
            scoreDelta += result.scoreDelta
            catchLabel = result.label
            setCatchTone(result.tone ?? 'neutral')

            if (result.tone === 'celebrate') {
              setPlayerCelebrate(true)
              window.setTimeout(() => setPlayerCelebrate(false), 450)
            }

            if (result.loseLife) {
              livesRef.current = Math.max(0, livesRef.current - 1)
              setLives(livesRef.current)
              if (livesRef.current <= 0) {
                velocityRef.current = 0
                setEndLesson(GAMEOVER_LESSON)
                setReflectionQuestion(pickReflectionQuestion())
                setPhase('gameover')
              }
            }

            if (result.infoMessage) {
              setInfoMessage(result.infoMessage)
              setInfoIsQuestion(result.infoIsQuestion ?? false)
              window.clearTimeout(infoTimeoutRef.current)
              infoTimeoutRef.current = window.setTimeout(() => {
                setInfoMessage(null)
                setInfoIsQuestion(false)
              }, 5000)
            }

            if (result.collectedTip) {
              collectedTipsRef.current = addUniqueTip(
                collectedTipsRef.current,
                result.collectedTip,
              )
              setCollectedTipsCount(collectedTipsRef.current.length)
            }

            setModifiers({ ...modifiersRef.current })
            continue
          }

          if (nextY < GAME_HEIGHT + OBJECT_SIZE) {
            remaining.push(moved)
          }
        }

        if (scoreDelta !== 0) {
          scoreRef.current = Math.max(0, scoreRef.current + scoreDelta)
          setScore(scoreRef.current)
          applyScoreProgress(scoreRef.current)
        }

        if (catchLabel) {
          setLastCatch(catchLabel)
          catchFlashRef.current = now
        }

        objectsRef.current = remaining
        setObjects(remaining)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase, stage, inputRef, applyScoreProgress])

  useEffect(() => {
    if (phase !== 'playing') return
    const syncInterval = window.setInterval(() => {
      setDisplayX(playerXRef.current)
    }, 120)
    return () => clearInterval(syncInterval)
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'frozen' && phase !== 'ended') return
    const clockInterval = window.setInterval(() => {
      setClock(performance.now())
      if (catchFlashRef.current && performance.now() - catchFlashRef.current > 1200) {
        setLastCatch(null)
        catchFlashRef.current = 0
      }
      if (performance.now() >= modifiersRef.current.multiplierUntil) {
        if (modifiersRef.current.scoreMultiplier !== 1) {
          modifiersRef.current.scoreMultiplier = 1
          setModifiers({ ...modifiersRef.current })
        }
      }
    }, 200)
    return () => clearInterval(clockInterval)
  }, [phase])

  useEffect(() => {
    return () => window.clearTimeout(infoTimeoutRef.current)
  }, [])

  const shieldActive = clock < modifiers.shieldUntil
  const slowActive = clock < modifiers.slowUntil
  const multiplierActive = clock < modifiers.multiplierUntil

  return (
    <div className="michi-catch">
      {showBriefing && (
        <PreGameModal
          stageTitle={stage.title}
          ageRange={stage.ageRange}
          onStart={handleBriefingStart}
          onExit={onExit}
        />
      )}

      <div className="michi-catch__hud">
        <div className="michi-catch__hud-box michi-catch__hud-box--lives">
          <PixelHearts filled={lives} total={MAX_LIVES} />
        </div>
        <div className="michi-catch__hud-box michi-catch__hud-box--goal">
          Meta
          <span className="michi-catch__hud-value">
            {Math.min(score, stage.scoreGoal)}
            <span className="michi-catch__hud-goal"> / {stage.scoreGoal}</span>
          </span>
          {multiplierActive && (
            <span className="michi-catch__multiplier-tag">
              x{modifiers.scoreMultiplier}
            </span>
          )}
          {phase === 'playing' && (
            <span className="michi-catch__tips-tag">
              Consejos {collectedTipsCount}/5
            </span>
          )}
        </div>
      </div>

      <div
        className={`michi-catch__arena${phase === 'frozen' ? ' michi-catch__arena--frozen' : ''}`}
        style={{ backgroundImage: `url(${GAME_BACKGROUND})` }}
      >
        {shieldActive && (
          <div className="michi-catch__shield-badge">!Escudo activo!</div>
        )}

        {lastCatch && phase === 'playing' && !infoMessage && (
          <div
            className={`michi-catch__catch-flash michi-catch__catch-flash--${catchTone}`}
            key={lastCatch}
          >
            {lastCatch}
          </div>
        )}

        {infoMessage && phase === 'playing' && (
          <div className="michi-catch__info-panel" role="status">
            <p className="michi-catch__info-title">
              {infoIsQuestion ? 'Pregunta para ti' : 'Sabias que?'}
            </p>
            <p className="michi-catch__info-text">{infoMessage}</p>
          </div>
        )}

        {objects.map((obj) => (
          <div
            key={obj.id}
            className={`michi-catch__object michi-catch__object--${obj.kind}`}
            style={{ left: `${obj.x}%`, top: `${obj.y}px` }}
            aria-hidden
          >
            <FallingItem kind={obj.kind} />
          </div>
        ))}

        <div
          ref={playerElRef}
          className={`michi-catch__player${slowActive ? ' michi-catch__player--slow' : ''}${playerCelebrate ? ' michi-catch__player--celebrate' : ''}`}
          style={{
            left: `${displayX}%`,
            backgroundImage: `url(${MICHI_SPRITE})`,
          }}
          role="img"
          aria-label="Tu gatito"
        />

        {phase === 'frozen' && activeDecision && (
          <div className="michi-catch__crash">
            <p className="michi-catch__crash-badge">
              Pregunta {questionNumber} de {stage.decisionMilestones.length}
            </p>
            <p className="michi-catch__crash-title">{activeDecision.title}</p>
            <p className="michi-catch__crash-sub">{activeDecision.question}</p>
            <p className="michi-catch__crash-hint">
              Toca la opcion que tu elegirias
            </p>
            <button
              type="button"
              className="michi-catch__crash-btn michi-catch__crash-btn--need"
              onClick={() => handleCrashChoice('need')}
            >
              {activeDecision.need.label}
              <span className="michi-catch__crash-desc">
                {activeDecision.need.tip}
              </span>
            </button>
            <button
              type="button"
              className="michi-catch__crash-btn michi-catch__crash-btn--desire"
              onClick={() => handleCrashChoice('desire')}
            >
              {activeDecision.desire.label}
              <span className="michi-catch__crash-desc">
                {activeDecision.desire.tip}
              </span>
            </button>
          </div>
        )}

        {phase === 'ended' && (
          <div className="michi-catch__overlay-end">
            <p className="michi-catch__overlay-title">!Llegaste a la meta!</p>
            <p className="michi-catch__overlay-score">
              <strong>{score}</strong> / {stage.scoreGoal} puntos
            </p>
            <p className="michi-catch__overlay-lesson">{endLesson}</p>
            <div className="michi-catch__reflection">
              <p className="michi-catch__reflection-label">
                Pregunta para hablar en casa:
              </p>
              <p className="michi-catch__reflection-text">{reflectionQuestion}</p>
            </div>
            <button
              type="button"
              className="michi-catch__crash-btn michi-catch__crash-btn--need"
              onClick={startGame}
            >
              Jugar otra vez
            </button>
            <button
              type="button"
              className="michi-catch__crash-btn michi-catch__crash-btn--menu"
              onClick={() => setShowTipsReview(true)}
            >
              Ver consejos
            </button>
            <button
              type="button"
              className="michi-catch__crash-btn michi-catch__crash-btn--desire"
              onClick={() => setShowQuiz(true)}
            >
              Empezar quiz
            </button>
          </div>
        )}

        {phase === 'gameover' && (
          <div className="michi-catch__overlay-end">
            <p className="michi-catch__overlay-title">!Sin corazones!</p>
            <p className="michi-catch__overlay-lesson">{endLesson}</p>
            <p className="michi-catch__overlay-score">
              Puntos: <strong>{score}</strong>
            </p>
            <div className="michi-catch__reflection">
              <p className="michi-catch__reflection-label">
                Pregunta para hablar en casa:
              </p>
              <p className="michi-catch__reflection-text">{reflectionQuestion}</p>
            </div>
            <button
              type="button"
              className="michi-catch__crash-btn michi-catch__crash-btn--need"
              onClick={startGame}
            >
              Intentar de nuevo
            </button>
            <button
              type="button"
              className="michi-catch__crash-btn michi-catch__crash-btn--menu"
              onClick={() => setShowBriefing(true)}
            >
              Ver guia
            </button>
            {onExit && (
              <button
                type="button"
                className="michi-catch__crash-btn michi-catch__crash-btn--desire"
                onClick={onExit}
              >
                Volver al menu
              </button>
            )}
          </div>
        )}
      </div>

      <TouchControls
        visible={phase === 'playing' && !showBriefing}
        onLeft={setLeft}
        onRight={setRight}
      />

      {showTipsReview && (
        <TipsReviewPanel
          pairs={sessionTipPairs}
          milestones={sessionMilestones}
          onClose={() => setShowTipsReview(false)}
        />
      )}

      {showQuiz && (
        <PostGameQuiz onClose={() => setShowQuiz(false)} onExit={onExit} />
      )}
    </div>
  )
}

