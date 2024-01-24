import { type Canvas } from './core/Canvas'
import { config, type PlayerName } from './core/config'
import { Vector } from './units/Vector'

type Player = {
  position: Vector
  speed: Vector
  name: PlayerName
}

export class Simulation {
  private field: PlayerName[][]
  private squareSizePx: number
  private leftPlayer: Player
  private rightPlayer: Player
  private leftOwns: number

  constructor(
    private readonly canvas: Canvas,
    private readonly scoreUpdate: (score: { left: number; right: number }) => void,
  ) {
    this.leftOwns = config.field.sideLength ** 2 / 2
    this.squareSizePx = this.canvas.sizePx / config.field.sideLength
    this.field = Array.from({ length: config.field.sideLength }, () =>
      Array.from({ length: config.field.sideLength }, (_, i) => {
        return i < config.field.sideLength / 2 ? 'left' : 'right'
      }),
    )

    this.leftPlayer = {
      position: new Vector(Math.floor(config.field.sideLength / 7), Math.floor(config.field.sideLength / 4)),
      speed: new Vector(config.field.sideLength * 1.8, config.field.sideLength * 0.5),
      name: 'left',
    }
    this.rightPlayer = {
      position: new Vector(
        Math.floor(config.field.sideLength - config.field.sideLength / 7),
        Math.floor(config.field.sideLength / 2),
      ),
      speed: new Vector(config.field.sideLength * -1.8, config.field.sideLength * 0.5),
      name: 'right',
    }
  }

  public render(deltaMs: number) {
    this.canvas.clear()
    this.field.forEach((row, y) =>
      row.forEach((squareOwner, x) => {
        const position = new Vector(x, y)
        this.paintSquare(position, Simulation.getEnemyName(squareOwner))
      }),
    )

    this.translateWithBounce(this.leftPlayer, deltaMs)
    this.translateWithBounce(this.rightPlayer, deltaMs)

    this.paintSquare(this.leftPlayer.position, this.leftPlayer.name)
    this.paintSquare(this.rightPlayer.position, this.rightPlayer.name)
  }

  private paintSquare(position: Vector, playerName: PlayerName): void {
    this.canvas.ctx.fillStyle = config.colors[playerName]
    this.canvas.ctx.fillRect(
      position.x * this.squareSizePx,
      position.y * this.squareSizePx,
      this.squareSizePx + 1,
      this.squareSizePx + 1,
    )
  }

  private translateWithBounce(player: Player, deltaMs: number): void {
    const translation = player.speed.multiply(deltaMs / 1000)
    const newPosition = player.position.add(translation)

    const collision = this.getCollision(newPosition, player.name)
    if (!collision) {
      player.position = newPosition
      return
    }

    player.position = player.position.add(translation.multiply(-0.01))

    const bounceFactors = { x: 1, y: 1 }
    bounceFactors.x = collision.shift.x === 0 ? 1 : -1
    bounceFactors.y = collision.shift.y === 0 ? 1 : -1
    player.speed = new Vector(player.speed.x * bounceFactors.x, player.speed.y * bounceFactors.y)

    if (!collision.capturedSquare) {
      return
    }
    this.field[collision.capturedSquare.y][collision.capturedSquare.x] = player.name
    if (player.name === 'left') {
      this.leftOwns++
    } else {
      this.leftOwns--
    }
    this.scoreUpdate({ left: this.leftOwns, right: config.field.sideLength ** 2 - this.leftOwns })
  }

  private getCollision(
    position: Vector,
    playerName: PlayerName,
  ):
    | {
        capturedSquare?: Vector
        shift: { x: -1 | 0 | 1; y: -1 | 0 | 1 }
      }
    | undefined {
    const shifts = [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ] as const
    for (const shift of shifts) {
      const adjacentCoordinates: { x: number | undefined; y: number | undefined } = { x: undefined, y: undefined }

      const coordinates = ['x', 'y'] as const
      coordinates.forEach((coordinate) => {
        if (shift[coordinate] === 0) {
          adjacentCoordinates[coordinate] = Math.round(position[coordinate])
        } else if (shift[coordinate] === 1) {
          adjacentCoordinates[coordinate] = Math.floor(position[coordinate] + 1)
        } else if (shift[coordinate] === -1) {
          adjacentCoordinates[coordinate] = Math.ceil(position[coordinate] - 1)
        }
      })
      const adjacentPosition = new Vector(adjacentCoordinates.x!, adjacentCoordinates.y!)

      if (
        adjacentPosition.x < 0 ||
        adjacentPosition.y < 0 ||
        adjacentPosition.x >= config.field.sideLength ||
        adjacentPosition.y >= config.field.sideLength
      ) {
        return { shift }
      }

      const hasCaptured = this.field[adjacentPosition.y][adjacentPosition.x] === Simulation.getEnemyName(playerName)
      if (hasCaptured) {
        return { capturedSquare: adjacentPosition, shift }
      }
    }
  }

  public static getEnemyName(name: PlayerName): PlayerName {
    return name === 'left' ? 'right' : 'left'
  }
}
