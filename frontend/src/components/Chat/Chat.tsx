import { PropsWithChildren, useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../../context/UserContext"
import "./Chat.scss"
import { room, user, message, RoomRank, ContextMenuContentType, ContextContent, UserListType, MutedUser, userStatus } from "../../types"
import { banUser, changeMod, changeMute, kickUser, leaveRoom, sendMessage } from "../../api/room"
import LoadIndicator from "../LoadIndicator/LoadIndicator"
import { useNavigate, useParams } from "react-router-dom"
import { ContextMenuContext } from "../../context/ContextMenuContext"
import { Modal } from "../Modal/Modal"
import UserList from "../UserList/UserList"
import { changeBlock } from "../../api/user"
import { sendGameInvite } from "../../api/game"

export function Chat() {
  const [showDetail, setShowDetail] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<room>(null)
  const { userRooms } = useContext(UserContext)
  const { id } = useParams()

  useEffect(() => {
    if (userRooms) {
      const room = userRooms.find((room: room) => room.id === parseInt(id))
      if (room === undefined) {
        setShowDetail(false)
      }
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
  const [modal, setModal] = useState(false)

  return (
    <div className="chatbar">
      <div className={"chatbar-header"}>
        <h2>Chatbar</h2>
        <button onClick={() => {
          setModal(true)
        }}>New</button>
      </div>
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
      <Modal isActive={[modal, setModal]} removable={true}>
        <UserList userListType={UserListType.NEW_MESSAGE} setModal={setModal} />
      </Modal>
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
    return room.users[0].id === user.id ? (room.users[1].displayName || room.users[1].username) : (room.users[0].displayName || room.users[0].username)
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
    scrollRef.current?.scrollIntoView({ behavior: "instant", block: "start" })
    inputRef.current?.focus()
  }, [currentRoom])

  return (
    <div className={"chat-content" + (showDetail ? " shrink" : "")}>
      <div className="chat-content-header">
        <h2>Chat Content</h2>
        <button
          className={currentRoom ? "" : "hidden"}
          onClick={() => { setShowDetail(!showDetail) }}
        >&#8942;</button>
      </div>
      {currentRoom ?
        <>
          {!currentRoom.isGroup && currentRoom.users.find((singleUser) => (user.id !== singleUser.id)).status === userStatus.BLOCKED ?
            <div className="placeholder">
              <p>Your chat is restricted with this user by a block</p>
            </div>
            :
            <>
              <ul className={"message-list"}>
                {currentRoom.messages.map((message: message, index: number) => (
                  <li className={user.username === message.owner ? "main-user" : (message.owner === currentRoom.id.toString() ? "room-announcement" : "")} key={message.id} ref={index === currentRoom.messages.length - 1 ? scrollRef : null}>
                    <p>{message.content}</p>
                  </li>
                ))}
              </ul>
              <ChatForm currentRoomID={currentRoom.id} roomMuteList={currentRoom.muteList} inputRef={inputRef} />
            </>
          }
        </>
        :
        <div className={"placeholder"}>
          <p>Send and receive messages without keeping your phone online.</p>
        </div>
      }
    </div>
  )
}

function ChatForm({ currentRoomID, roomMuteList, inputRef }: PropsWithChildren<{ currentRoomID: number, roomMuteList: MutedUser[], inputRef: any }>) {
  const [input, setInput] = useState("")
  const [muted, setMuted] = useState(false)
  const { user } = useContext(UserContext)


  useEffect(() => {
    const found = roomMuteList?.find((muted) => (muted.username === user.username))
    if (found !== undefined) {
      setMuted(true)
    } else {
      setMuted(false)
    }
  }, [currentRoomID])

  if (muted) {
    return (
      <div className="muted">
        <p>You have been muted in this channel</p>
      </div>
    )
  } else {
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
}
// CHAT CONTENT
// CHAT DETAILS

function ChatDetails({ showDetailState: [showDetail, setShowDetail], currentRoom }: { showDetailState: [boolean, Function], currentRoom: room }) {

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
          <DetailContent currentRoom={currentRoom} setShowDetail={setShowDetail} />
        </>
        :
        <LoadIndicator />
      }
    </div>
  )
}

function DetailHeader({ currentRoom }: { currentRoom: room }) {
  const { user } = useContext(UserContext)
  if (!currentRoom) return null
  if (currentRoom.isGroup) {
    return (
      <div className={"room-header"}>
        <h3 className={"room-name"}>{currentRoom.name}</h3>
        <p>Group &#8729; {currentRoom.users.length} participant{currentRoom.users.length > 1 && "s"}</p>
      </div>
    )
  } else {
    const found = currentRoom.users.find((singleUser) => (user.id !== singleUser.id))
    return (
      <div className={"room-header"}>
        <h3 className={"room-name"}>{found.displayName ? found.displayName.toUpperCase() : found.username.toUpperCase()}</h3>
        <p>Private Chat</p>
      </div>
    )
  }
}

function DetailContent({ currentRoom, setShowDetail }: { currentRoom: room, setShowDetail: Function }) {
  const { user } = useContext(UserContext)
  const { openContextMenu } = useContext(ContextMenuContext)
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)

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
                { clickedUser: singleUser, clickedUserRank: getRank(singleUser), currentRoomId: currentRoom.id, currentRoomCreator: currentRoom.creator, canBeControlled: getRank(singleUser) < getRank(user) })
            }} key={singleUser.id}>
              <img src={singleUser.avatar} alt={"user avatar"} />
              <p>{getRankBadge(getRank(singleUser))} {singleUser.displayName || singleUser.username} {singleUser.id === user.id && "(You)"} {currentRoom.muteList.find((muted) => (muted.username === singleUser.username)) && <>&#128263;</>} {singleUser.status === userStatus.BLOCKED && <>&#9888;</>}</p>
            </li>
          ))}
        </ul>
        {getRank(user) > RoomRank.MEMBER &&
          <button onClick={() => {
            setModal(true)
          }}>
            Invite
          </button>}
        <button onClick={async () => {
          await leaveRoom({
            id: currentRoom.id,
            name: currentRoom.name,
            users: [],
            isGroup: true
          })
          navigate("/chat")
          setShowDetail(false)
        }} >Exit Group</button>
        <Modal isActive={[modal, setModal]} removable={true}>
          <UserList userListType={UserListType.INVITE_USER} room={currentRoom} />
        </Modal>
      </div>
    )
  } else {
    const found = currentRoom.users.find((singleUser) => (user.id !== singleUser.id))
    return (
      <>
        <button onClick={() => {
          navigate(`/profile/${found.username}`)
        }}>Profile</button>
        <button onClick={async () => {
          sendGameInvite({ id: found.id })
        }}>
          Game Invite
        </button>
        <button onClick={async () => {
          await changeBlock({ id: found.id })
        }}>Block</button>
      </>
    )
  }
}

