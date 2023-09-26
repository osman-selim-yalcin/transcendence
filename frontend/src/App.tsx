import { SocketProvider } from "./context/SocketContext"
import { RouterProvider } from "react-router-dom"
import { router } from "./utils/router"
import "./styles/App.scss"
import UserProvider from "./context/UserContext"

function App() {

  return (
    <div>
      <UserProvider>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </UserProvider>
    </div>
  )
}

export default App
