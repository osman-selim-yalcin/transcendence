import React, { useState, useContext } from "react"
import { UserContext } from "../context/context"
import { register } from "../api/api"

export default function Register() {
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
          register(username, password, setUser)
        }}
      >
        Register
      </button>
      {user?.username}
    </div>
  )
}
