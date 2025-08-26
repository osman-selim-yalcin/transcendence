import { SocketProvider } from "./context/SocketContext"
import UserProvider from "./context/UserContext"
import AppRouter from "./views/router"

function App() {
  return (
    <>
      <UserProvider>
        <SocketProvider>
          <AppRouter />
        </SocketProvider>
      </UserProvider>
    </>
  )
}

export default App
