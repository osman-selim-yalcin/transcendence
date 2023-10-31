import { PropsWithChildren, useContext } from "react"
import { user } from "../types"
import LoadIndicator from "./LoadIndicator/LoadIndicator"

export default function UserInfo({ user }: PropsWithChildren<{ user: user }>) {

  if (!user) {
    return (
      <LoadIndicator />
    )
  }

  return (
    <div className="user-profile">
      <div className="avatar">
        <img src={user.avatar} alt="user avatar" />
      </div>
      <p className="name-plate"><span className="username">{user.displayName || user.username}</span><br />{user.id}</p>
      <p></p>
      <div className="tables">
        <div className="table friend-table"></div>
        <div className="table game-table"></div>
      </div>
    </div>
  )
}
