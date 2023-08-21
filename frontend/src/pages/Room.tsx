import { useContext, useEffect, useRef, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext"
import { findChat } from "../api/chat"

type msg = {
  content: string
  fromSelf: boolean
}

export default function Room(props: any) {
  const socket = useContext(WebsocketContext)
  const [send, setSend] = useState("")
  const chatSliderRef = useRef(null);
  const inputRef = useRef(null);

	useEffect(() => {
		if (chatSliderRef.current) {
			// @ts-ignore: Object is possibly 'null'.
			chatSliderRef.current.scrollIntoView({ behavior: 'smooth', block: "end" });
		}
	});
	
	
	const handle = (msg: string) => {
		props.onMessage(msg)
		setSend("")
	// @ts-ignore: Object is possibly 'null'.
	inputRef.current.focus();

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
              <p key={index} className="chat_room_messages_msg" ref={chatSliderRef}>
                {message.content}
              </p>
            </div>
          )
        })}
      </div>
		<form className="chat_room_input" onSubmit={(e) => {e.preventDefault();handle(send)}}>
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
