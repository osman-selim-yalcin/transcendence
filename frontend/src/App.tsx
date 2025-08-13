import { RouterProvider } from "react-router-dom"
import "./app.css"
import PopUpProvider from "./context/PopUpContext"
import { SocketProvider } from "./context/SocketContext"
import UserProvider from "./context/UserContext"
import { router } from "./views/router"

function App() {
  return (
    <>
      <UserProvider>
        <SocketProvider>
          <PopUpProvider>
            <RouterProvider router={router} />
          </PopUpProvider>
        </SocketProvider>
      </UserProvider>
    </>
  )
}

export default App
