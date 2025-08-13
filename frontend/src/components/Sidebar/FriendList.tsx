import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { deleteFriend } from "../../api/friend"
import { createRoom } from "../../api/room"
import { UserContext } from "../../context/UserContext"
import { room as TRoom, user as TUser } from "../../types"
import LoadIndicator from "../LoadIndicator"

export default function FriendList({
  setBarActive
}: {
  setBarActive: (v: boolean) => void
}) {
  const { user, friends } = useContext(UserContext)

  return (
    <div className="w-full min-w-full overflow-y-auto p-4">
      <h3 className="text-xl font-semibold mb-4">Friends</h3>

      {user ? (
        friends ? (
          friends.length ? (
            <ul className="space-y-3">
              {friends.map((item: TUser, index: number) => (
                <li key={index} className="pb-4 border-b last:border-b-0">
                  <FriendIndex
                    singleFriend={item}
                    setBarActive={setBarActive}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-600">You have no friend to display</p>
          )
        ) : (
          <LoadIndicator />
        )
      ) : (
        <p className="text-neutral-600">Sign in to see your friends</p>
      )}
    </div>
  )
}

function FriendIndex({
  singleFriend,
  setBarActive
}: {
  singleFriend: TUser
  setBarActive: (v: boolean) => void
}) {
  const { userRooms = [], setUserRooms, user } = useContext(UserContext)
  const navigate = useNavigate()

  async function getPrivateChat(friend: TUser): Promise<TRoom> {
    // Var olan 1-1 odayı bul
    const found = userRooms.find(
      r => !r.isGroup && r.users.some(u => u.id === friend.id)
    )
    if (found) return found

    // Yoksa oluştur
    const roomPayload = {
      id: 0,
      name: `${user.username}-${friend.username}`,
      users: [{ id: friend.id }],
      isGroup: false
    }

    const newRoom: TRoom = await createRoom(roomPayload)
    ;(newRoom as any).messages = [] // mevcut yapıya uyum
    setUserRooms([...userRooms, newRoom])
    return newRoom
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {singleFriend.displayName || singleFriend.username}
          <small className="ml-2 text-neutral-500 font-normal">
            — {singleFriend.status}
          </small>
        </p>
      </div>

      <button
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 transition"
        onClick={async () => {
          const room = await getPrivateChat(singleFriend)
          setBarActive(false)
          navigate(`/chat/${room.id}`)
        }}
      >
        Chat
      </button>

      <button
        className="rounded-md border border-red-300 text-red-600 px-3 py-1.5 text-sm hover:bg-red-50 transition"
        onClick={async () => {
          await deleteFriend({ id: singleFriend.id })
          // Not: Listeden düşürme işlemi UserContext içinde yapılmalı (örn. friends'i yeniden fetch)
        }}
      >
        Remove Friend
      </button>
    </div>
  )
}
