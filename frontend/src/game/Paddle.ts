export default class Paddle {
  paddleElem: HTMLElement;
  constructor(paddleElem: HTMLElement) {
    this.paddleElem = paddleElem
  }

  get position() {
    return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--position"))
  }

  set position(value) {
    this.paddleElem.style.setProperty("--position", value.toString())
  }

  get hue() {
    return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--hue"))
  }

  set hue(value) {
    this.paddleElem.style.setProperty("--hue", (value % 360).toString())
  }
}