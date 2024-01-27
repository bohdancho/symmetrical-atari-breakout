import p5 from 'p5'
import { Field } from './Field'
import { Player } from './Player'
import { type World, Engine, Events, Composite, Bodies, type IEventCollision, type Pair } from 'matter-js'
import { config, type FieldSquareLabel, type Label, type PlayerLabel, type PlayerName, type Score } from '../core'

export class Sketch extends p5 {
  private field!: Field
  private score = { left: config.field.sideLength ** 2 / 2, right: config.field.sideLength ** 2 / 2 }
  private leftPlayer!: Player
  private rightPlayer!: Player
  public world!: World
  private engine!: Engine

  constructor(private handleScoreUpdate: (score: Score) => void) {
    super(() => undefined)
    this.handleScoreUpdate(this.score)
  }

  setup() {
    const canvas = document.querySelector<HTMLElement>('#canvas')!
    this.createCanvas(canvas.offsetWidth, canvas.offsetHeight, canvas)
    this.noStroke()
    this.rectMode(this.CENTER)

    this.engine = Engine.create()
    this.engine.gravity.y = 0
    this.world = this.engine.world
    this.field = new Field(this, this.world, config.field.sideLength)
    Events.on(this.engine, 'collisionEnd', (event) => this.handleCollisionCaptures(event))

    Composite.add(this.world, [
      Bodies.rectangle(0, this.height / 2, 5, this.height, { isStatic: true }),
      Bodies.rectangle(this.width, this.height / 2, 5, this.height, { isStatic: true }),
      Bodies.rectangle(this.width / 2, 0, this.width, 5, { isStatic: true }),
      Bodies.rectangle(this.width / 2, this.height, this.width, 5, { isStatic: true }),
    ])

    const squareSizePx = this.width / config.field.sideLength
    this.leftPlayer = new Player(
      this,
      this.world,
      this.createVector(
        this.random(0, config.field.sideLength / 3) * squareSizePx,
        this.random(0, this.height - squareSizePx),
      ),
      this.createVector(squareSizePx / this.random(3, 5), squareSizePx / this.random(3, 5)),
      squareSizePx,
      'left',
    )
    this.rightPlayer = new Player(
      this,
      this.world,
      this.createVector(
        this.width - this.random(1, config.field.sideLength / 3) * squareSizePx,
        this.random(0, this.height - squareSizePx),
      ),
      this.createVector(squareSizePx / this.random(3, 5), squareSizePx / this.random(3, 5)),
      squareSizePx,
      'right',
    )
  }

  draw() {
    Engine.update(this.engine)

    this.field.draw()
    this.leftPlayer.draw()
    this.rightPlayer.draw()
  }

  handleCollisionCaptures(event: IEventCollision<Engine>) {
    const playerNames = ['left', 'right'] as const
    playerNames.forEach((playerName) => {
      let playerFieldPairs = getPlayerFieldPairs(event.pairs, playerName)
      if (playerFieldPairs.length === 0) {
        return
      }
      if (playerFieldPairs.length > 1) {
        const areVerticallyAjacent = playerFieldPairs[0].field.index.x === playerFieldPairs[1].field.index.x
        const areHorizontallyAjacent = playerFieldPairs[0].field.index.y === playerFieldPairs[1].field.index.y
        if (areVerticallyAjacent || areHorizontallyAjacent) {
          playerFieldPairs = playerFieldPairs.slice(0, 1)
        }
      }
      playerFieldPairs.forEach(({ player, field }) => {
        if (player.name === 'left') {
          this.score.left++
          this.score.right--
        } else {
          this.score.left--
          this.score.right++
        }
        this.handleScoreUpdate(this.score)
        this.field.captureSquare(field.index, player.name)
      })
    })
  }
}

function getPlayerFieldPairs(pairs: Pair[], name: PlayerName) {
  const playerFieldPairs: { player: PlayerLabel; field: FieldSquareLabel }[] = []
  pairs.forEach(({ bodyA, bodyB }) => {
    const labelA = parseLabel(bodyA.label)
    const labelB = parseLabel(bodyB.label)

    if (labelA?.type === 'player' && labelA.name === name && labelB?.type === 'fieldSquare') {
      playerFieldPairs.push({ player: labelA, field: labelB })
    }
    if (labelB?.type === 'player' && labelB.name === name && labelA?.type === 'fieldSquare') {
      playerFieldPairs.push({ player: labelB, field: labelA })
    }
  })
  return playerFieldPairs
}

function parseLabel(string: string) {
  try {
    return JSON.parse(string) as Label
  } catch (e) {
    return null
  }
}
