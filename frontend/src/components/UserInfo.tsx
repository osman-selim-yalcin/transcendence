import { PropsWithChildren, useEffect, useMemo, useState } from "react"
import { getGameHistory, getLeaderboard } from "../api/game"
import { GameInfo, user as TUser, userStatus } from "../types"
import LoadIndicator from "./LoadIndicator"

export default function UserInfo({ user }: PropsWithChildren<{ user: TUser }>) {
  const [gameHistory, setGameHistory] = useState<GameInfo[]>([])
  const [leaderboard, setLeaderboard] = useState<TUser[]>([])

  // status metnini state yerine türetelim
  const statusText = useMemo(() => {
    switch (user?.status) {
      case userStatus.ONLINE:
        return "online"
      case userStatus.OFFLINE:
        return "offline"
      case userStatus.INGAME:
        return "in-game"
      case userStatus.BUSY:
        return "busy"
      default:
        return ""
    }
  }, [user?.status])

  useEffect(() => {
    if (!user) return
    getGameHistory(user.id).then(setGameHistory)
    getLeaderboard().then(setLeaderboard)
  }, [user])

  if (!user) {
    return <LoadIndicator />
  }

  if (user.status === userStatus.BLOCKED) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <Nameplate user={user} />
        </div>
        <div className="rounded-xl border border-neutral-300 p-6 text-center">
          <p>You cannot see this profile because of a block</p>
        </div>
      </div>
    )
  }

  const total = gameHistory.length
  const wins = gameHistory.filter(g => g.result).length
  const winRate = total ? ((wins / total) * 100).toFixed(2) : "0"

  function getWinStreak() {
    let streak = 0
    for (const game of gameHistory) {
      if (!game.result) return streak
      streak++
    }
    return streak
  }

  // avatar çerçevesi rengi (status’e göre)
  const frameRing =
    statusText === "online"
      ? "ring-green-400"
      : statusText === "in-game"
      ? "ring-amber-400"
      : statusText === "busy"
      ? "ring-red-400"
      : statusText === "offline"
      ? "ring-neutral-300"
      : "ring-transparent"

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar + İsim */}
      <div className="flex items-center gap-4">
        <div
          className={`h-24 w-24 rounded-full ring-4 ${frameRing} overflow-hidden`}
        >
          <img
            src={user.avatar}
            alt="user avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <Nameplate user={user} />
          {statusText && (
            <span className="mt-1 inline-block rounded-full border px-3 py-0.5 text-xs text-neutral-600">
              {statusText}
            </span>
          )}
        </div>
      </div>

      {/* İstatistik + Maç Geçmişi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player stats */}
        <div className="rounded-2xl border border-neutral-200 p-5 flex flex-col justify-evenly text-2xl gap-2">
          <p>
            <b>Total game:</b> {total}
          </p>
          <p>
            <b>Win rate:</b> {winRate}%
          </p>
          <p>
            <b>Current win streak:</b> {getWinStreak()}
          </p>
          <p>
            <b>Rank point:</b> {user.elo}
          </p>
          <p>
            <b>Placement:</b> {leaderboard.findIndex(p => p.id === user.id) + 1}
          </p>
        </div>

        {/* Game history table-like list */}
        <div className="rounded-2xl border border-neutral-200 p-0">
          {total ? (
            <ul className="max-h-[50vh] overflow-y-auto divide-y divide-neutral-200">
              {gameHistory.map(game => {
                const isWin = game.result
                return (
                  <li
                    key={game.id}
                    className={`${
                      isWin ? "bg-green-200/60" : "bg-rose-300/60"
                    } px-4 py-3`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <b className="block truncate">
                          {user.displayName || user.username} vs.{" "}
                          {game.opponent.displayName || game.opponent.username}
                        </b>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {isWin ? game.score[0] : game.score[1]} -{" "}
                          {isWin ? game.score[1] : game.score[0]}
                        </p>
                        <p
                          className={`${
                            isWin ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {isWin ? "+" : "-"}
                          {game.elo}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-neutral-500">
              <p>No game found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Nameplate({ user }: PropsWithChildren<{ user: TUser }>) {
  return (
    <p className="text-lg">
      <span className="block text-2xl font-semibold">
        {user.displayName || user.username}
      </span>
      <span className="text-neutral-500">#{user.username}</span>
      <br />
      <span className="text-neutral-500">{user.id}</span>
    </p>
  )
}
