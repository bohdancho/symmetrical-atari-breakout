export class Vector {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  public static areEqual(a: Vector, b: Vector): boolean {
    return a.x === b.x && a.y === b.y
  }

  public add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y)
  }

  public multiply(factor: number): Vector {
    return new Vector(this.x * factor, this.y * factor)
  }

  public floor(): Vector {
    return new Vector(Math.floor(this.x), Math.floor(this.y))
  }

  public ceil(): Vector {
    return new Vector(Math.ceil(this.x), Math.ceil(this.y))
  }

  public normalize(boundaries: Vector) {
    return new Vector(Math.min(boundaries.x, Math.max(0, this.x)), Math.min(boundaries.y, Math.max(0, this.y)))
  }
}
