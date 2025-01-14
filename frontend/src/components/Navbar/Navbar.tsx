import { Link } from "react-router-dom"
import Logout from "../auth/Logout.tsx"
import { PropsWithChildren, useContext } from "react"
import { UserContext } from "../../context/UserContext.tsx"
import NotificationList from "../Notification/Notification.tsx"
import "./Navbar.scss"
import { SERVER_URL } from "../../serverUrl.ts"
import { LocationPathName } from "../../types/index.ts"
import ThemeController from "../ThemeController.tsx"

export default function Navbar({ page }: PropsWithChildren<{ page: LocationPathName }>) {
  const { user } = useContext(UserContext)

  return (
    <div className="navbar">
      <div className="navbar_left">
        <div className="">
          <Link to={"/"} className={page === LocationPathName.ROOT ? "current" : ""}>Home</Link>
        </div>
        <div className="">
          <Link to={"/profile"} className={page === LocationPathName.PROFILE ? "current" : ""}>Profile</Link>
        </div>
        <div className="">
          <Link to={"/chat"} className={page === LocationPathName.CHAT ? "current" : ""}>Chat</Link>
        </div>
        <div className="">
          <Link to={"/game"} className={page === LocationPathName.GAME ? "current" : ""}>Game</Link>
        </div>
      </div>
      <div className="navbar_right">
        <ThemeController />
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
