import React from "react"
import { useEffect, useContext } from "react"
import { UserContext } from "../context/context"
import { getUser } from "../api/index"

export default function Login() {
  const { setUser } = useContext(UserContext)

  useEffect(() => {
    getUser(setUser)
  }, [])

  return (
    <div>
      <button
        onClick={() =>
          window.open("http://localhost:3000/api/auth/42/login", "_self")
        }
      >
        forty
      </button>
    </div>
  )
}
