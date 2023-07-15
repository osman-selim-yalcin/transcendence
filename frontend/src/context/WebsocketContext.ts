import { createContext } from "react"
import { Socket, io } from "socket.io-client"

export const socket = io("http://localhost:3000")
export const WebsocketContext = createContext<Socket>(socket)