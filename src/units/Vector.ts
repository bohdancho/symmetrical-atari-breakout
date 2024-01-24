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
}
