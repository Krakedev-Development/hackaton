export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  hint: string
}

/** Quiz final - Educacion Financiera parcial (MINEDUC / FS4 primaria) */
export const POST_GAME_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'Segun educacion financiera: que es necesidad?',
    options: [
      'Algo importante para vivir y estudiar',
      'Un juguete de moda',
      'Dulces cada dia',
      'Un juego nuevo siempre',
    ],
    correctIndex: 0,
    hint: 'Comida y utiles escolares son necesidades.',
  },
  {
    id: 'q2',
    prompt: 'Que es un deseo?',
    options: [
      'Algo que quieres pero puede esperar',
      'Medicina cuando estas mal',
      'Cuaderno para la escuela',
      'Agua para beber',
    ],
    correctIndex: 0,
    hint: 'Un deseo no es urgente como una necesidad.',
  },
  {
    id: 'q3',
    prompt: 'Para que sirve ahorrar?',
    options: [
      'Guardar dinero para una meta',
      'Gastar todo rapido',
      'Comprar sin pensar',
      'Perder monedas',
    ],
    correctIndex: 0,
    hint: 'Ahorrar es planificar el futuro.',
  },
  {
    id: 'q4',
    prompt: 'Que es un presupuesto simple?',
    options: [
      'Lista de ingresos y gastos',
      'Solo una lista de deseos',
      'Comprar lo primero que ves',
      'Esconder el dinero',
    ],
    correctIndex: 0,
    hint: 'El presupuesto te ayuda a planificar.',
  },
  {
    id: 'q5',
    prompt: 'Comparar precios antes de comprar es...',
    options: [
      'Consumo responsable',
      'Gastar de mas',
      'Ignorar el dinero',
      'Pedir prestado siempre',
    ],
    correctIndex: 0,
    hint: 'Comparar ayuda a decidir mejor.',
  },
  {
    id: 'q6',
    prompt: 'Si gastas todo tu dinero en golosinas...',
    options: [
      'Quizas no te alcanza para lo importante',
      'Siempre ganas mas dinero',
      'No importa planificar',
      'Es la mejor decision',
    ],
    correctIndex: 0,
    hint: 'Planificar evita quedarte sin dinero.',
  },
  {
    id: 'q7',
    prompt: 'El valor del dinero nos ensena a...',
    options: [
      'Elegir con cuidado que comprar',
      'Gastar sin mirar precios',
      'No ahorrar nunca',
      'Comprar solo juguetes',
    ],
    correctIndex: 0,
    hint: 'Cada moneda tiene poder de compra.',
  },
  {
    id: 'q8',
    prompt: 'Tomar una decision informada es...',
    options: [
      'Pensar antes de gastar',
      'Comprar por impulso',
      'No preguntar a nadie',
      'Gastar todo de golpe',
    ],
    correctIndex: 0,
    hint: 'Informarte te ayuda a elegir bien.',
  },
  {
    id: 'q9',
    prompt: 'Un fondo de emergencia sirve para...',
    options: [
      'Imprevistos importantes',
      'Comprar lujos cada dia',
      'No pagar deudas',
      'Regalar sin limite',
    ],
    correctIndex: 0,
    hint: 'Guardar para imprevistos es prudente.',
  },
  {
    id: 'q10',
    prompt: 'En el juego, las preguntas de decision aparecen en...',
    options: [
      '150, 300 y 500 puntos',
      'Solo al inicio',
      'Cuando pierdes un corazon',
      'Nunca',
    ],
    correctIndex: 0,
    hint: 'Cada hito enseña un tema del curso.',
  },
]

export function getQuizForStage(_stageId: number): QuizQuestion[] {
  return POST_GAME_QUIZ
}
