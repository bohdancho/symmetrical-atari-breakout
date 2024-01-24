import { type Canvas } from './core/Canvas'
import { config } from './core/config'

export class Simulation {
  constructor(private readonly canvas: Canvas) {}

  public renderNextFrame(_timeDeltaMs: number) {
    this.canvas.clear()
    this.canvas.ctx.fillStyle = config.colors.left
    this.canvas.ctx.fillRect(0, 0, this.canvas.sizePx / 2, this.canvas.sizePx)

    this.canvas.ctx.fillStyle = config.colors.right
    this.canvas.ctx.fillRect(this.canvas.sizePx / 2, 0, this.canvas.sizePx / 2, this.canvas.sizePx)
  }
}
