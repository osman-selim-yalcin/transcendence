import {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { sendGameInvite } from "../../api/game"
import {
  banUser,
  changeMod,
  changeMute,
  kickUser,
  leaveRoom,
  sendMessage
} from "../../api/room"
import { changeBlock } from "../../api/user"
import LoadIndicator from "../../components/LoadIndicator"
import UserList, {
  AddFriendIndexContent
} from "../../components/Sidebar/UserList"
import { UserContext } from "../../context/UserContext"
import {
  message,
  MutedUser,
  room,
  RoomRank,
  user,
  UserListType,
  userStatus
} from "../../types"
import "./Chat.scss"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material"

const getHourMinute = (date: string) => {
  const time = date.split("T")[1].split(":")
  return time[0] + ":" + time[1]
}

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
        <ChatContent
          showDetailState={[showDetail, setShowDetail]}
          currentRoom={currentRoom}
        />
        <ChatDetails
          showDetailState={[showDetail, setShowDetail]}
          currentRoom={currentRoom}
        />
      </div>
    </>
  )
}

// CHATBAR MESSAGES

function Chatbar({
  setCurrentRoom: [currentRoom, setCurrentRoom]
}: {
  setCurrentRoom: [room, Function]
}) {
  const { userRooms }: { userRooms: room[] | null } = useContext(UserContext)
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)

  useEffect(() => {
    console.log("change")
  }, [userRooms])

  return (
    <div className="chatbar">
      <div className={"chatbar-header"}>
        <h2>Chatbar</h2>
        <button
          onClick={() => {
            setModal(true)
          }}
        >
          New
        </button>
      </div>
      <ul className="noselect">
        {userRooms &&
          []
            .concat(userRooms)
            .sort((a: room, b: room) => {
              if (!a.messages.length) return 1
              else if (!b.messages.length) return -1
              return a.messages[a.messages.length - 1].createdAt >
                b.messages[b.messages.length - 1].createdAt
                ? -1
                : 1
            })
            .map((room: room) => {
              // if (room.messages.length)
              return (
                <li
                  key={room.id}
                  className={
                    "chat-index" +
                    (room.id === currentRoom?.id ? " active" : "")
                  }
                  onClick={e => {
                    navigate(`/chat/${room.id}`)
                  }}
                >
                  <MessageIndex room={room} />
                </li>
              )
              // else
              //   return null
            })}
      </ul>
      <Dialog
        open={modal}
        onClose={() => setModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>New message</DialogTitle>
        <DialogContent dividers>
          <UserList
            userListType={UserListType.NEW_MESSAGE}
            setModal={setModal}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

function MessageIndex({ room }: { room: room }) {
  const [lastMessage, setLastMessage] = useState<string>(null)
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (room.messages.length) {
      //no message comes from createRoom response
      setLastMessage(room.messages[room.messages.length - 1].content)
    }
  }, [room])

  function getRoomName(room: room) {
    if (room.isGroup) {
      return room.name
    }
    return room.users[0].id === user.id
      ? room.users[1].displayName || room.users[1].username
      : room.users[0].displayName || room.users[0].username
  }

  return (
    <>
      <div className="chat-avatar-frame">
        <div className="chat-avatar">
          <img
            src={
              room.isGroup
                ? room.avatar
                : room.users.find(singleUser => user.id !== singleUser.id)
                    .avatar
            }
            alt="room avatar"
          />
        </div>
      </div>
      <div className="chat-name">
        <b>{getRoomName(room)}</b>
        {lastMessage && (
          <p>
            {lastMessage.length > 15
              ? lastMessage.slice(0, 15) + "..."
              : lastMessage}
          </p>
        )}
      </div>
    </>
  )
}

// CHATBAR MESSAGES
// CHAT CONTENT

function ChatContent({
  showDetailState: [showDetail, setShowDetail],
  currentRoom
}: {
  showDetailState: [boolean, Function]
  currentRoom: room
}) {
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
          className={currentRoom ? "" : "hidden"}
          onClick={() => {
            setShowDetail(!showDetail)
          }}
        >
          &#8942;
        </button>
      </div>
      {currentRoom ? (
        <>
          {!currentRoom.isGroup &&
          currentRoom.users.find(singleUser => user.id !== singleUser.id)
            .status === userStatus.BLOCKED ? (
            <div className="placeholder">
              <p>Your chat is restricted with this user by a block</p>
            </div>
          ) : (
            <>
              <ul className={"message-list"}>
                {currentRoom.messages.map((message: message, index: number) => (
                  <li
                    className={
                      user.username === message.owner
                        ? "main-user"
                        : message.owner === currentRoom.id.toString()
                        ? "room-announcement"
                        : ""
                    }
                    key={message.id}
                    ref={
                      index === currentRoom.messages.length - 1
                        ? scrollRef
                        : null
                    }
                  >
                    <b>{message.owner}</b>
                    <div className={"message"}>
                      <p>{message.content}</p>
                      <i>{getHourMinute(message.createdAt)}</i>
                    </div>
                  </li>
                ))}
              </ul>
              <ChatForm
                currentRoomID={currentRoom.id}
                roomMuteList={currentRoom.muteList}
                inputRef={inputRef}
              />
            </>
          )}
        </>
      ) : (
        <div className={"placeholder"}>
          <p>Send and receive messages without keeping your phone online.</p>
        </div>
      )}
    </div>
  )
}

