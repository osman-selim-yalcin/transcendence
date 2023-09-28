import { useContext, useState } from "react"
import { UserContext } from "../../context/UserContext.tsx"
import { login } from "../../api/tmp.ts"
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setUser } = useContext(UserContext)
  const [loginWith, setLoginWith] = useState("")
  const [username, setUsername] = useState("")

  const navigate = useNavigate()

  if (!loginWith) {
    return (
      <div>
        select login method
        <button
          onClick={() => {
            setLoginWith("42")
            localStorage.setItem("loginWith", "42")
          }}
        >
          42
        </button>
        <button
          onClick={() => {
            setLoginWith("username")
            localStorage.setItem("loginWith", "username")
          }}
        >
          username
        </button>
      </div>
    )
  } else if (loginWith === "42") {
    return (
      <div>
        <button
          onClick={() =>
            window.open("http://localhost:3000/api/auth/42/login", "_self")
          }
        >
          forty
        </button>
        <button onClick={() => {
          localStorage.clear()
          setLoginWith("")
        }}>Back</button>
      </div>
    )
  } else if (loginWith === "username") {
    return (
      <div>
        <input type="text" onChange={e => setUsername(e.target.value)} />{" "}
        <button
          onClick={() => {
            login(username, setUser, navigate)
          }}
        >
          username login
        </button>
        <button onClick={() => {
          localStorage.clear()
          setLoginWith("")
        }}>Back</button>
      </div>
    )
  }
}
