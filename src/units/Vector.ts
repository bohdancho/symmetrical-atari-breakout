export class Vector {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  public static areEqual(a: Vector, b: Vector): boolean {
    return a.x === b.x && a.y === b.y
  }
}
