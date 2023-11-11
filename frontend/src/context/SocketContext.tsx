import { PropsWithChildren, createContext, useContext, useEffect } from "react"
import { Socket, io } from "socket.io-client"
import { UserContext } from "./UserContext"
import { message, room } from "../types";

export const SocketContext = createContext<Socket>(null)
const socket = io("http://localhost:3000", { autoConnect: false });


export function SocketProvider({ children }: PropsWithChildren) {
  const { user, userRooms, setUserRooms, reloadFriends, reloadNotifications, reloadUserRooms } = useContext(UserContext)

  useEffect(() => {
    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    })
    socket.on("private message", (message: message) => {
      const updatedUserRooms = userRooms?.map((room: room) => {
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
    socket.on("reload", (data: string) => {
      if (data === "friends")
        reloadFriends()
      else if (data === "notification")
        reloadNotifications()
      else if (data === "userRooms")
        reloadUserRooms()
    })

    return (() => {
      socket.off("reload")
      socket.off("connection_error")
      socket.off("private message")
    })
  }, [])

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