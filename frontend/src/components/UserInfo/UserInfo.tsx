import { PropsWithChildren, useEffect, useState } from "react"
import { GameInfo, user, userStatus } from "../../types"
import LoadIndicator from "../LoadIndicator/LoadIndicator"
import { getGameHistory, getLeaderboard } from "../../api/game"
import "./UserInfo.scss"

export default function UserInfo({ user }: PropsWithChildren<{ user: user }>) {
  const [status, setStatus] = useState("")
  const [gameHistory, setGameHistory] = useState<GameInfo[]>([])
  const [leaderboard, setLeaderboard] = useState<user[]>([])

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

  useEffect(() => {
    if (user) {
      getGameHistory(user.id)
        .then((res) => {
          setGameHistory(res)
        })
      getLeaderboard()
        .then((res) => {
          setLeaderboard(res)
        })
    }
  }, [user])



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

  function getWinStreak() {
    let streak = 0;
    for (const game of gameHistory) {
      if (!game.result)
        return streak
      ++streak
    }
    return streak
  }

  return (
    <div className="user-profile">
      <div className="avatar">
        <img className={status} src={user.avatar} alt="user avatar" />
      </div>
      <Nameplate user={user} />
      <div className="tables">
        <div className="table player-stats">
          <p><b>Total game:</b> {gameHistory.length}</p>
          <p><b>Win rate:</b> {gameHistory.length ? (gameHistory.filter((game) => (game.result)).length / gameHistory.length * 100).toFixed(2) : 0}%</p>
          <p><b>Current win streak:</b> {getWinStreak()}</p>
          <p><b>Rank point:</b> {user.elo}</p>
          <p><b>Placement:</b> {leaderboard.findIndex((player) => (player.id === user.id)) + 1}</p>
        </div>
        <div className="table game-table">
          {gameHistory.length ?
            <ul>
              {gameHistory.map((game, i) => (
                <li className={game.result ? "win" : "lose"} key={game.id}>
                  <div>
                    <b>{user.displayName || user.username} vs. {game.opponent.displayName || game.opponent.username}</b>
                  </div>
                  <div className="score">
                    <p>{game.result ? game.score[0] : game.score[1]} - {game.result ? game.score[1] : game.score[0]}</p>
                    <p>{game.result ? "+" : "-"}{game.elo}</p>
                  </div>
                </li>
              ))}
            </ul>
            :
            <div className="placeholder">
              <p>No game found</p>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

function Nameplate({ user }: PropsWithChildren<{ user: user }>) {
  return (
    <p className="name-plate"><span className="username">{user.displayName || user.username}</span><br />#{user.username}<br />{user.id}</p>
  )
}