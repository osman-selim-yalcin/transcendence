import { PropsWithChildren, createContext, useContext, useEffect } from "react"
import { Socket, io } from "socket.io-client"
import { UserContext } from "./UserContext"

export const SocketContext = createContext<Socket>(null)
const socket = io("http://localhost:3000", { autoConnect: false });


export function SocketProvider({ children }: PropsWithChildren) {
  const { user } = useContext(UserContext)

  useEffect(() => {
    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    })
    socket.on("private message", (message) => {
      console.log("socket message:", message)
    })
    return (() => {
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