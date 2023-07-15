import { Outlet } from "react-router-dom"
import { authenticationTry } from "../api/index.ts"
import Navbar from "../components/Navbar.tsx"

export default function Home() {
  return (
    <div>
			Home Page
			<Navbar />
      <button onClick={authenticationTry}>try</button>
			<Outlet />
    </div>
  )
}
