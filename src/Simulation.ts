import { type Canvas } from './core/Canvas'
import { type Color, config } from './core/config'
import { Vector } from './units/Vector'

type Square = 'left' | 'right'
type Player = {
  position: Vector
  speed: Vector
  color: Color
}

export class Simulation {
  private field: Square[][]
  private squareSize: number
  private leftPlayer: Player
  private rightPlayer: Player

  constructor(private readonly canvas: Canvas) {
    this.squareSize = this.canvas.sizePx / config.field.sideLength
    this.field = Array.from({ length: config.field.sideLength }, () =>
      Array.from({ length: config.field.sideLength }, (_, i) => {
        return i < config.field.sideLength / 2 ? 'left' : 'right'
      }),
    )

    this.leftPlayer = {
      position: new Vector(Math.floor(config.field.sideLength / 7), Math.floor(config.field.sideLength / 4)),
      speed: new Vector(config.field.sideLength, config.field.sideLength * 0.8),
      color: config.colors.left,
    }
    this.rightPlayer = {
      position: new Vector(
        Math.floor(config.field.sideLength - config.field.sideLength / 7),
        Math.floor(config.field.sideLength - config.field.sideLength / 5),
      ),
      speed: new Vector(config.field.sideLength, config.field.sideLength * -0.6),
      color: config.colors.right,
    }
  }

  public render(deltaMs: number) {
    this.canvas.clear()
    this.field.forEach((row, y) =>
      row.forEach((square, x) => {
        const position = new Vector(x, y)
        this.paintSquare(position, config.colors[square])
      }),
    )

    const leftTranslation = this.leftPlayer.speed.multiply(deltaMs / 1000)
    this.leftPlayer.position = this.leftPlayer.position.add(leftTranslation)

    const rightTranslation = this.rightPlayer.speed.multiply(deltaMs / 1000)
    this.rightPlayer.position = this.rightPlayer.position.add(rightTranslation)

    this.paintSquare(this.leftPlayer.position, config.colors.right)
    this.paintSquare(this.rightPlayer.position, config.colors.left)
  }

  public paintSquare(position: Vector, color: Color): void {
    this.canvas.ctx.fillStyle = color
    this.canvas.ctx.fillRect(
      position.x * this.squareSize,
      position.y * this.squareSize,
      this.squareSize + 1,
      this.squareSize + 1,
    )
  }
}
