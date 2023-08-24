import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext"
import { UserContext } from "../context/context"
import { addFriend, removeFriend, getAllFriends } from "../api/friend"
import { getAllUsers } from "../api"
import Room from "./Room"
import { startRoom } from "../api/room"

type msg = {
  content: string
  fromSelf: boolean
}

type typeRoom = {
  roomID: number
  friend: Props
}

type Props = {
  username: string
  id: number
  status: string
  avatar: string
  messages: msg[]
  userID: string
  sessionID: string
  hasNewMessages: boolean
}

export default function Chat() {
  const socket = useContext(WebsocketContext)
  const show = false
  const [allUsers, setAllUsers] = useState([])
  const [friends, setFriends] = useState([])
  const [rooms, setRooms] = useState<typeRoom[]>([])
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user) {
      getAllFriends(setFriends)
      socket.auth = { sessionID: user.sessionID }
      socket.connect()
    }

		socket.on("user connected", user => {})

    socket.on("user disconnected", id => {})

    socket.on("private message", ({ content, from }) => {})

    return () => {
      socket.disconnect()
      socket.off("user connected")
      socket.off("private message")
      socket.off("user disconnected")
    }
  }, [])

  const handleStartRoom = async (friend: Props) => {
    const roomID = await startRoom(friend.username)
    console.log(roomID)
    socket.emit("join room", {
      room: roomID,
      clients: [friend.sessionID, user.sessionID]
    })
    rooms.push({ roomID, friend })
    setRooms([...rooms])
  }

  return (
    <div className="chat">
      {rooms.length}
      <div className="chat_rooms">
        {rooms?.map((room: typeRoom, index: number) => {
          return <Room key={index} roomID={room.roomID} friend={room.friend} />
        })}
      </div>
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
          {friends?.length !== 0 ? (
            friends.map((item: Props, index) => {
              return (
                <div
                  key={index}
                  className="chat_div_friends_friend"
                  onClick={() => handleStartRoom(item)}
                >
                  <div className="chat_div_friends_friend_info">
                    {/* <img
                      src={item.avatar}
                      alt=""
                      className="chat_div_friends_friend_info_img"
                    /> */}
                    <p>{item.username}</p>
                  </div>
                  <div className="chat_div_friends_friend_buttons">
                    <button onClick={() => removeFriend(item.username)}>
                      X
                    </button>
                  </div>
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
