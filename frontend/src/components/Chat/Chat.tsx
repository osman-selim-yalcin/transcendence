import { PropsWithChildren, useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../../context/UserContext"
import Room from "../Room"
import List from "../List"
import "./Chat.scss"
import { room, user, message, RoomRank, ContextMenuContentType } from "../../types"
import { leaveRoom, sendMessage } from "../../api/room"
import LoadIndicator from "../LoadIndicator/LoadIndicator"
import { useNavigate, useParams } from "react-router-dom"
import { ContextMenuContext } from "../../context/ContextMenuContext"

export function Chat() {
  const [showDetail, setShowDetail] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<room>(null)
  const { userRooms } = useContext(UserContext)
  const { id } = useParams()

  useEffect(() => {
    if (userRooms) {
      const room = userRooms.find((room: room) => room.id === parseInt(id))
      setCurrentRoom(room)
    }
  }, [id, userRooms])

  return (
    <>
      <div className={"chat"}>
        <Chatbar setCurrentRoom={[currentRoom, setCurrentRoom]} />
        <ChatContent showDetailState={[showDetail, setShowDetail]} currentRoom={currentRoom} />
        <ChatDetails showDetailState={[showDetail, setShowDetail]} currentRoom={currentRoom} />
      </div>
    </>
  )
}

// CHATBAR MESSAGES

function Chatbar({ setCurrentRoom: [currentRoom, setCurrentRoom] }: { setCurrentRoom: [room, Function] }) {
  const { userRooms }: { userRooms: room[] | null } = useContext(UserContext)
  const navigate = useNavigate()

  return (
    <div className="chatbar">
      <h2>Chatbar</h2>
      <ul className="noselect">
        {userRooms && userRooms.map((room: room) => {
          // if (room.messages.length)
          return (
            <li key={room.id}
              className={"chat-index" + (room.id === currentRoom?.id ? " active" : "")}
              onClick={(e) => {
                navigate(`/chat/${room.id}`)
              }}>
              <MessageIndex room={room} />
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
  const [lastMessage, setLastMessage] = useState(null)
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (room.messages.length) {//no message comes from createRoom response
      setLastMessage(room.messages[room.messages.length - 1].content)
    }
  }, [room])

  function getRoomName(room: room) {
    if (room.isGroup) {
      return room.name
    }
    return room.users[0].id === user.id ? room.users[1].username : room.users[0].username
  }

  return (
    <>
      <div className="chat-avatar-frame">
        <div className="chat-avatar">
          <img src={room.avatar} alt="room avatar" />
        </div>
      </div>
      <div className="chat-name">
        <b>
          {getRoomName(room)}
        </b>
        <p>
          {lastMessage}
        </p>
      </div>
    </>
  )
}

// CHATBAR MESSAGES
// CHAT CONTENT

function ChatContent({ 
  showDetailState: [showDetail, setShowDetail], 
  currentRoom 
  }: { showDetailState: [boolean, Function], currentRoom: room }) {

  const { user } = useContext(UserContext)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "instant", block: "end" })
    inputRef.current?.focus()
  }, [currentRoom])

  return (
    <div className={"chat-content" + (showDetail ? " shrink" : "")}>
      <div className="chat-content-header">
        <h2>Chat Content</h2>
        <button 
        disabled={currentRoom ? false : true}
        onClick={() => { setShowDetail(!showDetail) }}
        >&#8942;</button>
      </div>
      {currentRoom ?
        <>
          <ul className={"message-list"}>
            {currentRoom.messages.map((message: message, index: number) => (
              <li className={user.username === message.owner ? "main-user" : ""} key={message.id} ref={index === currentRoom.messages.length - 1 ? scrollRef : null}>
                <p>{message.content}</p>
              </li>
            ))}
          </ul>
          <ChatForm currentRoomID={currentRoom.id} inputRef={inputRef} />
        </>
        :
        <div id={"placeholder"}>
          <p>Send and receive messages without keeping your phone online.</p>
        </div>
      }
    </div>
  )
}

function ChatForm({ currentRoomID, inputRef }: { currentRoomID: number, inputRef: any }) {
  const [input, setInput] = useState("")

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      if (input !== "") {
        await sendMessage({ content: input, id: currentRoomID })
        setInput("")
      }
    }}>
      <input type="text" value={input} ref={inputRef} onChange={(e) => {
        setInput(e.target.value)
      }} />
      <button>Send</button>
    </form>
  )
}
// CHAT CONTENT
// CHAT DETAILS

