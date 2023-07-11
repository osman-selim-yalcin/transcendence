import Login from "./security/Login"
import Register from "./security/Register"
import Logout from "./security/Logout"
import { UserContext } from "./context/context"
import React, { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [user, setUser] = useState(null)

	useEffect(() => {
    const getUser = async () => {
      axios
        .get("http://localhost:3000/api/auth/user", { withCredentials: true })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
		getUser()
  }, [])

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <Register></Register>
        <Login></Login>
        <Logout></Logout>
      </UserContext.Provider>
    </div>
  )
}

export default App
