export default class Paddle {
  paddleElem: HTMLElement
  constructor(paddleElem: HTMLElement) {
    this.paddleElem = paddleElem
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--position")
    )
  }

  set position(value) {
    this.paddleElem.style.setProperty("--position", value.toString())
  }

  get hue() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--hue")
    )
  }

  set hue(value) {
    if (getComputedStyle(this.paddleElem).getPropertyValue("--light") === "100") {
      if (value > 360) {
        this.paddleElem.style.setProperty("--hue", (value - 360).toString())
      } else if (value < 0) {
        this.paddleElem.style.setProperty("--hue", (value + 360).toString())
      }
      this.paddleElem.style.setProperty("--light", "50")
    } else if (value < 0 && getComputedStyle(this.paddleElem).getPropertyValue("--light") === "50") {
      this.paddleElem.style.setProperty("--light", "100")
      this.paddleElem.style.setProperty("--hue", (value + 360).toString())
    } else if (value > 360 && getComputedStyle(this.paddleElem).getPropertyValue("--light") === "50") {
        this.paddleElem.style.setProperty("--light", "100")
        this.paddleElem.style.setProperty("--hue", (value - 360).toString())
      }
      else {
        this.paddleElem.style.setProperty("--hue", (value).toString())
      }
  }

  get light() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--light")
    )
  }

  set light(value) {
    this.paddleElem.style.setProperty("--light", value.toString())
  }
}
