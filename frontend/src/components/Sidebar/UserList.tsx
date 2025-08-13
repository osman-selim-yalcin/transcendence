import { PropsWithChildren, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { addFriend } from "../../api/friend"
import { createRoom, sendInvite } from "../../api/room"
import { getUsers } from "../../api/user"
import { UserContext } from "../../context/UserContext"
import {
  NotificationStatus,
  NotificationType,
  room as TRoom,
  user as TUser,
  UserListType
} from "../../types"

export default function UserList({
  userListType,
  room,
  setModal
}: PropsWithChildren<{
  userListType: UserListType
  room?: TRoom
  setModal?: (v: boolean) => void
}>) {
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState<TUser[] | null>(null)
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (search !== "" && user) {
      getUsers(search).then((response: TUser[]) => {
        setUsers(response.filter(singleUser => user.id !== singleUser.id))
      })
    } else {
      setUsers(null)
    }
  }, [search, user])

  return (
    <div className="user-list w-full min-w-full p-4 flex flex-col gap-3">
      <h3 className="text-xl font-semibold">
        {userListType === UserListType.ADD_FRIEND && "Add a new friend"}
        {userListType === UserListType.INVITE_USER && (
          <>
            Invite a user to <i>{room?.name}</i>
          </>
        )}
        {userListType === UserListType.NEW_MESSAGE &&
          "Start chatting with someone"}
      </h3>

      {user ? (
        <>
          <input
            onChange={e => setSearch(e.target.value)}
            type="text"
            value={search}
            placeholder="Search users…"
            className="self-start w-full max-w-md rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
          />

          <h4 className="text-lg font-medium mt-2">User List</h4>

          {users ? (
            users.length ? (
              <UserListConsumer
                users={users}
                userListType={userListType}
                room={room}
                setModal={setModal}
              />
            ) : (
              <p className="text-neutral-600">
                No user found with the given input
              </p>
            )
          ) : (
            <p className="text-neutral-600">Type something to search</p>
          )}
        </>
      ) : (
        <p className="text-neutral-600">Sign in to see other users</p>
      )}
    </div>
  )
}

function UserListConsumer({
  users,
  userListType,
  room,
  setModal
}: PropsWithChildren<{
  users: TUser[]
  userListType: UserListType
  room?: TRoom
  setModal?: (v: boolean) => void
}>) {
  const { user } = useContext(UserContext)
  return (
    <ul className="space-y-3">
      {users.map(
        (singleUser: TUser) =>
          singleUser.id !== user.id && (
            <li key={singleUser.id} className="pb-3 border-b last:border-b-0">
              <p className="font-medium">
                <b>{singleUser.displayName || singleUser.username}</b>
                <span className="text-neutral-500"> — {singleUser.id}</span>
              </p>

              {userListType === UserListType.ADD_FRIEND && (
                <AddFriendIndexContent userId={singleUser.id} />
              )}

              {userListType === UserListType.INVITE_USER && room && (
                <InviteUserIndexContext userId={singleUser.id} room={room} />
              )}

              {userListType === UserListType.NEW_MESSAGE && setModal && (
                <NewMessageIndexContext
                  otherUser={singleUser}
                  setModal={setModal}
                />
              )}
            </li>
          )
      )}
    </ul>
  )
}

export function AddFriendIndexContent({ userId }: { userId: number }) {
  const { friends, notifications } = useContext(UserContext)

  const isFriendId = (id: number) =>
    Boolean(friends?.some((f: TUser) => f.id === id))

  const isFriendRequestPending = (id: number) =>
    Boolean(
      notifications?.some(
        n =>
          n.creator.id === id &&
          n.type === NotificationType.FRIEND &&
          n.status === NotificationStatus.PENDING
      )
    )

  if (isFriendId(userId)) {
    return <p className="text-green-600">You are friends</p>
  }
  if (notifications && isFriendRequestPending(userId)) {
    return <p className="text-neutral-600">Your request is pending...</p>
  }
  return (
    <button
      onClick={async () => {
        await addFriend({ id: userId })
      }}
      className="mt-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 transition"
    >
      Add friend
    </button>
  )
}

enum inviteState {
  GROUP_MEMBER,
  PENDING,
  INVITE
}

function InviteUserIndexContext({
  userId,
  room
}: {
  userId: number
  room: TRoom
}) {
  const { notifications } = useContext(UserContext)
  const [inviteStatus, setInviteStatus] = useState(inviteState.INVITE)

  useEffect(() => {
    if (isGroupMember()) setInviteStatus(inviteState.GROUP_MEMBER)
    else if (isInvitePending()) setInviteStatus(inviteState.PENDING)
    else setInviteStatus(inviteState.INVITE)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, room?.users, userId])

  function isGroupMember() {
    return Boolean(room.users.find(member => member.id === userId))
  }

  function isInvitePending() {
    return Boolean(
      notifications?.some(
        n =>
          n.type === NotificationType.ROOM &&
          n.status === NotificationStatus.PENDING &&
          n.creator.id === userId
      )
    )
  }

  if (inviteStatus === inviteState.GROUP_MEMBER) {
    return <p className="text-green-600">Already in chat room</p>
  }
  if (inviteStatus === inviteState.PENDING) {
    return <p className="text-neutral-600">Invite is sent and pending</p>
  }
  return (
    <button
      onClick={async () => {
        await sendInvite({ id: room.id, user: { id: userId } })
      }}
      className="mt-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 transition"
    >
      Invite
    </button>
  )
}

function NewMessageIndexContext({
  otherUser,
  setModal
}: {
  otherUser: TUser
  setModal: (v: boolean) => void
}) {
  const { userRooms = [], setUserRooms, user } = useContext(UserContext)
  const navigate = useNavigate()

  async function getPrivateChat(singleUser: TUser) {
    const found = userRooms.find(
      r => !r.isGroup && r.users.some((u: TUser) => u.id === singleUser.id)
    )
    if (found) return found

    const roomPayload = {
      id: 0,
      name: `${user.username}-${singleUser.username}`,
      users: [{ id: singleUser.id }],
      isGroup: false
    }

    const newRoom: TRoom = await createRoom(roomPayload)
    ;(newRoom as any).messages = []
    setUserRooms([...userRooms, newRoom])
    return newRoom
  }

  return (
    <button
      onClick={async () => {
        const r = await getPrivateChat(otherUser)
        setModal(false)
        navigate(`/chat/${r.id}`)
      }}
      className="mt-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 transition"
      title="Start chat"
      aria-label="Start chat"
    >
      &#9998;
    </button>
  )
}
