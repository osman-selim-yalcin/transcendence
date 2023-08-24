import { useContext, useEffect, useRef, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext"
import { createMsg, findRoom } from "../api/room"
import { UserContext } from "../context/context"
import { typeMsg } from "../types"

export default function Room(props: any) {
  const socket = useContext(WebsocketContext)
  const { user } = useContext(UserContext)
  const [send, setSend] = useState("")
  const [messages, setMessages] = useState<typeMsg[]>([])
  const chatSliderRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (props.roomID) {
      findRoom(props.roomID, setMessages)
    }

    socket.on("private message", ({ content, from }) => {
      console.log("private message")
      setMessages(messages => [...messages, { content, owner: from }])
    })

    return () => {
      socket.off("private message")
    }
  }, [])

  if (chatSliderRef.current) {
    chatSliderRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  const handle = (msg: string) => {
    if (msg === "") return
    createMsg(msg, user.username, props.roomID)

    console.log("create msg done")
    socket.emit("private message", {
      content: msg,
      to: props.roomID,
      from: user.username
    })

    setSend("")

    inputRef.current.focus()
  }

  return (
    <div className="chat_rooms_room">
      <div className="chat_rooms_room_header">
        {/* <div className="chat_rooms_room_header_avatar">
          <img src={props.friend.avatar} alt="avatar" />
        </div> */}
        <div className="chat_rooms_room_header_info">
          <p>{props.friend.username}</p>
          {/* <p>{props.friend.status}</p> */}
        </div>
      </div>
      <div className="chat_rooms_room_messages">
        {messages?.map((message: typeMsg, index: any) => {
          return (
            <div key={index}>
              <p>{message.owner}</p>
              <p
                key={index}
                className="chat_rooms_room_messages_msg"
                ref={chatSliderRef}
              >
                {message.content}
              </p>
            </div>
          )
        })}
      </div>
      <form
        className="chat_rooms_room_input"
        onSubmit={e => {
          e.preventDefault()
          handle(send)
        }}
      >
        <input
          type="text"
          value={send}
          onChange={e => setSend(e.target.value)}
          ref={inputRef}
        />
        <button>send</button>
      </form>
    </div>
  )
}
