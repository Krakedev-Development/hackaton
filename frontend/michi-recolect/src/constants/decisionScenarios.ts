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

export const STAGE_2_DECISIONS: DecisionScenario[] = [
  {
    id: 'bike-tablet',
    title: '!Hora de elegir!',
    question: 'Ahorraste mucho. Que compras?',
    need: {
      label: 'Reparar bicicleta (lo necesito)',
      tip: '!Bien! Te mueves seguro',
      feedback: '!Excelente! Cuidaste algo util',
    },
    desire: {
      label: 'Tablet nueva (lo quiero)',
      tip: 'Gastas todo de golpe',
      feedback: 'La tablet puede esperar un poco',
    },
    relatedTips: [
      { kind: 'question', text: 'Que es mas urgente: arreglar o comprar nuevo?' },
      { kind: 'fact', text: 'Reparar suele costar menos que comprar otro.' },
      { kind: 'question', text: 'Tienes meta de ahorro clara?' },
      { kind: 'fact', text: 'Una meta te ayuda a no gastar de mas.' },
    ],
  },
  {
    id: 'trip-snacks',
    title: '!Hora de elegir!',
    question: 'Tienes monedas cada semana. Que haces?',
    need: {
      label: 'Guardar para un viaje',
      tip: '!Bien! Piensas a futuro',
      feedback: '!Genial! Ahorrar tiene meta',
    },
    desire: {
      label: 'Snacks todos los dias',
      tip: 'Se va rapido el dinero',
      feedback: 'Gastar poco a poco tambien suma',
    },
    relatedTips: [
      { kind: 'question', text: 'Prefieres viaje o golosinas diarias?' },
      { kind: 'fact', text: 'Ahorrar con meta es mas facil.' },
      { kind: 'question', text: 'Cuanto guardarias cada semana?' },
      { kind: 'fact', text: 'Pequenas sumas hacen gran total.' },
    ],
  },
  {
    id: 'uniform-headphones',
    title: '!Hora de elegir!',
    question: 'Que es prioridad este mes?',
    need: {
      label: 'Uniforme escolar',
      tip: '!Bien! Lo necesitas',
      feedback: '!Muy bien! Escuela primero',
    },
    desire: {
      label: 'Audifonos caros',
      tip: 'Tu michi ira mas lento',
      feedback: 'Los audifonos pueden esperar',
    },
    relatedTips: [
      { kind: 'question', text: 'Que pasa si no tienes uniforme?' },
      { kind: 'fact', text: 'Lo escolar es necesidad.' },
      { kind: 'question', text: 'Compararias precios antes de comprar?' },
      { kind: 'fact', text: 'Comparar precios ahorra monedas.' },
    ],
  },
  {
    id: 'bus-card-game',
    title: '!Hora de elegir!',
    question: 'Solo te alcanza para una cosa.',
    need: {
      label: 'Tarjeta de bus',
      tip: '!Bien! Llegas a la escuela',
      feedback: '!Que bien! Transporte es necesidad',
    },
    desire: {
      label: 'Juego en linea',
      tip: 'Gastas en deseo',
      feedback: 'El juego puede esperar',
    },
    relatedTips: [
      { kind: 'question', text: 'Como llegarias sin bus?' },
      { kind: 'fact', text: 'Transporte es gasto fijo importante.' },
      { kind: 'question', text: 'Que es gasto fijo y que es extra?' },
      { kind: 'fact', text: 'Fijo = pagas siempre, extra = a veces.' },
    ],
  },
  {
    id: 'gift-friend-self',
    title: '!Hora de elegir!',
    question: 'Tienes pocas monedas. Que haces?',
    need: {
      label: 'Regalo simple para mama',
      tip: '!Bien! Piensas en otros',
      feedback: '!Lindo! Planificaste tu gasto',
    },
    desire: {
      label: 'Ropa de moda para ti',
      tip: 'Te quedas sin nada',
      feedback: 'Planear evita quedarte sin monedas',
    },
    relatedTips: [
      { kind: 'question', text: 'Puedes regalar sin gastar todo?' },
      { kind: 'fact', text: 'Planear el gasto evita sorpresas.' },
      { kind: 'question', text: 'Que regalo hecho en casa podrias dar?' },
      { kind: 'fact', text: 'A veces lo hecho con carino vale mas.' },
    ],
  },
]

