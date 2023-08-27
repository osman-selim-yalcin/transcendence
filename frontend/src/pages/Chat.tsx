import { useContext, useEffect, useRef, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext"
import { UserContext } from "../context/context"
import Room from "./Room"
import { getUsersRooms } from "../api/room"
import { typeAllRooms, typeRoom, typeUser } from "../types"
import List from "../components/List"

export default function Chat() {
  const socket = useContext(WebsocketContext)
  const show = false
  const [rooms, setRooms] = useState<typeRoom[]>([])
  const [allRooms, setAllRooms] = useState<typeAllRooms[]>([])
  const { user } = useContext(UserContext)

  useEffect(() => {
		let tmp : typeAllRooms[];
		const handle = async () => {
			tmp = await getUsersRooms(setAllRooms, user)
		}

    if (user) {
			handle()
			socket.auth = { sessionID: user.sessionID }
      socket.connect()
    }

    socket.on("user connected", user => {
			console.log("user connected")
			console.log(user)
		})

    socket.on("user disconnected", id => {
      console.log("user disconnected")
      console.log(id)
    })

    socket.on("private message", ({ content, from, to }) => {
			const room = tmp.find(item => item.id === to);
      if (room) {
        room.messages.push({ content, owner: from })
      }
      setAllRooms([...tmp])
    })

    return () => {
      socket.disconnect()
      socket.off("user connected")
      socket.off("private message")
      socket.off("user disconnected")
    }
  }, [])

  const handleStartRoom = async (friend: typeUser, roomID: number) => {
    if (rooms.find((item: typeRoom) => item.roomID === roomID) || !roomID)
      return

    socket.emit("join room", {
      room: roomID,
      clients: [friend.sessionID, user.sessionID]
    })

    if (rooms.length >= 3) rooms.shift()

    rooms.push({ roomID, friend })
    setRooms([...rooms])
  }

  return (
    <div className="chat">
      <div className="chat_rooms">
        {rooms?.map((room: typeRoom, index: number) => {
          return (
            <Room
              key={index}
              roomID={room.roomID}
              friend={room.friend}
              messages={
                allRooms.find(item => item.id === room.roomID)?.messages
              }
            />
          )
        })}
      </div>
      <div className="chat_div" hidden={show}>
        <div className="chat_div_search">
          {user.username} - {user.sessionID}
        </div>
        <div className="chat_div_friends">
          <List list={allRooms} buttons={handleStartRoom}></List>
        </div>
      </div>
    </div>
  )
}
