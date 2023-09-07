import { createContext } from "react"
import { Socket, io } from "socket.io-client"

const socket1 = io("http://localhost:3000", { autoConnect: false })
socket1.onAny((event, ...args) => {
  console.log(event, args)
})

export const socket = socket1
export const WebSocketContext = createContext<Socket>(socket)
