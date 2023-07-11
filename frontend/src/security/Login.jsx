import React, { useState, useContext } from "react"
import { UserContext } from "../context/context"
import { login, authenticationTry, authentication42Try } from "../api/api"

export default function Login() {
  const { user, setUser } = useContext(UserContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const forty = () => {
    const data = window.open("http://localhost:3000/api/auth/42/login", "_self")
    console.log("gagagagaga")
    console.log(data)
  }

 

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
      <button
        onClick={() => {
          authenticationTry()
        }}
      >
        users
      </button>
      <button onClick={forty}>forty</button>
      <button
        onClick={() => {
          authentication42Try()
        }}
      >
        users42
      </button>
      {user?.username}
    </div>
  )
}
