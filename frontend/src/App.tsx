import { UserContext } from "./context/UserContext"
import { useEffect, useState } from "react"
import { socket, WebSocketContext } from "./context/WebsocketContext"
import { RouterProvider } from "react-router-dom"
import { router } from "./utils/router"
import "./styles/App.scss"
import { getUser } from "./api"

type userPayload = {
  username: string
}

function App() {
  const [user, setUser] = useState<userPayload>(null)

	useEffect(() => {
    getUser(setUser)
  }, [])

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <WebSocketContext.Provider value={socket}>
          <RouterProvider router={router} />
        </WebSocketContext.Provider>
      </UserContext.Provider>
    </div>
  )
}

export default App
