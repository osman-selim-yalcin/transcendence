import { Link } from "react-router-dom"
import Login from "../auth/Login"
import Logout from "../auth/Logout"

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar_child">
        <Link to="/">Home</Link>
        <Link to="/login">Login page</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/game">Game</Link>
        <Link to="/Profile">Profile</Link>
      </div>
      <div className="navbar_child">
        <Login />
        <Logout />
      </div>
    </div>
  )
}
