export const config = {
  field: {
    sideLength: 16,
  },
  colors: {
    left: '#F8AB2B',
    right: '#4D428B',
  } satisfies Record<PlayerName, string>,
} as const

export const playerNames = ['left', 'right'] as const
export type PlayerName = (typeof playerNames)[number]
export type Color = (typeof config)['colors'][PlayerName]

export type Score = { left: number; right: number }

export function getOpponentName(name: PlayerName): PlayerName {
  return name === 'left' ? 'right' : 'left'
}

export const COLLISION_CATEGORY = { wall: 0x0001, left: 0x0002, right: 0x0004 } as const
