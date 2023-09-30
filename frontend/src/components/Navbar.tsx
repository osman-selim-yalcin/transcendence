import { Link } from "react-router-dom"
import Logout from "./auth/Logout.tsx"
import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext.tsx"
import Notification from "./Notification.tsx"
import { Modal } from "./Modal.tsx"
import Login from "./auth/Login.tsx"

export default function Navbar() {
  const { user } = useContext(UserContext)
  const [modal, setModal] = useState(false)

  return (
    <div className="navbar">
      <div className="navbar_left">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to={"/friends"}>Friends</Link>
        <Link to={"/users"}>Users</Link>
        <Link to={"/rooms"}>Rooms</Link>
      </div>
      <div className="navbar_right">
        {!user ? (
          <button onClick={(e) => {
            setModal(true)
          }}>Login</button>
        ) : (
          <>
            <Logout />
            <Notification />
          </>
        )}
      </div>
      <Modal isActive={[modal, setModal]}>
        <Login />
      </Modal>
    </div>
  )
}
