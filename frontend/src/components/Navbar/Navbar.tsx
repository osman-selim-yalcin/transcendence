import { Link } from "react-router-dom"
import Logout from "../auth/Logout.tsx"
import { useContext, useState } from "react"
import { UserContext } from "../../context/UserContext.tsx"
import NotificationList from "../Notification/Notification.tsx"
import { Modal } from "../Modal/Modal.tsx"
import Login from "../auth/Login.tsx"
import "./Navbar.scss"

export default function Navbar() {
  const { user } = useContext(UserContext)
  const [modal, setModal] = useState(false)

  return (
    <div className="navbar">
      <div className="navbar_left">
        <Link to={"/"}>Home</Link>
        <Link to={"/profile"}>Profile</Link>
        <Link to={"/chat"}>Chat</Link>
        <Link to={"/game"}>Game</Link>
      </div>
      <div className="navbar_right">
        {!user ? (
          <button onClick={(e) => {
            setModal(true)
          }}>Login</button>
        ) : (
          <>
            <p style={{ alignSelf: "center" }}>{user.displayName || user.username}</p>
            <Logout />
            <NotificationList />
          </>
        )}
      </div>
      <Modal isActive={[modal, setModal]} removable={true}>
        <Login />
      </Modal>
    </div>
  )
}
