import '~/style.css'
import { Canvas } from './core/Canvas'
import { Simulation } from './Simulation'

const canvasElem = document.querySelector<HTMLCanvasElement>('#canvas')!
const canvas = new Canvas(canvasElem)
const simulation = new Simulation(canvas)
simulation.renderNextFrame(0)
