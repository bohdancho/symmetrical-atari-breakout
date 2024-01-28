import '~/style.css'
import {
  Engine,
  Render,
  Runner,
  Events,
  Composite,
  Bodies,
  Vector,
  type Pair,
  type IEventCollision,
  Body,
  Resolver,
} from 'matter-js'
import { config, playerNames, type PlayerName } from './core'
import { Field, type FieldSquare } from './components/Field'
import { Player } from './components/Player'

const leftScoreElem = document.querySelector<HTMLSpanElement>('#leftScore')!
const rightScoreElem = document.querySelector<HTMLSpanElement>('#rightScore')!
function handleScoreUpdate({ left, right }: { left: number; right: number }) {
  leftScoreElem.innerText = String(left)
  rightScoreElem.innerText = String(right)
}

const score = { left: config.field.sideLength ** 2 / 2, right: config.field.sideLength ** 2 / 2 }
handleScoreUpdate(score)
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
const height = canvas.offsetHeight
const width = canvas.offsetWidth

const engine = Engine.create()
engine.gravity.y = 0
const world = engine.world
const render = Render.create({
  engine,
  canvas,
  options: { width: canvas.offsetWidth, height: canvas.offsetHeight, wireframes: false },
})
Render.run(render)
const runner = Runner.create({ isFixed: true })
Runner.run(runner, engine)
// @ts-expect-error bouncing with restitution=1 workaround https://github.com/liabru/matter-js/issues/394#issuecomment-289913662
Resolver._restingThresh = 1

const field = new Field(world, config.field.sideLength, width / config.field.sideLength)
Events.on(engine, 'collisionEnd', (event) => handleCollisionCaptures(event))

Composite.add(world, [
  Bodies.rectangle(-2.5, height / 2, 5, height, { isStatic: true }),
  Bodies.rectangle(width + 2.5, height / 2, 5, height, { isStatic: true }),
  Bodies.rectangle(width / 2, -2.5, width, 5, { isStatic: true }),
  Bodies.rectangle(width / 2, height + 2.5, width, 5, { isStatic: true }),
])

const squareSizePx = width / config.field.sideLength
const minSpeed = 0
const maxSpeed = Math.floor(squareSizePx / 2)

const playerLeft = new Player(
  world,
  Vector.create(squareSizePx, random(squareSizePx, height - squareSizePx * 3)),
  Vector.create(random(maxSpeed / 4, maxSpeed / 3), random(maxSpeed / 4, maxSpeed / 3)),
  squareSizePx,
  'left',
)
const playerRight = new Player(
  world,
  Vector.create(width - squareSizePx * 3, random(squareSizePx, height - squareSizePx * 3)),
  Vector.create(random(maxSpeed / 4, maxSpeed / 3), random(maxSpeed / 4, maxSpeed / 3)),
  squareSizePx,
  'right',
)
const bodyToPlayer = new Map<Body, Player>([
  [playerLeft.body, playerLeft],
  [playerRight.body, playerRight],
])

const speedInputs = document.querySelectorAll<HTMLInputElement>('.js-speed-input')
speedInputs.forEach((inputElem) => {
  const playerName = inputElem.dataset.player as PlayerName
  const player = playerName === 'left' ? playerLeft : playerRight
  const axis = inputElem.dataset.axis as 'x' | 'y'

  inputElem.min = String(minSpeed)
  inputElem.max = String(maxSpeed)
  inputElem.value = String(player.body.velocity[axis])

  inputElem.addEventListener('input', () => {
    const speed = Number(inputElem.value)
    const velocity = Vector.clone(player.body.velocity)
    velocity[axis] = speed
    Body.setVelocity(player.body, velocity)
  })
})

function handleCollisionCaptures(event: IEventCollision<Engine>) {
  playerNames.forEach((playerName) => {
    const playerFieldPairs = getPlayerSquarePairs(event.pairs, playerName)
    if (playerFieldPairs.length === 0) {
      return
    }
    const { player, square } = playerFieldPairs[0]
    if (player.name === 'left') {
      score.left++
      score.right--
    } else {
      score.left--
      score.right++
    }
    handleScoreUpdate(score)
    square.capture(player.name)
  })
}

function getPlayerSquarePairs(pairs: Pair[], name: PlayerName) {
  const playerFieldPairs: { player: Player; square: FieldSquare }[] = []
  pairs.forEach(({ bodyA, bodyB }) => {
    let player: Player | undefined = undefined
    let square: FieldSquare | undefined = undefined
    for (const body of [bodyA, bodyB]) {
      if (bodyToPlayer.has(body)) {
        player = bodyToPlayer.get(body)!
      } else if (field.bodiesToSquares.has(body)) {
        square = field.bodiesToSquares.get(body)!
      }
    }
    if (square && player?.name === name) {
      playerFieldPairs.push({ player, square })
    }
  })
  return playerFieldPairs
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
