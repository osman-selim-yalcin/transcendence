import { PropsWithChildren, useContext, useEffect, useRef, useState } from "react"
import { SocketContext } from "../../context/SocketContext"
import "./Game.scss"
import Paddle from "../../game/Paddle"
import Ball from "../../game/Ball"
import { GameState, currentPositions, player, user } from "../../types"
import { UserContext } from "../../context/UserContext"
import LoadIndicator from "../../components/LoadIndicator/LoadIndicator"
import { getOpponent } from "../../api/game"
import { useSearchParams } from "react-router-dom"

export default function Game() {
  const socket = useContext(SocketContext)
  const { user } = useContext(UserContext)
  const interval = useRef(null)
  const [gameState, setGameState] = useState<GameState>(GameState.PREQUEUE)
  const [opponent, setOpponent] = useState<user>(null)
  const [selfIndex, setSelfIndex] = useState<number>(null)
  const [searchParams, _setSearchParams] = useSearchParams();

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

    socket.on("game over", () => {
      clearInterval(interval.current)
      setGameState(GameState.POST_GAME)
    })
    
    return (() => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
      socket.off("pre-game")
      socket.off("game start")
      socket.off("game update")
      socket.off("game over")
      socket.emit("leave game")
    })
  }, [])
  
  useEffect(() => {
    const myParam = searchParams.get('ref');

    async function checkParams() {
      if (myParam === "invite") {
        await getOpponent()
        .then((res: { user: user, index: number }) => {
          console.log("hello", res)
          setOpponent(res.user)
          setSelfIndex(1 - res.index)
        })
        setGameState(GameState.PREGAME_NOT_READY)
      }
    }

    checkParams()

  }, [searchParams])

  useEffect(() => {
    const playerPaddle = new Paddle(document.getElementById("player"))
    const opponentPaddle = new Paddle(document.getElementById("opponent"))
    const ball = new Ball(document.getElementById("ball"))
    if (gameState === GameState.PREQUEUE) {
    } else if (gameState === GameState.IN_QUEUE) {
      socket.on("pre-game", (data: player[]) => {
        console.log(data)
        data.forEach((player, index) => {
          if (player.user.id === user.id) {
            setSelfIndex(index)
          } else {
            setOpponent(player.user)
          }
        })
        setGameState(GameState.PREGAME_NOT_READY)
      })
      socket.emit("join queue")
    } else if (gameState === GameState.PREGAME_NOT_READY) {
      const opponentPaddle = new Paddle(document.getElementById("opponent"))
      // opponentPaddle.hue = -10

      opponentPaddle.position = 50
      opponentPaddle.hue = 30
      opponentPaddle.light = 100
      playerPaddle.position = 50
      playerPaddle.hue = 30
      playerPaddle.light = 100

      socket.off("pre-game")
      socket.on("game start", (data: player[]) => {
        console.log(data[0].color, data[1].color)
        if (data[1 - selfIndex].color !== "white") {
          opponentPaddle.light = 50
          opponentPaddle.hue = data[1 - selfIndex].color as number
        }
        setGameState(GameState.IN_GAME)
      })
    } else if (gameState === GameState.PREGAME_READY) {
      socket.emit("ready", playerPaddle.light === 100 ? "white" : playerPaddle.hue)
    } else if (gameState === GameState.IN_GAME) {
			console.log(selfIndex)
      socket.off("game start")
      socket.on("game update", (data: currentPositions) => {
        playerPaddle.position = data.paddles[selfIndex].position.y
        opponentPaddle.position = data.paddles[1 - selfIndex].position.y
        ball.x = !selfIndex ? data.ball.position.x : 100 - data.ball.position.x
        ball.y = data.ball.position.y
      })
      interval.current = setInterval(() => {
        // console.log(0)
        socket.emit("keys", keys.current)
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
          {gameState === GameState.PREQUEUE &&
            <PreQueueContent gameStateHook={[gameState, setGameState]} />
          }
          {gameState === GameState.IN_QUEUE &&
            <QueueContent gameStateHook={[gameState, setGameState]} />
          }
          {(gameState === GameState.PREGAME_NOT_READY || gameState === GameState.PREGAME_READY) &&
            <UserFrames opponent={opponent} />
          }
          <div id={"ball"} className={"ball" + (gameState <= GameState.PREGAME_READY ? " hidden" : "")}></div>
          <div id={"opponent"} className={"paddle right" + (gameState >= GameState.PREGAME_NOT_READY ? "" : " hidden")}></div>
          <div id={"player"} className={"paddle left" + ((gameState !== GameState.PREGAME_NOT_READY && gameState !== GameState.PREGAME_READY) ? "" : " not-ready") + (gameState === GameState.PREQUEUE ? " hidden" : "")}></div>

          {gameState >= GameState.IN_GAME && <Scoreboard selfIndex={selfIndex} />}
          <CustomizeButtons gameStateHook={[gameState, setGameState]} opponent={opponent} selfIndex={selfIndex} />

          {gameState === GameState.POST_GAME && <button onClick={() => {
            setGameState(GameState.PREQUEUE)
          }} className={"end-game-button"}>Main Menu</button>}
        </div>
      </div>
    </div>
  )
}

function PreQueueContent({ gameStateHook: [gameState, setGameState] }: PropsWithChildren<{ gameStateHook: [GameState, Function] }>) {
  const { user } = useContext(UserContext)
  const socket = useContext(SocketContext)
  const [queueDisable, setQueueDisable] = useState(true)

  useEffect(() => {
    if (user && socket.connected) {
      setQueueDisable(false)
    } else {
      setQueueDisable(true)
    }
  }, [user, socket.connected])
  
  return (
    <>
      <p className={"game-title game-center"}>PONG</p>
      <div className="prequeue-content">
        <button disabled={queueDisable} onClick={() => {
          setGameState(GameState.IN_QUEUE)
        }}
        >Join Queue</button>
      </div>
    </>
  )
}

function QueueContent({ gameStateHook: [gameState, setGameState] }: PropsWithChildren<{ gameStateHook: [GameState, Function] }>) {
  return (
    <div className="queue-content">
      <LoadIndicator />
      <div className="in-queue-buttons">
        <button className={"cancel-button" + (gameState !== GameState.IN_QUEUE ? " hidden" : "")} onClick={() => {
          setGameState(GameState.PREQUEUE)
        }}>Cancel</button>
      </div>
    </div>
  )
}

function UserFrames({ opponent }: PropsWithChildren<{ opponent: user }>) {
  const { user } = useContext(UserContext)

  return (
    <>
      {
        opponent &&
        <>
          <div className={"info user-info"}>
            <div className={"avatar"}>
              <img src={user?.avatar} alt="user avatar" />
            </div>
            <div className={"body"}>
              <p>
                {user.displayName ? user.displayName.toUpperCase() : user.username.toUpperCase()}
              </p>
            </div>
          </div>
          <div className={"info opponent-info"}>
            <div className={"body"}>
              <p>
                {opponent.displayName ? opponent.displayName.toUpperCase() : opponent.username.toUpperCase()}
              </p>
            </div>
            <div className={"avatar"}>
              <img src={opponent?.avatar} alt="opponent avatar" />
            </div>
          </div>
        </>
      }
    </>
  )
}

function CustomizeButtons({ gameStateHook: [gameState, setGameState], opponent, selfIndex }: PropsWithChildren<{ gameStateHook: [GameState, Function], opponent: user, selfIndex: number }>) {

  return (
    <>
      {gameState === GameState.PREGAME_READY && <p className={"ready-state"}>Waiting for opponent...</p>}
      {gameState === GameState.PREGAME_NOT_READY &&
        <>
          <div className={"ready-state"}>
            <button
              disabled={!opponent || selfIndex === null}
              onClick={() => {
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

function Scoreboard({ selfIndex }: PropsWithChildren<{ selfIndex: number }>) {
  const [score, setScore] = useState([0, 0])
  const socket = useContext(SocketContext)

  useEffect(() => {
    socket.on("game score", (data: number[]) => {
      setScore(data)
    })
    return (() => {
      socket.off("game score")
    })
  }, [])

  return (
    <div className="scoreboard">{score[selfIndex]} | {score[1 - selfIndex]}</div>
  )
}