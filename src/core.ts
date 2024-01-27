import { type Vector } from 'p5'

export const config = {
  field: {
    sideLength: 16,
  },
  colors: {
    left: '#F8AB2B',
    right: '#4D428B',
  } satisfies Record<PlayerName, string>,
} as const

export type PlayerName = 'left' | 'right'
export type Color = (typeof config)['colors'][PlayerName]

export type PlayerLabel = { type: 'player'; name: PlayerName }
export type FieldSquareLabel = { type: 'fieldSquare'; index: Vector }
export type Label = PlayerLabel | FieldSquareLabel

export type Score = { left: number; right: number }

export function getOpponentName(name: PlayerName): PlayerName {
  return name === 'left' ? 'right' : 'left'
}

export const COLLISION_CATEGORY = { wall: 0x0001, left: 0x0002, right: 0x0004 } as const
