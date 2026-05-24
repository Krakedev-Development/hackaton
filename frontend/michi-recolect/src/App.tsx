import { useCallback, useState } from 'react'
import GameLayout from './components/GameLayout'
import MichiCatchGame from './components/MichiCatchGame'
import PostGameQuiz from './components/PostGameQuiz'
import { STAGES } from './constants/stages'
import {
  getBeatStages,
  getQuizPassedStages,
  getStageLockHint,
  hasBeatStage,
  isStageUnlocked,
  markQuizPassed,
  markStageBeaten,
} from './hooks/stageProgress'

type AppView =
  | { mode: 'menu' }
  | { mode: 'play'; stageId: number }
  | { mode: 'quiz-only'; stageId: number }

export default function App() {
  const [view, setView] = useState<AppView>({ mode: 'menu' })
  const [beatStages, setBeatStages] = useState(() => getBeatStages())
  const [quizPassedStages, setQuizPassedStages] = useState(() => getQuizPassedStages())

  const refreshProgress = useCallback(() => {
    setBeatStages(getBeatStages())
    setQuizPassedStages(getQuizPassedStages())
  }, [])

  const handleStageBeaten = useCallback((stageId: number) => {
    setBeatStages(markStageBeaten(stageId))
  }, [])

  const handleQuizPassed = useCallback((stageId: number, score: number) => {
    if (markQuizPassed(stageId, score)) {
      refreshProgress()
    }
  }, [refreshProgress])

  if (view.mode === 'play') {
    const stage = STAGES.find((s) => s.id === view.stageId)
    if (!stage || !isStageUnlocked(stage.id)) {
      setView({ mode: 'menu' })
      return null
    }
    return (
      <GameLayout>
        <MichiCatchGame
          stage={stage}
          onExit={() => setView({ mode: 'menu' })}
          onStageBeaten={handleStageBeaten}
          onQuizPassed={handleQuizPassed}
        />
      </GameLayout>
    )
  }

  if (view.mode === 'quiz-only') {
    const stage = STAGES.find((s) => s.id === view.stageId)
    if (!stage || !hasBeatStage(stage.id)) {
      setView({ mode: 'menu' })
      return null
    }
    return (
      <GameLayout>
        <PostGameQuiz
          stageId={stage.id}
          quizOnly
          onClose={() => setView({ mode: 'menu' })}
          onExit={() => setView({ mode: 'menu' })}
          onQuizPassed={handleQuizPassed}
        />
      </GameLayout>
    )
  }

  return (
    <GameLayout>
      <main className="w-full max-w-md flex flex-col items-center gap-6 font-pixel p-2">
        <header className="text-center max-w-md">
          <h1 className="text-[#ffe566] text-base md:text-lg drop-shadow-[4px_4px_0_#ff3d9a] leading-loose">
            MichiMoney
          </h1>
          <p className="text-[#3df5ff] text-[10px] mt-3 leading-loose">
            Necesidad o deseo? !Atrapa y aprende!
          </p>
          <p className="text-[#ff9ecd] text-[9px] mt-2 leading-loose">
            Para ninos de 6 a 9 anos
          </p>
        </header>

        <ul className="flex flex-col gap-5 w-full">
          {STAGES.map((stage) => {
            const unlocked = isStageUnlocked(stage.id)
            const beaten = beatStages.includes(stage.id)
            const quizDone = quizPassedStages.includes(stage.id)
            const lockHint = getStageLockHint(stage.id)
            const needsQuiz = beaten && !quizDone

            return (
              <li key={stage.id} className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => unlocked && setView({ mode: 'play', stageId: stage.id })}
                  className={`w-full text-left p-5 border-5 border-black shadow-[6px_6px_0_#000] text-[10px] leading-loose rounded-xl transition-transform ${
                    unlocked
                      ? 'bg-[#ff3d9a] text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_#000] cursor-pointer'
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-70'
                  }`}
                >
                  <span className="block text-[#ffe566] mb-2 text-[11px]">
                    Nivel {stage.id}
                    {quizDone && (
                      <span className="text-[#39ff14] ml-2">!Listo!</span>
                    )}
                    {needsQuiz && (
                      <span className="text-[#ffe566] ml-2">Quiz pendiente</span>
                    )}
                    {!unlocked && (
                      <span className="text-[#ff9ecd] ml-2">Bloqueado</span>
                    )}
                  </span>
                  {stage.title}
                  <span className="block mt-3 text-[9px] opacity-95">
                    {unlocked ? stage.subtitle : (lockHint ?? stage.subtitle)}
                  </span>
                </button>

                {needsQuiz && (
                  <button
                    type="button"
                    onClick={() => setView({ mode: 'quiz-only', stageId: stage.id })}
                    className="w-full p-3 border-4 border-black shadow-[4px_4px_0_#000] text-[9px] leading-loose rounded-lg bg-[#7ec8ff] text-[#001a33] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_#000]"
                  >
                    Solo hacer quiz
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </main>
    </GameLayout>
  )
}
