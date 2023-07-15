import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext"

export default function Chat() {
  const socket = useContext(WebsocketContext)
  const [send, setSend] = useState("")
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected")
    })
    socket.on("onMessage", data => {
      console.log("data came", data)
      console.log("messages", messages)
      setMessages(messages => [data, ...messages])
    })
    return () => {
      console.log("unmounting")
      socket.off("connect")
      socket.off("onMessage")
    }
  }, [])

  const handle = () => {
    console.log("gere")
    socket.emit("message", send)
    setSend("")
  }

  return (
    <div>
      Chat
      <input type="text" value={send} onChange={e => setSend(e.target.value)} />
      <button onClick={handle}> send msg</button>
      {messages.map((message, index) => {
        return <div key={index}>{message}</div>
      })}
    </div>
  )
}
