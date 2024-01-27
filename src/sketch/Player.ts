import type p5 from 'p5'
import { getOpponentName, config, type PlayerName, COLLISION_CATEGORY, type Label } from '../core'
import type { Vector } from 'p5'
import { Bodies, World, Body } from 'matter-js'

export class Player {
  private body: Body
  constructor(
    private p5: p5,
    private world: World,
    position: Vector,
    velocity: Vector,
    private size: number,
    public name: PlayerName,
  ) {
    const label: Label = { type: 'player', name: this.name }
    this.body = Bodies.rectangle(position.x + size / 2, position.y + size / 2, size, size, {
      frictionAir: 0,
      frictionStatic: 0,
      friction: 0,
      inertia: Infinity,
      restitution: 1,
      collisionFilter: { mask: COLLISION_CATEGORY[getOpponentName(this.name)] | COLLISION_CATEGORY.wall },
      label: JSON.stringify(label),
    })
    Body.setVelocity(this.body, velocity)
    World.add(this.world, this.body)
  }

  public draw() {
    const pos = this.body.position
    this.p5.fill(config.colors[this.name])
    this.p5.square(pos.x, pos.y, this.size + 1)
  }
}
