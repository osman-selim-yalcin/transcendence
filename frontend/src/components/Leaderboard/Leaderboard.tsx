import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../context/UserContext"
import { getLeaderboard } from "../../api/game"
import { user } from "../../types"
import "./Leaderboard.scss"

export default function () {
  const { user } = useContext(UserContext)
  const [leaderboad, setLeaderboad] = useState<user[]>(null)
  useEffect(() => {
    if (user) {
      getLeaderboard()
        .then((res) => {
          setLeaderboad(res)
        })
    }
  }, [user])
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <div className="list">
        <ul>
          {leaderboad && leaderboad.map((player, i) => {
            return (
              <>
                <li key={player.id}>
                  <span>{i + 1}</span> <span className="username">{player.username}</span> <span className="elo">{player.elo}</span>
                </li>
              </>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
