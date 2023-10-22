import { PropsWithChildren, useContext, useEffect, useRef, useState } from "react"
import { SocketContext } from "../../context/SocketContext"
import "./Game.scss"
import Paddle from "../../game/Paddle"
import { Modal } from "../../components/Modal/Modal"
import Ball from "../../game/Ball"
import { GameState, currentPositions, user } from "../../types"
import { UserContext } from "../../context/UserContext"
import LoadIndicator from "../../components/LoadIndicator/LoadIndicator"
// import { game_start } from "../game/index.js"

export default function Game() {
  const socket = useContext(SocketContext)
  const { user } = useContext(UserContext)
  const interval = useRef(null)
  const [gameState, setGameState] = useState<GameState>(GameState.PREQUEUE)
  const [opponent, setOpponent] = useState<user>(null)
  const keys = useRef({
    w: {
      pressed: false
    },
    s: {
      pressed: false
    },
  })

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
    const opponentPaddle = new Paddle(document.getElementById("opponent"))
    const ball = new Ball(document.getElementById("ball"))
    if (gameState === GameState.IN_QUEUE) {
      socket.on("pre-game", (data: user) => {
        setGameState(GameState.PREGAME_NOT_READY)
      })
      socket.emit("join queue")
    } else if (gameState === GameState.PREGAME_NOT_READY) {
      socket.off("pre-game")
      socket.on("game start", () => {
        setGameState(GameState.IN_GAME)
      })
    } else if (gameState === GameState.PREGAME_READY) {
      socket.emit("ready", playerPaddle.hue)
    } else if (gameState === GameState.IN_GAME) {
      socket.off("game start")
      socket.on("game over", () => {
        clearInterval(interval.current)
      })
      socket.on("game update", (data: currentPositions) => {
        playerPaddle.position = data.paddles[0].position.y
        opponentPaddle.position = data.paddles[1].position.y
        ball.x = data.ball.position.x
        ball.y = data.ball.position.y
      })
      interval.current = setInterval(() => {
        // socket.emit("on game", keys.current)

        // console.log(0)
        socket.emit("keys", keys.current)
        // if (keys.current.w.pressed && playerPaddle.position > 10) {
        //   playerPaddle.position -= 1
        // }
        // if (keys.current.s.pressed && playerPaddle.position < 90) {

        //   playerPaddle.position += 1
        // }
        // ball.x += 0.09
        // ball.y += 0.16
      }, 15)
    }
    console.log("game state:", gameState)
    return (() => {
      clearInterval(interval.current)
    })
  }, [gameState])

  return (
    <div className={"game-frame"}>
      <div className="game-container">
        <div className="game">
          <p className={"game-title game-center" + (gameState !== GameState.PREQUEUE ? " hidden" : "")}>PONG</p>
          {gameState <= GameState.IN_QUEUE &&
            <PreQueueContent gameStateHook={[gameState, setGameState]} />
          }
          {(gameState === GameState.PREGAME_NOT_READY || gameState === GameState.PREGAME_READY) &&
            <>
              <div className={"info user-info"}>
                <div className={"avatar"}>
                  <img src={user?.avatar} alt="user avatar" />
                </div>
                <div className={"body"}>
                  <p>
                    {user?.username.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className={"info opponent-info"}>
                <div className={"body"}>
                  <p>
                    {opponent?.username}
                  </p>
                </div>
                <div className={"avatar"}></div>
              </div>
            </>}
          <div id={"opponent"} className={"paddle right" + (gameState >= GameState.PREGAME_NOT_READY ? "" : " hidden")}></div>
          <div id={"player"} className={"paddle left" + ((gameState !== GameState.PREGAME_NOT_READY && gameState !== GameState.PREGAME_READY)  ? "" : " not-ready") + (gameState === GameState.PREQUEUE ? " hidden" : "")}></div>
          <div id={"ball"} className={"ball" + (gameState <= GameState.PREGAME_READY ? " hidden" : "")}></div>
          <CustomizeButtons gameStateHook={[gameState, setGameState]} />

          <div className={"center hidden"}></div>
          <div className="temp">
            <button onClick={() => {
              if (gameState !== 0) {
                setGameState(gameState - 1)
              }
            }}>prev</button>
            <button onClick={() => {
              if (gameState !== 4) {
                setGameState(gameState + 1)
              }
            }}>next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreQueueContent({ gameStateHook: [gameState, setGameState] }: PropsWithChildren<{ gameStateHook: [GameState, Function] }>) {
  const [modal, setModal] = useState(false)

  useEffect(() => {
    if (gameState === GameState.IN_QUEUE) {
      setModal(true)//queue
    } else {
      setModal(false)
    }
  }, [gameState])


  return (
    <>
      <div className="prequeue-content">
        <button className={(gameState === GameState.PREQUEUE ? "" : "hidden")} onClick={() => {
          setGameState(GameState.IN_QUEUE)
        }}
        >Join Queue</button>
        <button disabled className={(gameState === GameState.PREQUEUE ? "" : "hidden")} onClick={() => {
        }}>Invite a Player</button>
        <Modal isActive={[modal, setModal]} removable={false}>
          <LoadIndicator />
          <div className="in-queue-buttons">
            <button
              onClick={() => {
                setGameState(gameState + 1)
              }}
            >
              Skip
            </button> {/*temp*/}
            <button className={"cancel-button" + (gameState !== GameState.IN_QUEUE ? " hidden" : "")} onClick={() => {
              setGameState(GameState.PREQUEUE)
            }}>Cancel</button>
          </div>
        </Modal>
      </div>
    </>
  )
}

function CustomizeButtons({ gameStateHook: [gameState, setGameState] }: PropsWithChildren<{ gameStateHook: [GameState, Function] }>) {

  return (
    <>
      {gameState === GameState.PREGAME_READY && <p className={"ready-state"}>Waiting for opponent...</p>}
      {gameState === GameState.PREGAME_NOT_READY &&
        <>
          <div className={"ready-state"}>
            <button
              onClick={() => {
                // setGameState(gameState + 1)
                setGameState(GameState.PREGAME_READY)
              }}
            >Ready</button>
          </div>
          <div className={"color-select-buttons"}>
            <button onClick={() => {
              const playerPaddle = new Paddle(document.getElementById("player"))
              playerPaddle.hue = (playerPaddle.hue - 40)
            }}>&#8592;</button>
            <button onClick={() => {
              const playerPaddle = new Paddle(document.getElementById("player"))
              playerPaddle.hue = (playerPaddle.hue + 40)
            }}>&#8594;</button>
          </div>
        </>
      }
    </>
  )
}