function ChatForm({
  currentRoomID,
  roomMuteList,
  inputRef
}: PropsWithChildren<{
  currentRoomID: number
  roomMuteList: MutedUser[]
  inputRef: any
}>) {
  const [input, setInput] = useState("")
  const [muted, setMuted] = useState(false)
  const { user } = useContext(UserContext)

  useEffect(() => {
    const found = roomMuteList?.find(muted => muted.username === user.username)
    if (found !== undefined) {
      setMuted(true)
    } else {
      setMuted(false)
    }
  }, [currentRoomID, roomMuteList])

  if (muted) {
    return (
      <div className="muted">
        <p>You have been muted in this channel</p>
      </div>
    )
  } else {
    return (
      <form
        onSubmit={async e => {
          e.preventDefault()
          if (input !== "") {
            await sendMessage({ content: input, id: currentRoomID })
            setInput("")
          }
        }}
      >
        <input
          type="text"
          value={input}
          ref={inputRef}
          onChange={e => {
            setInput(e.target.value)
          }}
        />
        <button>Send</button>
      </form>
    )
  }
}
// CHAT CONTENT
// CHAT DETAILS

function ChatDetails({
  showDetailState: [showDetail, setShowDetail],
  currentRoom
}: {
  showDetailState: [boolean, Function]
  currentRoom: room
}) {
  const { user } = useContext(UserContext)

  return (
    <div className={"chat-details" + (showDetail ? " active" : "")}>
      <h2>Chat Details</h2>
      {currentRoom ? (
        <>
          <div className="img-container">
            <img
              src={
                currentRoom.isGroup
                  ? currentRoom?.avatar
                  : currentRoom.users.find(
                      singleUser => user.id !== singleUser.id
                    ).avatar
              }
              alt="chat avatar"
            />
            {/*change detail avatar to friend avatar for isGroup false */}
          </div>
          <DetailHeader currentRoom={currentRoom} />
          <DetailContent
            currentRoom={currentRoom}
            setShowDetail={setShowDetail}
          />
        </>
      ) : (
        <LoadIndicator />
      )}
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
        <p>
          Group &#8729; {currentRoom.users.length} participant
          {currentRoom.users.length > 1 && "s"}
        </p>
      </div>
    )
  } else {
    const found = currentRoom.users.find(
      singleUser => user.id !== singleUser.id
    )
    return (
      <div className={"room-header"}>
        <h3 className={"room-name"}>
          {found.displayName
            ? found.displayName.toUpperCase()
            : found.username.toUpperCase()}
        </h3>
        <p>Private Chat</p>
      </div>
    )
  }
}

