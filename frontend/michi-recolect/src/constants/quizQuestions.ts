export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  hint: string
}

export const POST_GAME_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'Tu michi tiene pocas monedas. Que es una necesidad?',
    options: [
      'Algo importante para vivir bien',
      'Un juguete muy bonito',
      'Dulces de colores',
      'Un videojuego nuevo',
    ],
    correctIndex: 0,
    hint: 'La comida y utiles escolares son necesidades.',
  },
  {
    id: 'q2',
    prompt: 'Que es un deseo?',
    options: [
      'Algo que quieres pero puede esperar',
      'La medicina cuando estas mal',
      'Zapatos cuando los necesitas',
      'Comida para tu michi',
    ],
    correctIndex: 0,
    hint: 'Un juguete o dulces suelen ser deseos.',
  },
  {
    id: 'q3',
    prompt: 'El atun para tu michi es...',
    options: ['Necesidad', 'Deseo', 'Un regalo sin importancia', 'Solo diversion'],
    correctIndex: 0,
    hint: 'Tu michi necesita comer.',
  },
  {
    id: 'q4',
    prompt: 'Un cuaderno para la escuela es...',
    options: ['Necesidad', 'Deseo', 'Solo decoracion', 'Algo que puede esperar siempre'],
    correctIndex: 0,
    hint: 'Te ayuda a aprender.',
  },
  {
    id: 'q5',
    prompt: 'Para que sirve una alcancia?',
    options: [
      'Guardar monedas para despues',
      'Gastar todo hoy',
      'Comprar solo dulces',
      'Esconder juguetes rotos',
    ],
    correctIndex: 0,
    hint: 'Ahorrar es guardar para algo importante.',
  },
  {
    id: 'q6',
    prompt: 'Si gastas todas tus monedas en chicles...',
    options: [
      'Manana quizas no te alcance para lo importante',
      'Siempre tendras mas monedas magicas',
      'No pasa nada nunca',
      'Ganas el juego mas rapido',
    ],
    correctIndex: 0,
    hint: 'Gastar todo de golpe no ayuda.',
  },
  {
    id: 'q7',
    prompt: 'Zapatos rotos vs videojuego nuevo: que conviene primero?',
    options: ['Zapatos (necesidad)', 'Videojuego (deseo)', 'Ninguno', 'Los dos son iguales'],
    correctIndex: 0,
    hint: 'Ropa y zapatos cuidan tu cuerpo.',
  },
  {
    id: 'q8',
    prompt: 'La medicina cuando estas enfermo es...',
    options: ['Necesidad', 'Deseo', 'Un juguete', 'Algo que puede esperar'],
    correctIndex: 0,
    hint: 'La salud es lo primero.',
  },
  {
    id: 'q9',
    prompt: 'Que hace un michi inteligente con sus monedas?',
    options: [
      'Piensa antes de gastar',
      'Compra todo lo que ve',
      'Ignora las monedas',
      'Solo atrapa juguetes',
    ],
    correctIndex: 0,
    hint: 'Pensar antes de gastar es ser inteligente.',
  },
  {
    id: 'q10',
    prompt: 'En el juego, cuando haces preguntas de necesidad o deseo?',
    options: [
      'Al llegar a 150, 300 y 500 puntos',
      'Solo al principio',
      'Cuando pierdes un corazon',
      'Nunca',
    ],
    correctIndex: 0,
    hint: 'Cada 150 puntos hay una pregunta.',
  },
]
