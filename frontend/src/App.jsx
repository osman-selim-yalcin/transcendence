import Login from "./security/Login"
import Register from "./security/Register"
import Logout from "./security/Logout"
import { UserContext } from "./context/context"
import React, { useState } from "react"

function App() {
  const [user, setUser] = useState(null)

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
