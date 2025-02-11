import { useContext, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { UserContext } from "../../context/UserContext.tsx"
import { SERVER_URL } from "../../serverUrl.ts"
import NotificationList from "../NotificationList/NotificationList.tsx"

export default function Navbar() {
  const { user } = useContext(UserContext)
  const location = useLocation()
  const { notifications } = useContext(UserContext)

  // Bildirim ve Profil Dropdown'ları için ayrı ref'ler
  const notificationDropdownRef = useRef<HTMLDetailsElement | null>(null)
  const profileDropdownRef = useRef<HTMLDetailsElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node

      // Eğer tıklanan element dropdown'ların içinde değilse hepsini kapat
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
    <div className="navbar bg-base-300">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost">
          Home
        </Link>
        <Link to="/chat" className="btn btn-ghost">
          Chat
        </Link>
        <Link to="/game" className="btn btn-ghost">
          Game
        </Link>
      </div>

      {/* <div className="navbar-center">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div> */}

      <div className="navbar-end">
        {user ? (
          <>
            {/* Bildirim Dropdown */}
            <details
              className="dropdown dropdown-end"
              ref={notificationDropdownRef}
            >
              <summary
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                    <span className="badge badge-xs badge-primary indicator-item"></span>
                  ) : null}
                </div>
              </summary>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg"
              >
                <NotificationList />
              </ul>
            </details>

            {/* Profil Dropdown */}
            <details className="dropdown dropdown-end" ref={profileDropdownRef}>
              <summary
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="avatar online">
                  <div className="w-10 rounded-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                  </div>
                </div>
              </summary>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-24 p-2 shadow-lg"
              >
                <li>
                  <Link to="/profile" className="btn btn-ghost">
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="btn btn-ghost"
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
            className="btn btn-ghost"
            onClick={() =>
              window.open(SERVER_URL + "/api/auth/42/login", "_self")
            }
          >
            Login
          </button>
        )}
      </div>
    </div>
  )
}
