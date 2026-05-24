import { pickDecisionForMilestone } from '../constants/decisionScenarios'
import type { DecisionScenario } from '../constants/decisionScenarios'
import type { StageConfig } from '../types/game'

export interface ScoreProgressResult {
  type: 'freeze' | 'none'
  milestone?: number
  decision?: DecisionScenario
  questionNumber?: number
}

export function checkScoreProgress(
  score: number,
  stage: StageConfig,
  triggeredMilestones: Set<number>,
  usedScenarioIds: string[],
): ScoreProgressResult {
  const sorted = [...stage.decisionMilestones].sort((a, b) => a - b)

  for (const milestone of sorted) {
    if (score >= milestone && !triggeredMilestones.has(milestone)) {
      triggeredMilestones.add(milestone)
      const decision = pickDecisionForMilestone(
        stage.id,
        milestone,
        usedScenarioIds,
      )
      usedScenarioIds.push(decision.id)
      const questionNumber = sorted.indexOf(milestone) + 1
      return { type: 'freeze', milestone, decision, questionNumber }
    }
  }

  return { type: 'none' }
}

export function shouldWinAfterDecision(
  score: number,
  stage: StageConfig,
  triggeredMilestones: Set<number>,
): boolean {
  const finalMilestone = stage.decisionMilestones[stage.decisionMilestones.length - 1]
  return (
    score >= stage.scoreGoal &&
    finalMilestone !== undefined &&
    triggeredMilestones.has(finalMilestone)
  )
}
