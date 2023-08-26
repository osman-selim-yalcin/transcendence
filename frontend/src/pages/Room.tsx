import { useContext, useEffect, useRef, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext"
import { createMsg } from "../api/room"
import { UserContext } from "../context/context"
import { typeMsg } from "../types"

export default function Room(props: any) {
  const socket = useContext(WebsocketContext)
  const { user } = useContext(UserContext)
  const [send, setSend] = useState("")
  const chatSliderRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
	chatSliderRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [props.messages[props.messages.length - 1]])

  const handle = (msg: string) => {
    if (msg === "") return
    createMsg(msg, user.username, props.roomID)

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
          <p>{props.friend.username} / {props.friend.status}</p>
        </div>
      </div>
      <div className="chat_rooms_room_messages">
        {props.messages?.map((message: typeMsg, index: any) => {
          return (
            <div key={index} className="chat_rooms_room_messages_msg">
              {message.owner}
              <div
                className="chat_rooms_room_messages_msg_content"
                ref={chatSliderRef}
              >
                {message.content}
              </div>
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
