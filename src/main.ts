import '~/style.css'
import { Canvas } from './core/Canvas'
import { Simulation } from './Simulation'

const canvasElem = document.querySelector<HTMLCanvasElement>('#canvas')!
const canvas = new Canvas(canvasElem)
const simulation = new Simulation(canvas, handleScoreUpdate)

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

const leftScoreElem = document.querySelector<HTMLSpanElement>('#leftScore')!
const rightScoreElem = document.querySelector<HTMLSpanElement>('#rightScore')!
function handleScoreUpdate({ left, right }: { left: number; right: number }) {
  leftScoreElem.innerText = String(left)
  rightScoreElem.innerText = String(right)
}

renderLoop()
