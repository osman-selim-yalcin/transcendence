import { PropsWithChildren, useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../context/UserContext.tsx"
import { SERVER_URL } from "../serverUrl.ts"
import { LocationPathName } from "../types/index.ts"
import Notification from "./Notification.tsx"

export default function Navbar({
  page
}: PropsWithChildren<{ page: LocationPathName }>) {
  const { user } = useContext(UserContext)

  return (
    <div className="flex items-center justify-evenly p-4">
      {/* Left */}
      <div className="flex gap-12">
        <Link
          to="/"
          className={`px-4 py-2 rounded-md ${
            page === LocationPathName.ROOT
              ? "bg-[#e2e4e6]"
              : "hover:bg-[#f5f6f6]"
          }`}
        >
          Home
        </Link>
        <Link
          to="/profile"
          className={`px-4 py-2 rounded-md ${
            page === LocationPathName.PROFILE
              ? "bg-[#e2e4e6]"
              : "hover:bg-[#f5f6f6]"
          }`}
        >
          Profile
        </Link>
        <Link
          to="/chat"
          className={`px-4 py-2 rounded-md ${
            page === LocationPathName.CHAT
              ? "bg-[#e2e4e6]"
              : "hover:bg-[#f5f6f6]"
          }`}
        >
          Chat
        </Link>
        <Link
          to="/game"
          className={`px-4 py-2 rounded-md ${
            page === LocationPathName.GAME
              ? "bg-[#e2e4e6]"
              : "hover:bg-[#f5f6f6]"
          }`}
        >
          Game
        </Link>
      </div>

      {/* Right */}
      <div className="flex gap-16">
        {user ? (
          <button
            onClick={() =>
              window.open(SERVER_URL + "/api/auth/42/login", "_self")
            }
          >
            42 Login
          </button>
        ) : (
          <>
            <p className="self-center">{user?.displayName || user?.username}</p>
            <div>
              <button
                onClick={() => {
                  localStorage.clear()
                  window.open(SERVER_URL + "/api/auth/logout", "_self")
                }}
              >
                Logout
              </button>
            </div>
            <Notification />
          </>
        )}
      </div>
    </div>
  )
}
