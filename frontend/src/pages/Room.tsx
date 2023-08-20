import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext"
import { findChat } from "../api/chat"

type msg = {
  content: string
  fromSelf: boolean
}

export default function Room(props: any) {
  const socket = useContext(WebsocketContext)
  const [send, setSend] = useState("")

  const handle = (msg: string) => {
    props.onMessage(msg)
    setSend("")
  }

  const displaySender = (message: msg, index: any) => {
    return (
      index === 0 ||
      props.user.messages[index - 1].fromSelf !==
        props.user.messages[index].fromSelf
    )
  }

  return (
    <div className="chat_room">
      <div className="chat_room_messages">
        {props.user?.messages?.map((message: msg, index: any) => {
          return (
            <div key={index}>
              {displaySender(message, index) && (
                <div>
                  {message.fromSelf ? "(yourself)" : props.user.username}
                </div>
              )}
              <p key={index} className="chat_room_messages_msg">
                {message.content}
              </p>
            </div>
          )
        })}
      </div>
      <div className="chat_room_input">
        <input
          type="text"
          value={send}
          onChange={e => setSend(e.target.value)}
        />
        <button onClick={() => handle(send)}>send</button>
      </div>
    </div>
  )
}
