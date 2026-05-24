import {
  DECISION_MILESTONES,
  SCORE_GOAL,
} from './gameConfig'
import type { StageConfig } from '../types/game'

export const STAGES: StageConfig[] = [
  {
    id: 1,
    title: 'Semillas Financieras',
    subtitle: 'Necesidad, deseo y ahorro',
    ageRange: 'Para ninos de 6 a 9 anos',
    enabled: true,
    scoreGoal: SCORE_GOAL,
    decisionMilestones: [...DECISION_MILESTONES],
    objects: [
      { kind: 'coin', label: 'Moneda', effect: 'points', points: 1, weight: 44 },
      { kind: 'info', label: 'Pregunta', effect: 'info', weight: 8 },
      { kind: 'chest', label: 'Cofre', effect: 'points', points: 5, weight: 24 },
      { kind: 'toy', label: 'Juguete', effect: 'points', points: -10, weight: 12 },
      {
        kind: 'star',
        label: 'Estrella',
        effect: 'multiplier',
        multiplier: 2,
        multiplierDurationMs: 15000,
        weight: 8,
      },
    ],
  },
  {
    id: 2,
    title: 'Ahorro Intermedio',
    subtitle: 'Muy pronto',
    ageRange: '10-13 anos',
    enabled: false,
    scoreGoal: SCORE_GOAL,
    decisionMilestones: [...DECISION_MILESTONES],
    objects: [],
  },
  {
    id: 3,
    title: 'Inversion Avanzada',
    subtitle: 'Muy pronto',
    ageRange: '14+ anos',
    enabled: false,
    scoreGoal: SCORE_GOAL,
    decisionMilestones: [...DECISION_MILESTONES],
    objects: [],
  },
]
