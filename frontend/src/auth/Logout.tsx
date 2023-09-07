import { useContext } from "react"
import { UserContext } from "../context/UserContext"

export default function logout() {
  const { setUser } = useContext(UserContext)

  return (
    <div>
      <button
        onClick={() => {
          setUser(null)
          localStorage.clear()
          window.open("http://localhost:3000/api/auth/logout", "_self")
        }}
      >
        Logout
      </button>
    </div>
  )
}
