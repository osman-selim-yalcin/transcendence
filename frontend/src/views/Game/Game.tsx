import { useContext, useEffect, useRef } from "react"
import { SocketContext } from "../../context/SocketContext"
import "./Game.scss"
import Paddle from "../../game/Paddle"
// import { game_start } from "../game/index.js"

export default function Game() {
  const socket = useContext(SocketContext)
  const movement = useRef(0);

  useEffect(() => {
    const playerPaddle = new Paddle(document.getElementById("player"))
    document.addEventListener("keydown", handleKeyDown)
    // document.addEventListener("keyup", handleKeyUp)
    function handleKeyDown(event: any) {
      if (event.key === "w") {
        playerPaddle.position -= 1
        // movement.current = 1
      } else
      if (event.key === "s") {
        playerPaddle.position += 1
        // movement.current = -1
      }
    }
    function handleKeyUp(event: any) {
      if (event.key === "w" || event.key === "s") {
        // playerPaddle.position -= 10
        // movement.current = 0
      }
    }

    // const interval = setInterval(() => {
    //   if (movement.current === 1) {
    //     playerPaddle.position -= 0.7
    //   } else if (movement.current === -1) {
    //     playerPaddle.position += 0.7
    //   }
    // }, 15)
    return (() => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
      // clearInterval(interval)
    })
  }, [])

  return (
    <div className={"game-frame"}>
        <div className="game-container">
        <div className="game">
          <div id={"opponent"} className="paddle right"></div>
          <div id={"player"} className="paddle left"></div>
        </div>
        </div>
    </div>
  )
}
