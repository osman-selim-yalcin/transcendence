import clsx from "clsx"
import { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { UserContext } from "../../context/UserContext.tsx"
import { SERVER_URL } from "../../serverUrl.ts"
import Logout from "../auth/Logout.tsx"
import NotificationList from "../Notification/Notification.tsx"

export default function Navbar() {
  const { user } = useContext(UserContext)
  const location = useLocation()
  const navigation = [
    { name: "Home", path: "/" },
    { name: "Profile", path: "/profile" },
    { name: "Chat", path: "/chat" },
    { name: "Game", path: "/game" }
  ]

  return (
    <div className="flex justify-evenly mt-2">
      <div className="flex gap-5 text-center">
        {navigation.map(nav => (
          <Link
            key={nav.name}
            to={nav.path}
            className={clsx(
              location.pathname === nav.path && "bg-blue-700",
              "w-1/4 hover:bg-blue-700 text-center my-auto rounded-lg"
            )}
          >
            {nav.name}
          </Link>
        ))}
      </div>
      <div className="flex">
        {/* <ThemeController />
        <Toggle
          size="md"
          checkedChildren={<CheckIcon />}
          unCheckedChildren={<CloseIcon />}
          defaultChecked
        /> */}
        <button className="btn btn-primary">Button</button>
        {!user ? (
          <button
            onClick={() =>
              window.open(SERVER_URL + "/api/auth/42/login", "_self")
            }
          >
            Login
          </button>
        ) : (
          <>
            <i className="fa-solid fa-user text-lg  "></i>
            <Logout />
            <div className="indicator">
              <span className="indicator-item bg-error size-2 rounded-full"></span>
              <span className="icon-[tabler--bell] text-base-content size-[1.375rem]"></span>
            </div>
            <NotificationList />
          </>
        )}
      </div>
    </div>
  )
}
