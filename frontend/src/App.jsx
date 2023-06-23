import Login from "./security/Login"
import Register from "./security/register"
import { UserContext } from "./context/context"
import React, { useState } from "react"

function App() {
  const [user, setUser] = useState(null)

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <Login></Login>
        <Register></Register>
        {user ? "s" : "sd"}
      </UserContext.Provider>
    </div>
  )
}

export default App
