import { PropsWithChildren, createContext, useContext, useEffect } from "react"
import { Socket, io } from "socket.io-client"
import { UserContext } from "./UserContext"

export const SocketContext = createContext<Socket>(null)


export function SocketProvider({ children }: PropsWithChildren) {
  const { user } = useContext(UserContext)
  const socket = io("http://localhost:3000", { autoConnect: false });

  useEffect(() => {
    console.log("called", user)
    if (user) {
      socket.auth = { sessionID: user.sessionID }
      console.log("socket", socket.connect())
    }
    return (() => {
      socket.disconnect()
    })
  }, [user])
  // socket.onAny((event, ...args) => {
  //   console.log(event, args)
  // })

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
  });

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}