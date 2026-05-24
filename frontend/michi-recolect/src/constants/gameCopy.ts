/** Textos del juego - ninos 6-9 anos. Frases cortas. Sin acentos (fuente pixel). */

export const BRIEFING_TITLE = '!Aprende jugando con tu michi!'

export const BRIEFING_ITEMS: string[] = [
  'Mueve a tu michi con flechas o los botones de abajo.',
  'Atrapa monedas y cofres: !son buenas elecciones!',
  'El circulo verde guarda consejos (!atrapa al menos 5!).',
  '!No atrapes el juguete! Pierdes un corazon.',
  'Llega a 500 puntos. Cada 100 pts el juego va mas rapido.',
  'En 150, 300 y 500 haras una pregunta.',
]

export type InfoTip = {
  kind: 'fact' | 'question'
  text: string
}

export const INFO_TIPS: InfoTip[] = [
  { kind: 'fact', text: 'Ahorrar es guardar monedas para despues.' },
  { kind: 'question', text: 'Que necesitas hoy: comida o un juguete?' },
  { kind: 'fact', text: 'Necesidad = algo importante para vivir bien.' },
  { kind: 'question', text: 'Tienes alcancia en casa?' },
  { kind: 'fact', text: 'Deseo = algo que quieres, pero puedes esperar.' },
  { kind: 'question', text: 'Que guardarias en tu alcancia?' },
  { kind: 'fact', text: 'Si gastas todo, no te alcanza para lo importante.' },
  { kind: 'question', text: 'Quien te ayuda a decidir que comprar?' },
]

export const END_LESSONS: string[] = [
  'Hoy aprendiste: a veces conviene elegir lo que necesitas antes que lo que quieres.',
  'Hoy aprendiste: ahorrar monedas te ayuda cuando las necesitas.',
  'Hoy aprendiste: pensar antes de gastar es ser muy inteligente.',
]

export const REFLECTION_QUESTIONS: string[] = [
  'Que atrapaste que era necesidad y que era deseo?',
  'En que gastarias tus monedas en la vida real?',
  'Que guardarias en una alcancia esta semana?',
  'Que comprarias primero si tuvieras pocas monedas?',
  'Alguien te ayuda a decidir que es necesidad?',
]

export const GAMEOVER_LESSON =
  'Los juguetes son deseos. La proxima vez, busca monedas y cofres.'

export const CATCH_MESSAGES = {
  coin: '!Bien! Monedas para ahorrar',
  chest: '!Bien pensado! Cofre de ahorro',
  star: '!Genial! Doble puntos',
  info: '!Buena pregunta!',
  toy: '!Cuidado! Era un deseo',
  toyShield: '!Que bien! Tu escudo te cuido',
  needChoice: '!Excelente! Elegiste una necesidad',
  desireChoice: 'Elegiste un deseo... ve mas despacio',
} as const

export function pickRandomInfoTip(pool: InfoTip[] = INFO_TIPS): InfoTip {
  return pool[Math.floor(Math.random() * pool.length)] ?? pool[0]
}

export function pickEndLesson(): string {
  return END_LESSONS[Math.floor(Math.random() * END_LESSONS.length)] ?? END_LESSONS[0]
}

export function pickReflectionQuestion(): string {
  return (
    REFLECTION_QUESTIONS[Math.floor(Math.random() * REFLECTION_QUESTIONS.length)] ??
    REFLECTION_QUESTIONS[0]
  )
}
