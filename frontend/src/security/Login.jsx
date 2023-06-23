import React, { useState, useContext } from "react"
import { UserContext } from "../context/context"
import { login } from "../api/api"

export default function Login() {
  const { user, setUser } = useContext(UserContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div>
      <input
        placeholder="Username"
        onChange={event => {
          setUsername(event.target.value)
        }}
      />
      <input
        placeholder="Password"
        onChange={event => {
          setPassword(event.target.value)
        }}
      />
      <button
        onClick={() => {
          login(username, password, setUser)
        }}
      >
        Login
      </button>
      {user?.username}
    </div>
  )
}
