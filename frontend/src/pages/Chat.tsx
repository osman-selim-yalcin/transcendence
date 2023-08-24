import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext"
import { UserContext } from "../context/context"
import { addFriend, removeFriend, getAllFriends } from "../api/friend"
import { getAllUsers } from "../api"
import Room from "./Room"
import { startRoom } from "../api/room"
import { typeRoom, typeUser } from "../types"
import List from "../components/List"

export default function Chat() {
  const socket = useContext(WebsocketContext)
  const show = false
  const [allUsers, setAllUsers] = useState([])
  const [friends, setFriends] = useState([])
  const [data, setData] = useState({ list: [], buttons: [] })
  const [rooms, setRooms] = useState<typeRoom[]>([])
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user) {
      getAllFriends(setFriends)
      getAllUsers(setAllUsers)
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

  const handleStartRoom = async (friend: typeUser) => {
    const roomID = await startRoom(friend.username)
		console.log(roomID)
    if (rooms.find((item: typeRoom) => item.roomID === roomID) || !roomID) return
    socket.emit("join room", {
      room: roomID,
      clients: [friend.sessionID, user.sessionID]
    })
    if (rooms.length >= 3) rooms.shift()
    rooms.push({ roomID, friend })
    setRooms([...rooms])
  }

  const handleData = (data: any) => {
    setData(data)
  }

  return (
    <div className="chat">
      <div className="chat_rooms">
        {rooms?.map((room: typeRoom, index: number) => {
          return <Room key={index} roomID={room.roomID} friend={room.friend} />
        })}
      </div>
      <div className="chat_div" hidden={show}>
        <div className="chat_div_search">
          {user.username} - {user.sessionID}
          <button
            onClick={() =>
              handleData({
                list: friends,
                buttons: [handleStartRoom, removeFriend]
              })
            }
          >
            friends
          </button>
          <button
            onClick={() =>
              handleData({
                list: allUsers,
                buttons: [handleStartRoom, addFriend]
              })
            }
          >
            all users
          </button>
        </div>
        <div className="chat_div_friends">
          <List list={data.list} buttons={data.buttons}></List>
        </div>
      </div>
    </div>
  )
}
