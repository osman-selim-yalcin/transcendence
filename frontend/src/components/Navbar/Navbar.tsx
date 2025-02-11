import { useContext, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { UserContext } from "../../context/UserContext.tsx"
import { SERVER_URL } from "../../serverUrl.ts"
import NotificationList from "../NotificationList/NotificationList.tsx"

export default function Navbar() {
  const { user, notifications } = useContext(UserContext)
  const location = useLocation()

  const notificationDropdownRef = useRef<HTMLDetailsElement | null>(null)
  const profileDropdownRef = useRef<HTMLDetailsElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(target)
      ) {
        notificationDropdownRef.current.removeAttribute("open")
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(target)
      ) {
        profileDropdownRef.current.removeAttribute("open")
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="navbar text-white bg-gradient-to-r from-purple-900 to-purple-800 shadow-lg p-4">
      <div className="navbar-start flex items-center gap-4">
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-purple-300 transition-all"
        >
          CodeCapital
        </Link>

        {user && (
          <>
            <Link
              to="/chat"
              className="btn  btn-ghost btn-sm bg-purple-700 hover:bg-purple-600 text-white"
            >
              Chat
            </Link>
            <Link
              to="/game"
              className="btn  btn-ghost btn-sm bg-purple-700 hover:bg-purple-600 text-white"
            >
              Game
            </Link>
          </>
        )}
      </div>

      <div className="navbar-end flex items-center gap-4">
        {user ? (
          <>
            <details
              className="dropdown dropdown-end"
              ref={notificationDropdownRef}
            >
              <summary
                tabIndex={0}
                role="button"
                className="btn  btn-ghost btn-circle bg-purple-700 hover:bg-purple-600"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {notifications?.length ? (
                    <span className="badge badge-xs bg-purple-500 indicator-item"></span>
                  ) : null}
                </div>
              </summary>
              <ul className="menu menu-sm dropdown-content bg-purple-900 text-white rounded-box z-10 mt-3 w-52 p-2 shadow-lg">
                <NotificationList />
              </ul>
            </details>

            <details className="dropdown dropdown-end" ref={profileDropdownRef}>
              <summary
                tabIndex={0}
                role="button"
                className="btn  btn-ghost btn-circle bg-purple-700 hover:bg-purple-600"
              >
                <div className="avatar online">
                  <div className="w-10 rounded-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                  </div>
                </div>
              </summary>
              <ul className="menu menu-sm dropdown-content bg-purple-900 text-white rounded-box z-10 mt-3 w-24 p-2 shadow-lg">
                <li>
                  <Link to="/profile" className="hover:text-purple-300">
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="hover:text-purple-300"
                    onClick={() => {
                      localStorage.clear()
                      window.open(SERVER_URL + "/api/auth/logout", "_self")
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </details>
          </>
        ) : (
          <button
            className="btn btn-ghost bg-purple-700 hover:bg-purple-600 text-white"
            onClick={() =>
              window.open(SERVER_URL + "/api/auth/42/login", "_self")
            }
          >
            Login with 42
          </button>
        )}
      </div>
    </div>
  )
}
