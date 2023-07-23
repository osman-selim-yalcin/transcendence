import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.tsx"

export default function Home() {
  return (
    <div>
			<Navbar />
			<Outlet />
    </div>
  )
}
