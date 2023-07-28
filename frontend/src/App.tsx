import { UserContext } from "./context/context"
import { useState } from "react"
import { socket, WebsocketContext } from "./context/WebsocketContext"
import { RouterProvider } from "react-router-dom"
import { router } from "./utils/routeSetup"
import "./styles/App.scss"

type userPayload = {
  username: string
}

function App() {
  const [user, setUser] = useState<userPayload>(null)

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <WebsocketContext.Provider value={socket}>
          <RouterProvider router={router} />
        </WebsocketContext.Provider>
      </UserContext.Provider>
    </div>
  )
}

export default App
