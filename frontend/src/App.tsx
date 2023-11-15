import { SocketProvider } from "./context/SocketContext"
import { RouterProvider } from "react-router-dom"
import { router } from "./utils/router"
import UserProvider from "./context/UserContext"
import ContextMenuProvider from "./context/ContextMenuContext"

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
