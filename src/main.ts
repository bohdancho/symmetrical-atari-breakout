import '~/style.css'
import { Canvas } from './core/Canvas'
import { Simulation } from './Simulation'

const canvasElem = document.querySelector<HTMLCanvasElement>('#canvas')!
const canvas = new Canvas(canvasElem)
const simulation = new Simulation(canvas)

let lastTimestamp: number
function renderLoop() {
  const now = performance.now()
  if (!lastTimestamp) {
    lastTimestamp = now
  }
  const deltaMs = performance.now() - lastTimestamp
  lastTimestamp = now

  simulation.render(deltaMs)
  requestAnimationFrame(renderLoop)
}

renderLoop()
