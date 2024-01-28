import { Bodies, type Body, World, Vector } from 'matter-js'
import { COLLISION_CATEGORY, config, getOpponentName, type PlayerName } from '../core'

export class Field {
  public readonly bodiesToSquares = new Map<Body, FieldSquare>()

  constructor(
    private world: World,
    sideLength: number,
    squareSizePx: number,
  ) {
    Array.from({ length: sideLength }, (_, y) =>
      Array.from({ length: sideLength }, (_, x) => {
        const owner = x < sideLength / 2 ? 'left' : 'right'
        const position = Vector.create(x * squareSizePx + squareSizePx / 2, y * squareSizePx + squareSizePx / 2)
        const square = new FieldSquare(this.world, position, owner, squareSizePx)
        this.bodiesToSquares.set(square.body, square)
        return square
      }),
    )
  }
}

export class FieldSquare {
  public readonly body: Body
  constructor(
    private world: World,
    position: Vector,
    private _owner: PlayerName,
    sizePx: number,
  ) {
    this.body = Bodies.rectangle(position.x, position.y, sizePx + 1, sizePx + 1, {
      isStatic: true,
      collisionFilter: { category: COLLISION_CATEGORY[this._owner] },
      render: {
        fillStyle: config.colors[getOpponentName(this._owner)],
      },
    })
    World.add(this.world, this.body)
  }

  public get owner(): PlayerName {
    return this._owner
  }

  public capture(newOwner: PlayerName) {
    this._owner = newOwner
    this.body.render.fillStyle = config.colors[getOpponentName(newOwner)]
    this.body.collisionFilter.category = COLLISION_CATEGORY[newOwner]
  }
}
