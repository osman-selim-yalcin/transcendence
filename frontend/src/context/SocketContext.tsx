import { PropsWithChildren, createContext, useContext, useEffect } from "react"
import { Socket, io } from "socket.io-client"
import { UserContext } from "./UserContext"
import { message, room, user } from "../types";
import { useNavigate } from "react-router-dom";

export const SocketContext = createContext<Socket>(null)
const socket = io("http://localhost:3000", { autoConnect: false });


export function SocketProvider({ children }: PropsWithChildren) {
  const { user, userRooms, setUserRooms, reloadFriends, reloadNotifications, reloadUserRooms } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    })
    socket.on("private message", (message: message) => {
      const updatedUserRooms = userRooms.map((room: room) => {
        if (message.room !== room.id) {
          return room
        } else {
          const newRoom = { ...room }
          newRoom.messages = [...room.messages, message]
          console.log("this is the updated room:", newRoom)
          return newRoom
        }
      })
      setUserRooms(updatedUserRooms)
      console.log("socket message:", message)
    })
    socket.on("reload friends", () => {
      reloadFriends()
    })
    socket.on("reload notification", () => {
      reloadNotifications()
    })
    socket.on("reload userRooms", () => {
      reloadUserRooms()
    })
    socket.on("game invite accepted", () => {
      navigate(`/game?ref=invite`)
    })
    return (() => {
      socket.off("game invite accepted")
      socket.off("reload userRooms")
      socket.off("reload notification")
      socket.off("reload friends")
      socket.off("connection_error")
      socket.off("private message")
    })
  }, [userRooms])

  useEffect(() => {
    if (user) {
      socket.auth = { sessionID: user.sessionID }
      socket.connect()
    }
    return (() => {
      socket.disconnect()
    })
  }, [user])
  // socket.onAny((event, ...args) => {
  //   console.log(event, args)
  // })


  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}