function ChatDetails({ showDetailState: [showDetail, setShowDetail], currentRoom }: { showDetailState: [boolean, Function], currentRoom: room }) {
  const [rank, setRank] = useState<RoomRank>(null)
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (currentRoom) {
      if (currentRoom.creator === user.username) {
        setRank(RoomRank.CREATOR)
      } else if (currentRoom.mods.find((modName) => (modName === user.username)) !== undefined) {
        setRank(RoomRank.MODERATOR)
      } else {
        setRank(RoomRank.MEMBER)
      }
    }
  }, [currentRoom])

  return (
    <div className={"chat-details" + (showDetail ? " active" : "")}>
      <h2>Chat Details</h2>
      {currentRoom ?
        <>
          <div className="img-container">
            <img src={currentRoom?.avatar} alt="chat avatar" />
            {/*change detail avatar to friend avatar for isGroup false */}
          </div>
          <DetailHeader currentRoom={currentRoom} />
          <DetailContent currentRoom={currentRoom} userRank={rank} />
        </>
        :
        <LoadIndicator />
      }
    </div>
  )
}

function DetailHeader({ currentRoom }: { currentRoom: room }) {
  if (!currentRoom) return null
  if (currentRoom.isGroup) {
    return (
      <>
        <h3>{currentRoom.name}</h3>
        <p>Group &#8729; {currentRoom.users.length} participant{currentRoom.users.length > 1 && "s"}</p>
      </>
    )
  } else {
    // private chat detail
  }
}

function DetailContent({ currentRoom, userRank }: { currentRoom: room, userRank: RoomRank }) {
  const { user, reloadUserRooms } = useContext(UserContext)
  const { openContextMenu } = useContext(ContextMenuContext)  

  function getRank(user: user) {
    if (user.username === currentRoom.creator) {
      return RoomRank.CREATOR
    } else if (currentRoom.mods.find((username) => username === user.username) !== undefined) {
      return RoomRank.MODERATOR
    } else {
      return RoomRank.MEMBER
    }
  }

  function getRankBadge(rank: RoomRank) {
    if (rank === RoomRank.CREATOR) {
      return <span>&#9818;</span>
    } else if (rank === RoomRank.MODERATOR) {
      return <span>&#9819;</span>
    } else {
      return null
    }
  }


  if (!currentRoom) return null
  if (currentRoom.isGroup) {
    return (
      <div className="chat-detail-body">
        <ul className={"chat-detail-ul"}>
          {currentRoom.users.map((singleUser: user) => (
            <li onContextMenu={(e) => {
              e.preventDefault()
              openContextMenu(e.clientX, e.clientY, 
                              ContextMenuContentType.ROOM_DETAIL_USER, 
                              { clickedUser: singleUser, canBeControlled: getRank(singleUser) > getRank(user) })
              // setMenuData({ position: { top: 0, left: 0 }, clickedUser: singleUser, canBeControlled: getRank(singleUser) > getRank(user) })
            }} key={singleUser.id}>
              <img src={singleUser.avatar} alt={"user avatar"} />
              <p>{getRankBadge(getRank(singleUser))} {singleUser.username} {singleUser.id === user.id && "(You)"}</p>
            </li>
          ))}
        </ul>
        <button onClick={async () => {
          await leaveRoom({ id: currentRoom.id, 
            name: currentRoom.name,
            users: [],
            isGroup: true })
          setTimeout(() => { // to be changed
            reloadUserRooms()
          }, 1000);
        }} >Exit Group</button>
        {/* <NonModal isActive={[contextMenu, setContextMenu]} dialogPosition={menuData?.position}>
          <ContextMenuButtons clickedUser={menuData?.clickedUser} canBeControlled={menuData?.canBeControlled} />
        </NonModal> */}
      </div>
    )
  } else {

  }
}

export function ContextMenuButtons({ clickedUser, canBeControlled }: PropsWithChildren<{ clickedUser: user, canBeControlled: boolean }>) {
return (
  <div className={"admin-buttons" + (!canBeControlled && " hidden")}>
    <button title="wow">Promote/Demote</button>
    <button>Kick</button>
    <button>Ban</button>
  </div>
) 
}

// CHAT DETAILS
















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
