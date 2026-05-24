import { useCallback, useState } from 'react'
import GameLayout from './components/GameLayout'
import MichiCatchGame from './components/MichiCatchGame'
import { STAGES } from './constants/stages'
import {
  getCompletedStages,
  getStageLockHint,
  isStageUnlocked,
  markStageCompleted,
} from './hooks/stageProgress'

export default function App() {
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null)
  const [completedStages, setCompletedStages] = useState(() => getCompletedStages())

  const handleStageComplete = useCallback((stageId: number) => {
    setCompletedStages(markStageCompleted(stageId))
  }, [])

  if (selectedStageId !== null) {
    const stage = STAGES.find((s) => s.id === selectedStageId)
    if (!stage || !isStageUnlocked(stage.id, completedStages)) {
      setSelectedStageId(null)
      return null
    }
    return (
      <GameLayout>
        <MichiCatchGame
          stage={stage}
          onExit={() => setSelectedStageId(null)}
          onStageComplete={handleStageComplete}
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
            const unlocked = isStageUnlocked(stage.id, completedStages)
            const completed = completedStages.includes(stage.id)
            const lockHint = getStageLockHint(stage.id)

            return (
              <li key={stage.id}>
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => unlocked && setSelectedStageId(stage.id)}
                  className={`w-full text-left p-5 border-5 border-black shadow-[6px_6px_0_#000] text-[10px] leading-loose rounded-xl transition-transform ${
                    unlocked
                      ? 'bg-[#ff3d9a] text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_#000] cursor-pointer'
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-70'
                  }`}
                >
                  <span className="block text-[#ffe566] mb-2 text-[11px]">
                    Nivel {stage.id}
                    {completed && (
                      <span className="text-[#39ff14] ml-2">!Listo!</span>
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
              </li>
            )
          })}
        </ul>
      </main>
    </GameLayout>
  )
}
