import { PropsWithChildren, useContext, useEffect, useState } from "react"
import { user, userStatus } from "../types"
import LoadIndicator from "./LoadIndicator/LoadIndicator"

export default function UserInfo({ user }: PropsWithChildren<{ user: user }>) {
  const [status, setStatus] = useState("")

  useEffect(() => {

    if (user.status === userStatus.ONLINE)
      setStatus("online")
    else if (user.status === userStatus.OFFLINE)
      setStatus("offline")
    else if (user.status === userStatus.INGAME)
      setStatus("in-game")
    else if (user.status === userStatus.BUSY)
      setStatus("busy")

  }, [])


  if (!user) {
    return (
      <LoadIndicator />
    )
  } else if (user.status === userStatus.BLOCKED) {
    return (
      <div className="blocked-profile">
        <div>
          <Nameplate user={user} />
        </div>
        <div className={"blocked"}>
          <p>You cannot see this profile because of a block</p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-profile">
      <div className="avatar">
        <img className={status} src={user.avatar} alt="user avatar" />
      </div>
      <Nameplate user={user} />
      <div className="tables">
        <div className="table friend-table"></div>
        <div className="table game-table"></div>
      </div>
    </div>
  )
}

function Nameplate({ user }: PropsWithChildren<{ user: user }>) {
  return (
    <p className="name-plate"><span className="username">{user.displayName || user.username}</span><br />#{user.username}<br />{user.id}</p>
  )
}