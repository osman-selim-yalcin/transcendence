import { SocketProvider } from "./context/SocketContext"
import { RouterProvider } from "react-router-dom"
import { router } from "./utils/router"
import UserProvider from "./context/UserContext"

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
