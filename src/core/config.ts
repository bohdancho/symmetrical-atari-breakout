export const config = {
  field: {
    sideLength: 16,
  },
  colors: {
    left: '#4D428B',
    right: '#F8AB2B',
  },
} as const

export type Color = (typeof config)['colors'][keyof (typeof config)['colors']]