export function ContextMenuButtons({ clickedUser, clickedUserRank, currentRoomId, currentRoomCreator, canBeControlled }: PropsWithChildren<ContextContent>) {
  const { closeContextMenu } = useContext(ContextMenuContext)
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  return (
    <>
      <div className={"admin-buttons"}
        onClick={(e) => {
          e.stopPropagation()
          closeContextMenu()
        }}>
        <button onClick={() => {
          navigate(`/profile/${clickedUser.username}`)
        }}>Profile</button>
        <button className={(user.id === clickedUser.id ? "hidden" : "")} onClick={async () => {
          await sendGameInvite({ id: clickedUser.id })
        }}>Game Invite</button>
        {user.username === currentRoomCreator &&
          <button className={(!canBeControlled ? " hidden" : "")} onClick={async () => {
            await changeMod({ id: currentRoomId, user: { id: clickedUser.id } })
          }}
          >{clickedUserRank === RoomRank.MEMBER ? "Promote" : "Demote"}</button>
        }
        <button className={(!canBeControlled ? " hidden" : "")} onClick={async () => {
          console.log("room id:", currentRoomId, "clicked user id:", clickedUser.id)
          await kickUser({ id: currentRoomId, user: { id: clickedUser.id } })
        }}
        >Kick</button>
        <button className={(!canBeControlled ? " hidden" : "")} onClick={async () => {
          await changeMute({ id: currentRoomId, user: { id: clickedUser.id } })
        }}>Mute</button>
        <button className={(!canBeControlled ? " hidden" : "")} onClick={async () => {
          await banUser({ id: currentRoomId, user: { id: clickedUser.id } })
        }}>Ban</button>
        <button className={(user.id === clickedUser.id ? "hidden" : "")} onClick={async () => {
          await changeBlock({ id: clickedUser.id })
        }}>{clickedUser.status === userStatus.BLOCKED ? <>Unblock</> : <>Block</>}</button>
      </div>
    </>
  )
}

// CHAT DETAILS





