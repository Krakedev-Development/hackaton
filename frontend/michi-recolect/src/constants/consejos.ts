import type { InfoTip } from './gameCopy'

const asFact = (text: string): InfoTip => ({ kind: 'fact', text })

/**
 * Consejos alineados a Educacion Financiera (insercion curricular MINEDUC / FS4 primaria):
 * necesidad-deseo, ahorro, presupuesto, consumo responsable, valor del dinero.
 */

export const CONSEJOS_STAGE_1: InfoTip[] = [
  asFact('Necesidad = algo importante para vivir y estudiar bien.'),
  asFact('Deseo = algo que quieres, pero puedes esperar.'),
  asFact('Ahorrar es guardar dinero para una meta.'),
  asFact('Comida y utiles escolares son necesidades.'),
  asFact('Un juguete extra suele ser un deseo.'),
  asFact('El valor del dinero es lo que puedes comprar con el.'),
  asFact('Pensar antes de gastar es consumo responsable.'),
  asFact('Si gastas todo hoy, no te alcanza manana.'),
  asFact('Una alcancia ayuda a formar el habito de ahorro.'),
  asFact('Elegir bien es tomar una decision informada.'),
]

export const CONSEJOS_STAGE_2: InfoTip[] = [
  asFact('Un presupuesto lista ingresos y gastos del mes.'),
  asFact('Comparar precios es consumo responsable.'),
  asFact('Una meta de ahorro te ayuda a planificar.'),
  asFact('Gasto fijo = pagas siempre; variable = a veces.'),
  asFact('Reparar puede costar menos que comprar nuevo.'),
  asFact('Pequenas sumas semanales suman una gran meta.'),
  asFact('Lo escolar y transporte son gastos importantes.'),
  asFact('Planear evita gastar de mas por impulso.'),
  asFact('Ahorrar con meta es parte del presupuesto.'),
  asFact('Antes de comprar, pregunta: lo necesito ya?'),
]

export const CONSEJOS_STAGE_3: InfoTip[] = [
  asFact('Un fondo de emergencia cubre imprevistos.'),
  asFact('Pagar deuda a tiempo evita intereses altos.'),
  asFact('Interes = costo extra por pedir prestado.'),
  asFact('Invertir en ti mejora tus oportunidades.'),
  asFact('Ahorro guarda; inversion busca que crezca.'),
  asFact('No compartas claves: previene fraudes.'),
  asFact('Comprar sin pensar puede ser impulsivo.'),
  asFact('Comparar opciones es decision informada.'),
  asFact('El sobreendeudamiento pasa si gastas de mas.'),
  asFact('Usar bien el dinero fortalece tu bienestar.'),
]

export function getConsejosPool(stageId: number): InfoTip[] {
  if (stageId === 2) return CONSEJOS_STAGE_2
  if (stageId === 3) return CONSEJOS_STAGE_3
  return CONSEJOS_STAGE_1
}

export function pickRandomConsejo(stageId: number): InfoTip {
  const pool = getConsejosPool(stageId)
  return pool[Math.floor(Math.random() * pool.length)] ?? pool[0]
}

export function onlyConsejos(tips: InfoTip[]): InfoTip[] {
  return tips.filter((t) => t.kind === 'fact')
}
