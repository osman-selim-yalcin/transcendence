import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.tsx"
import Chat from "./Chat.tsx"

export default function Home() {
  return (
    <div>
			<Navbar />
			<Outlet />
			<Chat />
    </div>
  )
}
