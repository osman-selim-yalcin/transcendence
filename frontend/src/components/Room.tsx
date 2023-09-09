import { useContext, useEffect, useRef, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext"
import { createMsg, deleteRoom } from "../api/room"
import { UserContext } from "../context/context"
import { typeMsg } from "../types"
import { getTime } from "../functions"

export default function Room(props: any) {
  const socket = useContext(WebsocketContext)
  const { user } = useContext(UserContext)
  const [send, setSend] = useState("")
  const [minimize, setMinimize] = useState(false)
  const roomRef = useRef(null)
  const roomMessageRef = useRef(null)
  const roomInputRef = useRef(null)
  const chatSliderRef = useRef(null)
  const inputRef = useRef(null)

useEffect(() => {
  console.log("roomID", props.roomID)

}, [])


  useEffect(() => {
    inputRef.current?.focus()
    chatSliderRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [props.messages?.[props.messages.length - 1]])

  const handle = (msg: string) => {
    console.log(msg)
    console.log(props.roomID)
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

  function minimizer() {
    if (minimize) {
      roomRef.current.style.height = "300px"
      setMinimize(false)
      roomMessageRef.current.classList.remove("hidden")
      roomInputRef.current.classList.remove("hidden")
      setTimeout(() => {
        chatSliderRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end"
        })
      }, 500)
      inputRef.current.focus()
    } else {
      roomRef.current.style.height = "50px"
      setMinimize(true)
      roomMessageRef.current.classList.add("hidden")
      roomInputRef.current.classList.add("hidden")
    }
  }

  const handleCloseRoom = () => {
    deleteRoom(props.roomID)
  }

  return (
    <div className="chat_rooms_room" ref={roomRef}>
      <div className="chat_rooms_room_header">
        <div className="chat_rooms_room_header_avatar">
          <img src={props.avatar} alt="avatar" />
        </div>
        <div className="chat_rooms_room_header_info">
          <p>{props.name}</p>
        </div>
        <div className="chat_rooms_room_header_buttons">
          <div
            className="chat_rooms_room_header_buttons_button noselect"
            onClick={minimizer}
          >
            _
          </div>
          <div
            className="chat_rooms_room_header_buttons_button noselect"
            onClick={() => {
              props.closeRoom(props.roomID)
            }}
          >
            X
          </div>
        </div>
      </div>
      <div className="chat_rooms_room_messages" ref={roomMessageRef}>
        {props.messages?.map((message: typeMsg, index: any) => {
          return (
            <div key={index} className="chat_rooms_room_messages_msg">
              {message.owner} {getTime(message.createdAt)}
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
        ref={roomInputRef}
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
