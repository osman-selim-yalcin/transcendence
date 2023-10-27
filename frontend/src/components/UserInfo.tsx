import { useContext } from "react"
import { UserContext } from "../context/UserContext"

export default function UserInfo() {
  const { user } = useContext(UserContext)

  return (
    <div>
      {user ?
      user.username
      :
      <div>User not found</div>}
    </div>
  )
}
