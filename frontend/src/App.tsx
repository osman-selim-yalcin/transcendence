import { SocketProvider } from "./context/SocketContext"
import { RouterProvider } from "react-router-dom"
<<<<<<< HEAD
import { router } from "./utils/router"
import UserProvider from "./context/UserContext"
import ContextMenuProvider from "./context/ContextMenuContext"
=======
import { router } from "./utils/routeSetup"
import "./styles/app.scss"

type userPayload = {
  username: string
}
>>>>>>> origin/dockerize

function App() {

  return (
    <>
      <UserProvider>
        <SocketProvider>
          <ContextMenuProvider>
            <RouterProvider router={router} />
          </ContextMenuProvider>
        </SocketProvider>
      </UserProvider>
    </>
  )
}

export default App
