import '~/style.css'
import { Sketch } from './sketch/Sketch'

const leftScoreElem = document.querySelector<HTMLSpanElement>('#leftScore')!
const rightScoreElem = document.querySelector<HTMLSpanElement>('#rightScore')!
function handleScoreUpdate({ left, right }: { left: number; right: number }) {
  leftScoreElem.innerText = String(left)
  rightScoreElem.innerText = String(right)
}

new Sketch(handleScoreUpdate)
