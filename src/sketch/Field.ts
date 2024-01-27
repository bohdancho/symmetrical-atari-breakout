import type p5 from 'p5'
import type { Vector } from 'p5'
import { Bodies, type Body, World } from 'matter-js'
import { type Label, COLLISION_CATEGORY, config, getOpponentName, type PlayerName } from '../core'

export class Field {
  private field: FieldSquare[][] = []

  constructor(
    private p5: p5,
    private world: World,
    private sideLength: number,
  ) {
    const squareSizePx = this.p5.width / this.sideLength
    this.field = Array.from({ length: this.sideLength }, (_, y) =>
      Array.from({ length: this.sideLength }, (_, x) => {
        const owner = x < this.sideLength / 2 ? 'left' : 'right'
        const position = this.p5.createVector(x * squareSizePx + squareSizePx / 2, y * squareSizePx + squareSizePx / 2)
        return new FieldSquare(this.p5, this.world, p5.createVector(x, y), position, owner, squareSizePx)
      }),
    )
  }

  public captureSquare(index: Vector, newOwner: PlayerName): void {
    const square = this.field[index.y][index.x]
    square.owner = newOwner
  }

  public draw() {
    this.field.forEach((row) =>
      row.forEach((square) => {
        square.draw()
      }),
    )
  }

  public static getEnemyName(name: PlayerName): PlayerName {
    return name === 'left' ? 'right' : 'left'
  }
}

class FieldSquare {
  private body: Body
  constructor(
    private p5: p5,
    private world: World,
    index: Vector,
    position: Vector,
    private _owner: PlayerName,
    private sizePx: number,
  ) {
    const label: Label = { type: 'fieldSquare', index }
    this.body = Bodies.rectangle(position.x, position.y, sizePx, sizePx, {
      isStatic: true,
      collisionFilter: { category: COLLISION_CATEGORY[this._owner] },
      label: JSON.stringify(label),
    })
    World.add(this.world, this.body)
  }

  public get owner(): PlayerName {
    return this._owner
  }

  public set owner(newOwner: PlayerName) {
    this._owner = newOwner
    this.body.collisionFilter.category = COLLISION_CATEGORY[newOwner]
  }

  public draw(): void {
    const pos = this.body.position
    const fill = config.colors[getOpponentName(this._owner)]
    this.p5.fill(fill)
    this.p5.square(pos.x, pos.y, this.sizePx + 1)
  }
}
