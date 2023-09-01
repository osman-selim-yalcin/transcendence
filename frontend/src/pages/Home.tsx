import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.tsx"
import Chat from "../components/Chat.tsx"
import { useContext } from "react"
import { UserContext } from "../context/context.ts"
import Notification from "../components/Notification.tsx"

export default function Home() {
  const { user } = useContext(UserContext)

  return (
    <div>
      <Navbar />
      <Outlet />
      {user && <Chat />}
    </div>
  )
}
