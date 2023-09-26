import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../context/UserContext"
import Room from "./Room"
import List from "./List"

export default function Chat() {
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
