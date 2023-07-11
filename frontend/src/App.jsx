import Login from "./security/Login"
import Logout from "./security/Logout"
import { UserContext } from "./context/context"
import React, { useState } from "react"
import Home from "./pages/Home"

function App() {
  const [user, setUser] = useState(null)

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <Login></Login>
        <Logout></Logout>
				<Home></Home>
        {user?.username}
      </UserContext.Provider>
    </div>
  )
}

export default App
