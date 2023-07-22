import { useContext, useEffect } from "react"
import { WebsocketContext } from "../context/WebsocketContext"
import "../game/index.css"
// import { game_start } from "../game/index.js"

export const appendScript = (scriptToAppend: string) => {
  const script = document.createElement("script")
  script.src = scriptToAppend
  document.body.appendChild(script)
  return script
}

export default function Game() {
  const socket = useContext(WebsocketContext)

  useEffect(() => {
    const script1 = appendScript("/src/game/listener.js")
    const script2 = appendScript("/src/game/utils.js")
    const script3 = appendScript("/src/game/classes.js")
    const script4 = appendScript("/src/game/index.js")
    socket.on("connect", () => {
      console.log("connected")
    })
    socket.on("onMessage", data => {
      console.log("data came", data)
    })
    return () => {
      document.body.removeChild(script1)
      document.body.removeChild(script2)
      document.body.removeChild(script3)
      document.body.removeChild(script4)
      console.log("unmounting")
      socket.off("connect")
      socket.off("onMessage")
    }
  }, [])
  // console.log("here", game_start)

  return (
    <div>
      {/* <button onClick={game_start}>start Game</button> */}
      Game
      <div className="game_body">
        <div id="score" style={{ color: "aliceblue" }}></div>
        <canvas></canvas>
        {/* <script src="./game/listener.js"></script>
        <script src="./game/utils.js"></script>
        <script src="./game/classes.js"></script>
        <script src="./game/index.js"></script> */}
      </div>
    </div>
  )
}
