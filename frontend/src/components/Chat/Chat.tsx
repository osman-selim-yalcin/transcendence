import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../../context/UserContext"
import Room from "../Room"
import List from "../List"
import "./Chat.scss"
import { room, user, message } from "../../types"
import { sendMessage } from "../../api/room"

export function Chat() {
  const [currentRoomID, setCurrentRoomID] = useState<number>(null)

  useEffect(() => {
    console.log(currentRoomID)
  }, [currentRoomID])
  return (
    <>
      <h1>Chat</h1>
      <div className="chat">
        <Chatbar setCurrentRoomID={setCurrentRoomID}/>
        <ChatContent currentRoomID={currentRoomID}/>
      </div>
    </>
  )
}

// CHATBAR MESSAGES

function Chatbar({ setCurrentRoomID }: { setCurrentRoomID: Function }) {
  const { userRooms }: { userRooms: room[] | null } = useContext(UserContext)



  return (
    <div className="chatbar">
      <h2>Chatbar</h2>
      <ul className="noselect">
      {userRooms && userRooms.map((room: room) => {
        // if (room.messages.length)
          return (
          <li key={room.id}
            className="chat-index"
            onClick={() => {setCurrentRoomID(room.id)}}>
            <MessageIndex room={room}/>
          </li>
          )
        // else
        //   return null
      })}
      </ul>
    </div>
  )
}

function MessageIndex({ room }: { room: room }) {
  if (!room.isGroup) {
    return (
      <div className="message-index">
      {room.users[0].username} - {room.users[1]?.username}
    </div>
  )
} else {
  return (
    <div className="message-index">
      {room.name}: {room.users.map((user: user) => (user.username)
      ).join(", ")}
    </div>
  )
}
}

// CHATBAR MESSAGES

function ChatContent({ currentRoomID }: {currentRoomID: number}) {

  const [currentRoom, setCurrentRoom] = useState<room>(null)
  const { user, userRooms } = useContext(UserContext)
  const scrollRef = useRef(null)

  useEffect(() => {
    const room = userRooms?.find((room: room) => room.id === currentRoomID)
    // console.log(room)
    setCurrentRoom(room)
  }, [currentRoomID, userRooms])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "instant", block: "end" })
  }, [currentRoom])

  return (
    <div className="chat-content">
    {currentRoom ?
      <>
      <h2>Chat Content</h2>
      <ul className={"message-list"}>
      {currentRoom.messages.map((message: message, index: number) => (
        <li className={user.username === message.owner ? "main-user" : ""} key={message.id} ref={index === currentRoom.messages.length - 1 ? scrollRef : null}>
          <b>{message.owner}</b>
          <p>{message.content}</p>
        </li>
      ))}
      </ul>
      <ChatForm currentRoomID={currentRoomID}/>
      </>
      :
      <p>Send and receive messages without keeping your phone online.</p>
    }
    </div>
  )
}

function ChatForm({ currentRoomID }: { currentRoomID: number }) {
  const [input, setInput] = useState("")
  const { reloadUserRooms } = useContext(UserContext)

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      if (input !== "") {
        await sendMessage({ content: input, roomID: currentRoomID })
        setTimeout(() => {
          reloadUserRooms()
        }, 300);
        setInput("")
      }
    }}>

    <input type="text" value={input} onChange={(e) => {
      setInput(e.target.value)
    }}/>
    <button>Send</button>
    </form>
  )
}











// -----------------------REFACTOR------------------------
export function DeprecatedChat() {
  const show = false
  const [rooms, setRooms] = useState([])
  const [allRooms, setAllRooms] = useState([])
  const { user } = useContext(UserContext)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [tmp, setTmp] = useState([])


  useEffect(() => {
    // socket.on("user disconnected", id => {
    //   console.log("user disconnected")
    //   console.log(id)
    // })

    // socket.on("private message", ({ content, from, to }) => {
    //   console.log("allroms --->", allRooms, "to -->", to)
    //   const room = allRooms.find(item => item.room.roomID === to)
    //   if (room) {
    //     room.messages.push({
    //       content,
    //       owner: from,
    //       createdAt: new Date().toLocaleString("tr-TR", {
    //         timeZone: "Europe/Istanbul"
    //       })
    //     })
    //   }
    //   setAllRooms([...allRooms])
    // })

    return () => {
      // socket.off("user connected")
      // socket.off("private message")
      // socket.off("user disconnected")
    }
  }, [tmp])

  const handleStartRoom = async (item: any, users: any) => {
    if (
      rooms.find((room) => room.roomID === item.roomID) ||
      !item.roomID
    )
      return

    const sessionIDs = users.map((item: any) => item.sessionID)

    // socket.emit("join room", {
    //   room: item.roomID,
    //   clients: [...sessionIDs]
    // })

    if (rooms.length >= 3) rooms.shift()

    rooms.push({ roomID: item.roomID, avatar: item.avatar, name: item.name })
    setRooms([...rooms])
  }

  const handleModal = () => {
    dialogRef.current?.showModal()
  }

  const closeRoom = (roomID: number) => {
    if (rooms.length === 1) {
      setRooms([])
      return
    }
    for (let i = 0; i < rooms.length; ++i) {
      if (rooms[i].roomID === roomID) {
        rooms.splice(i, 1)
        setRooms([...rooms])
        break
      }
    }
  }

  const buttons = [
    {
      name: "...",
      action: (event: any) => {
        alert("bi dur abi yapacaz")
        event.stopPropagation()
      }
    }
  ]

  return (
    <div className="chat ">
      <div className="chat_rooms">
        {rooms?.map((room: any, index: number) => {
          return (
            <Room
              key={index}
              roomID={room.roomID}
              avatar={room.avatar}
              name={room.name}
              messages={
                allRooms.find(item => item.room.roomID === room.roomID)
                  ?.messages
              }
              closeRoom={closeRoom}
            />
          )
        })}
      </div>
      <div className="chat_div" hidden={show}>
        <div className="chat_div_search">
          {user.username} - {user.sessionID}
          <button onClick={handleModal}>Open Modal</button>
        </div>
        <div className="list">
          {allRooms.map((item: any, index: number) => (
            <List
              key={index}
              avatar={item.room.avatar}
              name={item.room.name}
              messages={item.messages}
              mainButton={() => handleStartRoom(item.room, item.users)}
              buttons={buttons}
            />
          ))}
        </div>
      </div>
      {/* <Modal
        dialogRef={dialogRef}
        allRooms={allRooms}
        setAllRooms={setAllRooms}
        setTmp={setTmp}
        handleStartRoom={handleStartRoom}
      ></Modal> */}
    </div>
  )
}
