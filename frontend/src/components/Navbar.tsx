import { Link } from "react-router-dom"
import Logout from "../auth/Logout"
import { useContext } from "react"
import { UserContext } from "../context/context"

export default function Navbar() {
  // @ts-ignore: Object is possibly 'null'.
  const { user } = useContext(UserContext)

  return (
    <div className="navbar">
      <div className="navbar_left">
        <Link to="/">Home</Link>
        <Link to="/Profile">Profile</Link>
      </div>
      <div className="navbar_right">
        {!user ? <Link to="/login">Login</Link> : <Logout />}
      </div>
    </div>
  )
}
