import React, { useContext } from "react"
import { UserContext } from "../context/context"

export default function Login() {
  const { user, setUser } = useContext(UserContext)
  return (
    <div>
      <button
        onClick={() => {
					setUser(null)
					localStorage.clear();
        }}
      >
        Logout
      </button>
    </div>
  )
}
