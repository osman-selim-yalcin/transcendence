import { Link } from "react-router-dom"
import Logout from "../auth/Logout.tsx"
import { useContext } from "react"
import { UserContext } from "../../context/UserContext.tsx"
import NotificationList from "../Notification/Notification.tsx"
import "./Navbar.scss"
import { SERVER_URL } from "../../serverUrl.ts"

export default function Navbar() {
  const { user } = useContext(UserContext)

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
          <button
            onClick={() =>
              window.open(SERVER_URL + "/api/auth/42/login", "_self")
            }
          >
            42 Login
          </button>
        ) : (
          <>
            <p style={{ alignSelf: "center" }}>{user.displayName || user.username}</p>
            <Logout />
            <NotificationList />
          </>
        )}
      </div>
    </div>
  )
}
