import { RouterProvider } from "react-router-dom"
import "./app.css"
import { SocketProvider } from "./context/SocketContext"
import UserProvider from "./context/UserContext"
import { router } from "./views/router"

function App() {
  return (
    <>
      <UserProvider>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </UserProvider>
    </>
  )
}

export default App
