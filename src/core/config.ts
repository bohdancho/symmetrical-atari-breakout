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
