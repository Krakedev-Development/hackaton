import type { InfoTip } from './gameCopy'

export interface DecisionScenario {
  id: string
  title: string
  question: string
  need: {
    label: string
    tip: string
    feedback: string
  }
  desire: {
    label: string
    tip: string
    feedback: string
  }
  relatedTips: InfoTip[]
}

export const STAGE_1_DECISIONS: DecisionScenario[] = [
  {
    id: 'tuna-toy',
    title: '!Hora de elegir!',
    question: 'Que comprarias con tus monedas?',
    need: {
      label: 'Atun (lo necesito)',
      tip: '!Bien! Te protege de los juguetes',
      feedback: '!Excelente! Elegiste una necesidad',
    },
    desire: {
      label: 'Juguete de oro (lo quiero)',
      tip: 'Tu michi ira mas lento un ratito',
      feedback: 'Elegiste un deseo... ve mas despacio',
    },
    relatedTips: [
      { kind: 'question', text: 'Que necesitas hoy: comida o un juguete?' },
      { kind: 'fact', text: 'La comida es una necesidad.' },
      { kind: 'question', text: 'Que comprarias primero con pocas monedas?' },
      { kind: 'fact', text: 'Un juguete puede esperar si aun no tienes comida.' },
    ],
  },
  {
    id: 'notebook-candy',
    title: '!Hora de elegir!',
    question: 'Tienes monedas. Que eliges?',
    need: {
      label: 'Cuaderno (lo necesito)',
      tip: '!Bien! Te ayuda en la escuela',
      feedback: '!Muy bien! Lo necesitas para aprender',
    },
    desire: {
      label: 'Dulces (lo quiero)',
      tip: 'Gastas rapido y te quedas sin monedas',
      feedback: 'Los dulces son deseo... !piensa antes!',
    },
    relatedTips: [
      { kind: 'question', text: 'Que necesitas para la escuela?' },
      { kind: 'fact', text: 'El cuaderno es una necesidad para estudiar.' },
      { kind: 'question', text: 'Los dulces son necesidad o deseo?' },
      { kind: 'fact', text: 'Si compras solo dulces, no te alcanza para utiles.' },
    ],
  },
  {
    id: 'shoes-game',
    title: '!Hora de elegir!',
    question: 'En que gastas tus monedas?',
    need: {
      label: 'Zapatos (lo necesito)',
      tip: '!Bien! Cuidas tus pies',
      feedback: '!Que bien! Elegiste algo importante',
    },
    desire: {
      label: 'Videojuego (lo quiero)',
      tip: 'Tu michi ira mas lento un ratito',
      feedback: 'El juego puede esperar un poco',
    },
    relatedTips: [
      { kind: 'question', text: 'Zapatos rotos o un juego nuevo?' },
      { kind: 'fact', text: 'Ropa y zapatos son necesidades.' },
      { kind: 'question', text: 'Puedes jugar sin zapatos comodos?' },
      { kind: 'fact', text: 'Un videojuego es un deseo, no urgente.' },
    ],
  },
  {
    id: 'piggy-chicles',
    title: '!Hora de elegir!',
    question: 'Que haces con tus monedas?',
    need: {
      label: 'Alcancia (ahorro)',
      tip: '!Bien! Guardas para despues',
      feedback: '!Genial! Ahorrar es muy inteligente',
    },
    desire: {
      label: 'Chicles (lo quiero ya)',
      tip: 'Se acaban rapido y no queda nada',
      feedback: 'Gastar todo de golpe no ayuda',
    },
    relatedTips: [
      { kind: 'question', text: 'Guardarias monedas en una alcancia?' },
      { kind: 'fact', text: 'Ahorrar es guardar para algo importante.' },
      { kind: 'question', text: 'Chicles o monedas para despues?' },
      { kind: 'fact', text: 'Si gastas todo hoy, manana no tienes.' },
    ],
  },
  {
    id: 'medicine-plush',
    title: '!Hora de elegir!',
    question: 'Que es mas importante ahora?',
    need: {
      label: 'Medicina (lo necesito)',
      tip: '!Bien! Cuidas tu salud',
      feedback: '!Muy bien! La salud es lo primero',
    },
    desire: {
      label: 'Peluche nuevo (lo quiero)',
      tip: 'Tu michi ira mas lento un ratito',
      feedback: 'El peluche puede esperar',
    },
    relatedTips: [
      { kind: 'question', text: 'Salud o un juguete nuevo?' },
      { kind: 'fact', text: 'Medicina y salud son necesidades.' },
      { kind: 'question', text: 'Que pasa si gastas en cosas que no necesitas?' },
      { kind: 'fact', text: 'Un peluche bonito es un deseo.' },
    ],
  },
]

function getPool(stageId: number): DecisionScenario[] {
  return stageId === 1 ? STAGE_1_DECISIONS : STAGE_1_DECISIONS
}

export function pickRandomDecision(stageId: number): DecisionScenario {
  const pool = getPool(stageId)
  return pool[Math.floor(Math.random() * pool.length)] ?? pool[0]
}

export function pickRandomDecisionExcluding(
  stageId: number,
  excludeIds: string[],
): DecisionScenario {
  const pool = getPool(stageId).filter((s) => !excludeIds.includes(s.id))
  if (pool.length === 0) return pickRandomDecision(stageId)
  return pool[Math.floor(Math.random() * pool.length)] ?? pool[0]
}

export function pickRelatedInfoTip(scenario: DecisionScenario): InfoTip {
  const tips = scenario.relatedTips
  return tips[Math.floor(Math.random() * tips.length)] ?? tips[0]
}
