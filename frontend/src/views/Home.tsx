import { useContext, useEffect, useState } from "react"
import { getLeaderboard } from "../api/game.ts"
import { UserContext } from "../context/UserContext"
import { user } from "../types"

export default function Home() {
  const { user } = useContext(UserContext)
  const [leaderboard, setLeaderboard] = useState<user[]>(null)
  useEffect(() => {
    if (user) {
      getLeaderboard().then(res => {
        setLeaderboard(res)
      })
    }
  }, [user])

  return (
    <div style={{ height: "100%" }}>
      <h1>
        42 Transcendence by <i>bmat&osyalcin</i>
      </h1>
      {leaderboard?.length > 0 && (
        <div className="w-3/5 max-h-[40%] min-h-[30%] flex flex-col">
          <h2 className="text-center text-[30px] font-medium mb-5">
            Leaderboard
          </h2>

          <div className="overflow-y-scroll flex-grow border-y border-gray-400 mx-16">
            <ul className="p-0 list-none text-center">
              {leaderboard.map((player, i) => (
                <li
                  key={player.id}
                  className="grid grid-cols-3 text-[25px] font-medium border-b border-gray-400 last:border-b-0"
                >
                  <span>{i + 1}</span>
                  <span className="username">{player.username}</span>
                  <span className="elo">{player.elo}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