function DetailContent({
  currentRoom,
  setShowDetail
}: {
  currentRoom: room
  setShowDetail: Function
}) {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)

  // --- dropdown state (contextsiz) ---
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  })
  const [menuData, setMenuData] = useState<{
    clickedUser: user
    clickedUserRank: RoomRank
    currentRoomId: number
    currentRoomCreator: string
    canBeControlled: boolean
  } | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false)
    }
    if (menuOpen) {
      document.addEventListener("mousedown", onDocClick)
      document.addEventListener("keydown", onEsc)
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onEsc)
    }
  }, [menuOpen])
  // --- /dropdown state ---

  function getRank(u: user) {
    if (u.username === currentRoom.creator) return RoomRank.CREATOR
    if (
      currentRoom.mods.find(username => username === u.username) !== undefined
    )
      return RoomRank.MODERATOR
    return RoomRank.MEMBER
  }

  function getRankBadge(rank: RoomRank) {
    if (rank === RoomRank.CREATOR) return <span>&#9818;</span>
    if (rank === RoomRank.MODERATOR) return <span>&#9819;</span>
    return null
  }

  if (!currentRoom) return null

  if (currentRoom.isGroup) {
    return (
      <div className="chat-detail-body" style={{ position: "relative" }}>
        <ul className={"chat-detail-ul"}>
          {currentRoom.users.map((singleUser: user) => {
            const rank = getRank(singleUser)
            const canBeControlled = rank < getRank(user)
            return (
              <li
                key={singleUser.id}
                onContextMenu={e => {
                  e.preventDefault()
                  setMenuPos({ x: e.clientX, y: e.clientY })
                  setMenuData({
                    clickedUser: singleUser,
                    clickedUserRank: rank,
                    currentRoomId: currentRoom.id,
                    currentRoomCreator: currentRoom.creator,
                    canBeControlled
                  })
                  setMenuOpen(true)
                }}
              >
                <img src={singleUser.avatar} alt={"user avatar"} />
                <p>
                  {getRankBadge(rank)}{" "}
                  {singleUser.displayName || singleUser.username}{" "}
                  {singleUser.id === user.id && "(You)"}{" "}
                  {currentRoom.muteList.find(
                    m => m.username === singleUser.username
                  ) && <>&#128263;</>}{" "}
                  {singleUser.status === userStatus.BLOCKED && <>&#9888;</>}
                </p>
              </li>
            )
          })}
        </ul>

        {getRank(user) > RoomRank.MEMBER && (
          <button onClick={() => setModal(true)}>Invite</button>
        )}

        <button
          onClick={async () => {
            await leaveRoom({
              id: currentRoom.id,
              name: currentRoom.name,
              users: [],
              isGroup: true
            })
            navigate("/chat")
            setShowDetail(false)
          }}
        >
          Exit Group
        </button>

        <Dialog
          open={modal}
          onClose={() => setModal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Invite users</DialogTitle>
          <DialogContent dividers>
            <UserList
              userListType={UserListType.INVITE_USER}
              room={currentRoom}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModal(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* --- Dropdown (contextsiz) --- */}
        {menuOpen && menuData && (
          <div
            ref={menuRef}
            className="rounded-md border border-neutral-300 bg-white shadow-lg"
            style={{
              position: "fixed",
              top: menuPos.y + 6,
              left: menuPos.x + 6,
              zIndex: 9999,
              minWidth: 160
            }}
          >
            <ContextDropdown
              data={menuData}
              onClose={() => setMenuOpen(false)}
              navigate={navigate}
              selfUser={user}
            />
          </div>
        )}
      </div>
    )
  } else {
    const found = currentRoom.users.find(
      singleUser => user.id !== singleUser.id
    )
    return (
      <>
        <AddFriendIndexContent userId={found.id} />
        <br />
        <button onClick={() => navigate(`/profile/${found.username}`)}>
          Profile
        </button>
        <button
          onClick={async () => {
            sendGameInvite({ id: found.id })
          }}
        >
          Game Invite
        </button>
        <button
          onClick={async () => {
            await changeBlock({ id: found.id })
          }}
        >
          Block
        </button>
      </>
    )
  }
}

function ContextDropdown({
  data,
  onClose,
  navigate,
  selfUser
}: {
  data: {
    clickedUser: user
    clickedUserRank: RoomRank
    currentRoomId: number
    currentRoomCreator: string
    canBeControlled: boolean
  }
  onClose: () => void
  navigate: ReturnType<typeof useNavigate>
  selfUser: user
}) {
  const {
    clickedUser,
    clickedUserRank,
    currentRoomId,
    currentRoomCreator,
    canBeControlled
  } = data

  return (
    <div
      className="flex flex-col p-1 text-sm"
      onClick={e => {
        // dropdown içinde bubbling'i durdurma — buton click'leri işlesin
        e.stopPropagation()
      }}
    >
      <button
        className="px-3 py-2 text-left hover:bg-neutral-100 rounded"
        onClick={() => {
          navigate(`/profile/${clickedUser.username}`)
          onClose()
        }}
      >
        Profile
      </button>

      {selfUser.id !== clickedUser.id && (
        <button
          className="px-3 py-2 text-left hover:bg-neutral-100 rounded"
          onClick={async () => {
            await sendGameInvite({ id: clickedUser.id })
            onClose()
          }}
        >
          Game Invite
        </button>
      )}

      {selfUser.username === currentRoomCreator && (
        <button
          className={`px-3 py-2 text-left hover:bg-neutral-100 rounded ${
            !canBeControlled ? "hidden" : ""
          }`}
          onClick={async () => {
            await changeMod({ id: currentRoomId, user: { id: clickedUser.id } })
            onClose()
          }}
        >
          {clickedUserRank === RoomRank.MEMBER ? "Promote" : "Demote"}
        </button>
      )}

      <button
        className={`px-3 py-2 text-left hover:bg-neutral-100 rounded ${
          !canBeControlled ? "hidden" : ""
        }`}
        onClick={async () => {
          await kickUser({ id: currentRoomId, user: { id: clickedUser.id } })
          onClose()
        }}
      >
        Kick
      </button>

      <button
        className={`px-3 py-2 text-left hover:bg-neutral-100 rounded ${
          !canBeControlled ? "hidden" : ""
        }`}
        onClick={async () => {
          await changeMute({ id: currentRoomId, user: { id: clickedUser.id } })
          onClose()
        }}
      >
        Mute
      </button>

      <button
        className={`px-3 py-2 text-left hover:bg-neutral-100 rounded ${
          !canBeControlled ? "hidden" : ""
        }`}
        onClick={async () => {
          await banUser({ id: currentRoomId, user: { id: clickedUser.id } })
          onClose()
        }}
      >
        Ban
      </button>

      {selfUser.id !== clickedUser.id && (
        <button
          className="px-3 py-2 text-left hover:bg-neutral-100 rounded"
          onClick={async () => {
            await changeBlock({ id: clickedUser.id })
            onClose()
          }}
        >
          {clickedUser.status === userStatus.BLOCKED ? "Unblock" : "Block"}
        </button>
      )}
    </div>
  )
}
