import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext"
import { UserContext } from "../context/context"
import Room from "./Room"
import { addFriend, removeFriend } from "../api/friend"
import { getAllUsers } from "../api"

type msg = {
  content: string
  fromSelf: boolean
}

type Props = {
  username: string
  id: number
  status: string
  avatar: string
  messages: msg[]
  userID: string
  connected: boolean
  self: boolean
  hasNewMessages: boolean
}

export default function Chat() {
  const socket = useContext(WebsocketContext)
  const show = false
  const [allUsers, setAllUsers] = useState([])
  const { user } = useContext(UserContext)

  const [users, setUsers] = useState<Props[]>([])
  const [selectedUser, setSelectedUser] = useState<Props>(null)

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID")
    if (sessionID) {
      socket.auth = { sessionID }
      socket.connect()
    }

    socket.on("session", ({ sessionID, userID }) => {
      socket.auth = { sessionID }
      localStorage.setItem("sessionID", sessionID)
      socket.userID = userID
    })

    socket.on("connect_error", err => {
      if (err.message === "invalid username") {
        console.log("invalid username")
      }
    })

    socket.on("users", users => {
      users.forEach((user: Props) => {
        user.self = user.userID === socket.userID
        initReactiveProperties(user)
      })

      // put the current user first, and then sort by username
      setUsers(
        users.sort((a: Props, b: Props) => {
          if (a.self) return -1
          if (b.self) return 1
          if (a.username < b.username) return -1
          return a.username > b.username ? 1 : 0
        })
      )
    })

    socket.on("user connected", user => {
      if (
        users.find((item: Props) => {
          if (item.username === user.username) {
            item.connected = true
            setUsers([...users])
            return true
          }
          return false
        })
      )
        return
      initReactiveProperties(user)
      setUsers([...users, user])
    })

    socket.on("user disconnected", id => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i]
        if (user.userID === id) {
          user.connected = false
          break
        }
      }
      setUsers([...users])
    })

    socket.on("private message", ({ content, from }) => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i]
        if (user.userID === from) {
          user.messages.push({
            content,
            fromSelf: false
          })
          if (user !== selectedUser) {
            user.hasNewMessages = true
          }
          break
        }
      }
      setUsers([...users])
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("users")
      socket.off("user connected")
      socket.off("user disconnected")
      socket.off("private message")
    }
  }, [user, users])

  const handleStartChat = async (username: string) => {}

  const onMessage = (content: string) => {
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID
      })
      selectedUser.messages.push({
        content,
        fromSelf: true
      })
    }
  }

  const onSelectUser = (user: Props) => {
    user.hasNewMessages = false
    setSelectedUser(user)
    setUsers([...users])
  }

  const initReactiveProperties = (user: Props) => {
    user.messages = []
    user.hasNewMessages = false
  }

  return (
    <div className="chat">
      {selectedUser && (
        <Room
          onMessage={onMessage}
          user={selectedUser}
          // onSelectUser={onSelectUser}
        />
      )}
      <div className="chat_div" hidden={show}>
        <div className="chat_div_search">
          <div>
            <button onClick={() => getAllUsers(setAllUsers)}>
              show all users
            </button>
            {allUsers?.map((item: Props) => {
              if (item.username === user.username) return null
              return (
                <div key={item.id}>
                  <button onClick={() => addFriend(item.username)}>
                    {item.username} add friend
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        <div className="chat_div_friends">
          {users?.length !== 0 ? (
            users.map((item: Props, index) => {
              return (
                <div
                  key={index}
                  className="chat_div_friends_friend"
                  onClick={() => onSelectUser(item)}
                >
                  <div className="chat_div_friends_friend_info">
                    {item.connected ? "online" : "offline"}
                    <img
                      src={item.avatar}
                      alt=""
                      className="chat_div_friends_friend_info_img"
                    />
                    <p>{item.username}</p>
                  </div>
                  <div className="chat_div_friends_friend_buttons">
                    <button onClick={() => removeFriend(item.username)}>
                      remove friend
                    </button>
                    <button onClick={() => handleStartChat(item.username)}>
                      start chat
                    </button>
                  </div>
                  {item.hasNewMessages && <div className="new-messages">!</div>}
                </div>
              )
            })
          ) : (
            <div>no friends</div>
          )}
        </div>
      </div>
    </div>
  )
}
