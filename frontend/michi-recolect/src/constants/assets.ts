import bgSuelo3 from '../assets/bg-suelo3.png'
import michiPlayer from '../assets/michi-player.png'
import coinSprite from '../assets/coin.png'
import chestSprite from '../assets/chest.png'
import starSprite from '../assets/star.png'
import iconInfoSprite from '../assets/icon-info.png'
import michiCelebrating from '../assets/michi-celebrating.png'
import michiSaving from '../assets/michi-saving.png'
import type { ObjectKind } from '../types/game'

export const GAME_BACKGROUND = bgSuelo3

export const MICHI_SPRITE = michiPlayer

/** Michi con alcancia - lado izquierdo */
export const SIDE_DECOR_LEFT = michiSaving

/** Michi celebrando - lado derecho */
export const SIDE_DECOR_RIGHT = michiCelebrating

export const ITEM_SPRITES: Partial<Record<ObjectKind, string>> = {
  coin: coinSprite,
  chest: chestSprite,
  star: starSprite,
  info: iconInfoSprite,
}
