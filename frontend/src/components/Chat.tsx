import { useContext, useEffect, useRef, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext"
import { UserContext } from "../context/context"
import Room from "./Room"
import { getUsersRooms } from "../api/room"
import { typeAllRooms, typeRoom, typeUser } from "../types"
import List from "./List"
import Modal from "./modals/Modal"

export default function Chat() {
  const socket = useContext(WebsocketContext)
  const show = false
  const [rooms, setRooms] = useState<typeRoom[]>([])
  const [allRooms, setAllRooms] = useState<typeAllRooms[]>([])
  const { user } = useContext(UserContext)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    let tmp: typeAllRooms[]
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
      const room = tmp.find(item => item.room.roomID === to)
      if (room) {
        room.messages.push({
          content,
          owner: from,
          createdAt: new Date().toLocaleString("tr-TR", {
            timeZone: "Europe/Istanbul"
          })
        })
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

  const handleStartRoom = async (item: typeRoom, users: typeUser[]) => {
    console.log("here")
		console.log(item)
    if (
      rooms.find((room: typeRoom) => room.roomID === item.roomID) ||
      !item.roomID
    )
      return

			console.log("here")
			//const sessionIDs = users.map
    const sessionIDs = users.map((item: typeUser) => item.sessionID)

    socket.emit("join room", {
      room: item.roomID,
      clients: [...sessionIDs]
    })

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
    <div className="chat">
      <div className="chat_rooms">
        {rooms?.map((room: typeRoom, index: number) => {
          return (
            <Room
              key={index}
              roomID={room.roomID}
              avatar={room.avatar}
              name={room.name}
              messages={
                allRooms.find(item => item.room.roomID === room.roomID)?.messages
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
          {allRooms.map((item: typeAllRooms, index: number) => (
            <List
              key={index}
              users={item.users}
              avatar={item.room.avatar}
              name={item.room.name}
              item={item}
              mainButton={() => handleStartRoom(item.room, item.users)}
              buttons={buttons}
            />
          ))}
        </div>
      </div>
      <Modal
        dialogRef={dialogRef}
        allRooms={allRooms}
        setAllRooms={setAllRooms}
        handleStartRoom={handleStartRoom}
      ></Modal>
    </div>
  )
}
