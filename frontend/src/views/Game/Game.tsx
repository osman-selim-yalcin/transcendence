import { useContext, useEffect, useRef, useState } from "react"
import { SocketContext } from "../../context/SocketContext"
import "./Game.scss"
import Paddle from "../../game/Paddle"
import { Modal } from "../../components/Modal"
import { redirect } from "react-router-dom"
// import { game_start } from "../game/index.js"

export default function Game() {
  const socket = useContext(SocketContext)
  const keys = useRef({
    w: {
      pressed: false
    },
    s: {
      pressed: false
    },
  })
  const interval = useRef(null)
  const [modal, setModal] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    function handleKeyDown(event: any) {
      if (event.key === "w") {
        keys.current.w.pressed = true
      } else
        if (event.key === "s") {
          keys.current.s.pressed = true
        }

      if (event.key === "p") {
        setModal(true)
        setReady(false)
        clearInterval(interval.current)
      }
    }
    function handleKeyUp(event: any) {
      if (event.key === "w") {
        keys.current.w.pressed = false
      } else if (event.key === "s") {
        keys.current.s.pressed = false
      }
    }

    return (() => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    })
  }, [])

  useEffect(() => {
    const playerPaddle = new Paddle(document.getElementById("player"))
    if (ready) {
      interval.current = setInterval(() => {
        // console.log(0)
        if (keys.current.w.pressed && playerPaddle.position > 10)
          playerPaddle.position -= 1
        if (keys.current.s.pressed && playerPaddle.position < 90)
          playerPaddle.position += 1
      }, 15)
    }
    return (() => {
      clearInterval(interval.current)
    })
  }, [ready])

  return (
    <div className={"game-frame"}>
      <div className="game-container">
        <div className="game">
          <div id={"opponent"} className={"paddle right" + (ready ? "" : " hidden")}></div>
          <div id={"player"} className={"paddle left" + (ready ? "" : " not-ready")}></div>
          <button className={"temp"}
            onClick={() => {
              setReady(!ready)
            }}>Play</button>
          <div className={"color-select-buttons" + (ready ? " hidden" : "")}>
            <button onClick={() => {
              const playerPaddle = new Paddle(document.getElementById("player"))
              playerPaddle.hue = (playerPaddle.hue - 40) % 360
            }}>&#8592;</button>
            <button onClick={() => {
              const playerPaddle = new Paddle(document.getElementById("player"))
              playerPaddle.hue = (playerPaddle.hue + 40) % 360
            }}>&#8594;</button>
          </div>
          <div className={"center hidden"}></div>
        </div>
        <Modal isActive={[modal, setModal]}>
          Game paused
          <button onClick={() => {
            setReady(true)
            setModal(false)
          }}>Play</button>
        </Modal>
      </div>
    </div>
  )
}