export const STAGE_3_DECISIONS: DecisionScenario[] = [
  {
    id: 'emergency-bag',
    title: '!Hora de elegir!',
    question: 'Tu primer sueldo. Que haces?',
    need: {
      label: 'Fondo de emergencia',
      tip: '!Bien! Te proteges',
      feedback: '!Excelente! Emergencias cubiertas',
    },
    desire: {
      label: 'Bolso de lujo',
      tip: 'Gastas todo rapido',
      feedback: 'El lujo puede esperar',
    },
    relatedTips: [
      { kind: 'question', text: 'Que es un fondo de emergencia?' },
      { kind: 'fact', text: 'Es dinero guardado para imprevistos.' },
      { kind: 'question', text: 'Cuanto guardarias al mes?' },
      { kind: 'fact', text: 'Ahorrar primero ayuda en crisis.' },
    ],
  },
  {
    id: 'course-sneakers',
    title: '!Hora de elegir!',
    question: 'Inviertes en tu futuro?',
    need: {
      label: 'Curso que te enseña mas',
      tip: '!Bien! Creces y aprendes',
      feedback: '!Genial! Invertir en ti es clave',
    },
    desire: {
      label: 'Tenis de marca',
      tip: 'Gasto que baja de valor',
      feedback: 'Moda pasa, habilidades quedan',
    },
    relatedTips: [
      { kind: 'question', text: 'Que te da valor a largo plazo?' },
      { kind: 'fact', text: 'Aprender puede darte mas ingresos.' },
      { kind: 'question', text: 'Que es invertir en ti?' },
      { kind: 'fact', text: 'Gastar en educacion es inversion.' },
    ],
  },
  {
    id: 'debt-gadget',
    title: '!Hora de elegir!',
    question: 'Debes dinero y quieres un gadget.',
    need: {
      label: 'Pagar deuda primero',
      tip: '!Bien! Menos intereses',
      feedback: '!Muy bien! Deuda baja primero',
    },
    desire: {
      label: 'Gadget nuevo ya',
      tip: 'La deuda crece',
      feedback: 'Deuda cara puede esperar el gadget',
    },
    relatedTips: [
      { kind: 'question', text: 'Que pasa si no pagas deuda?' },
      { kind: 'fact', text: 'Deuda puede crecer con intereses.' },
      { kind: 'question', text: 'Que es un interes?' },
      { kind: 'fact', text: 'Interes = extra que pagas por pedir prestado.' },
    ],
  },
  {
    id: 'save-invest',
    title: '!Hora de elegir!',
    question: 'Tienes monedas extra al mes.',
    need: {
      label: 'Ahorrar e invertir poco a poco',
      tip: '!Bien! Piensas largo plazo',
      feedback: '!Excelente! Tu dinero puede crecer',
    },
    desire: {
      label: 'Salidas caras cada fin de semana',
      tip: 'No queda para invertir',
      feedback: 'Diversion sin plan agota el ahorro',
    },
    relatedTips: [
      { kind: 'question', text: 'Que es invertir?' },
      { kind: 'fact', text: 'Invertir = poner dinero para que crezca.' },
      { kind: 'question', text: 'Ahorro vs inversion: cual es la diferencia?' },
      { kind: 'fact', text: 'Ahorro es guardar; inversion busca crecer.' },
    ],
  },
  {
    id: 'compare-buy',
    title: '!Hora de elegir!',
    question: 'Vas a comprar algo caro.',
    need: {
      label: 'Comparar precios y esperar',
      tip: '!Bien! Compras inteligente',
      feedback: '!Que bien! Investigaste antes',
    },
    desire: {
      label: 'Comprar ya sin pensar',
      tip: 'Pagas de mas',
      feedback: 'Esperar un poco puede ahorrar mucho',
    },
    relatedTips: [
      { kind: 'question', text: 'Revisarias 3 tiendas antes de comprar?' },
      { kind: 'fact', text: 'Comparar evita pagar de mas.' },
      { kind: 'question', text: 'Que es comprar impulsivo?' },
      { kind: 'fact', text: 'Comprar sin pensar suele ser deseo.' },
    ],
  },
]

function getPool(stageId: number): DecisionScenario[] {
  if (stageId === 2) return STAGE_2_DECISIONS
  if (stageId === 3) return STAGE_3_DECISIONS
  return STAGE_1_DECISIONS
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
