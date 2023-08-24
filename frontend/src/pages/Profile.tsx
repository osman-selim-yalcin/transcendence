import { useContext } from "react"
import { UserContext } from "../context/context"

export default function Profile() {
  const { user } = useContext(UserContext)

  if (!user) {
    return <div>not found user</div>
  }

  return (
    <div>
      <h1>Profile</h1>
      <div>
        {user?.username}
        {/* <img src={user?.avatar} alt="" /> */}
      </div>
    </div>
  )
}
