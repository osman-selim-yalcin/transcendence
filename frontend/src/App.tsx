import { SocketProvider } from "./context/SocketContext"
import { RouterProvider } from "react-router-dom"
import { router } from "./utils/router"
import UserProvider from "./context/UserContext"
import ContextMenuProvider from "./context/ContextMenuContext"
import PopUpProvider from "./context/PopUpContext"

function App() {

  return (
    <>
      <UserProvider>
        <SocketProvider>
          <ContextMenuProvider>
            <PopUpProvider>
              <RouterProvider router={router} />
            </PopUpProvider>
          </ContextMenuProvider>
        </SocketProvider>
      </UserProvider>
    </>
  )
}

export default App
