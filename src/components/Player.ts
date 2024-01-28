import { getOpponentName, config, type PlayerName, COLLISION_CATEGORY } from '../core'
import { Bodies, World, Body, type Vector } from 'matter-js'

export class Player {
  public readonly body: Body
  constructor(
    private world: World,
    position: Vector,
    velocity: Vector,
    size: number,
    public readonly name: PlayerName,
  ) {
    this.body = Bodies.rectangle(position.x + size / 2, position.y + size / 2, size, size, {
      frictionAir: 0,
      frictionStatic: 0,
      friction: 0,
      inertia: Infinity,
      restitution: 1,
      collisionFilter: { mask: COLLISION_CATEGORY[getOpponentName(this.name)] | COLLISION_CATEGORY.wall },
      render: {
        fillStyle: config.colors[this.name],
      },
    })
    Body.setVelocity(this.body, velocity)
    World.add(this.world, this.body)
  }
}
