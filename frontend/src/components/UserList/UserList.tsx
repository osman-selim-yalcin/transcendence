import { PropsWithChildren, useContext, useEffect, useState } from "react"
import { getUsers } from "../../api/user"
import { NotificationStatus, NotificationType, UserListType, user, room } from "../../types"
import { UserContext } from "../../context/UserContext"
import "./UserList.scss"
import { addFriend } from "../../api/friend"
import { createRoom, sendInvite } from "../../api/room"
import { useNavigate } from "react-router-dom"

export default function UserList({ userListType, room, setModal }: PropsWithChildren<{ userListType: UserListType, room?: room, setModal?: Function }>) {
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState(null)
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (search !== "" && user) {
      getUsers(search)
        .then((response: user[]) => {
          setUsers(response.filter((singleUser) => user.id !== singleUser.id))
        })
    } else {
      setUsers(null)
    }
  }, [search, user])

  return (
    <div className={"user-list"}>
      <h3>
        {userListType === UserListType.ADD_FRIEND && "Add a new friend"}
        {userListType === UserListType.INVITE_USER && (<>Invite a user to <i>{room.name}</i></>)}
        {userListType === UserListType.NEW_MESSAGE && "Start chatting with someone"}
      </h3>
      {user ?
        <>
          <input onChange={(e) => {
            setSearch(e.target.value)
          }} type="text" value={search} />
          <h4>User List</h4>
          {users ?
            <>
              {users.length ?
                <>
                  <UserListConsumer users={users} userListType={userListType} room={room} setModal={setModal} />
                </>
                :
                <p>No user found with the given input</p>
              }
            </>
            :
            <p>Type something to search</p>
          }
        </>
        :
        <p>Sign in to see other users</p>
      }
    </div>
  )
}

function UserListConsumer({ users, userListType, room, setModal }: PropsWithChildren<{ users: user[], userListType: UserListType, room?: room, setModal?: Function }>) {
  const { user } = useContext(UserContext)
  return (
    <ul>
      {users.map((singleUser: user) => (
        singleUser.id !== user.id &&
        <li key={singleUser.id}>
          <p>
            <b>
              {singleUser.displayName || singleUser.username} - {singleUser.id}
            </b>
          </p>
          {userListType === UserListType.ADD_FRIEND && <AddFriendIndexContent userId={singleUser.id} />}
          {userListType === UserListType.INVITE_USER && <InviteUserIndexContext userId={singleUser.id} room={room} />}
          {userListType === UserListType.NEW_MESSAGE && <NewMessageIndexContext otherUser={singleUser} setModal={setModal} />}
        </li>
      ))}
    </ul>
  )
}

export function AddFriendIndexContent({ userId }: PropsWithChildren<{ userId: number }>) {
  const { friends, notifications } = useContext(UserContext)

  function isFriendId(id: number) {
    const found = friends?.find((friend) => friend.id === id)
    return found === undefined ? false : true;
  }

  function isFriendRequestPending(id: number) {
    const found = notifications.find((notification) => (notification.creator.id === id &&
      notification.type === NotificationType.FRIEND &&
      notification.status === NotificationStatus.PENDING))
    return found === undefined ? false : true
  }

  if (isFriendId(userId)) {
    return (
      <p>
        You are friends
      </p>
    )
  } else if (isFriendRequestPending(userId)) {
    return (
      <p>
        Your request is pending...
      </p>
    )
  } else {
    return (
      <button onClick={async () => {
        await addFriend({ id: userId })
      }}>Add friend</button>
    )
  }
}

enum inviteState {
  GROUP_MEMBER,
  PENDING,
  INVITE
}

function InviteUserIndexContext({ userId, room }: PropsWithChildren<{ userId: number, room: room }>) {
  const { notifications } = useContext(UserContext)
  const [inviteStatus, setInviteStatus] = useState(inviteState.INVITE)

  useEffect(() => {
    if (isGroupMember()) {
      setInviteStatus(inviteState.GROUP_MEMBER)
    } else if (isInvitePending()) {
      setInviteStatus(inviteState.PENDING)
    } else {
      setInviteStatus(inviteState.INVITE)
    }
  }, [notifications])

  function isGroupMember() {
    const found = room.users.find((member) => (member.id == userId))
    return found === undefined ? false : true
  }

  function isInvitePending() {
    const found = notifications.find((notification) => (
      notification.type === NotificationType.ROOM &&
      notification.status === NotificationStatus.PENDING) &&
      notification.creator.id === userId)
    return found === undefined ? false : true
  }


  if (inviteStatus === inviteState.GROUP_MEMBER) {
    return (
      <p>
        Already in chat room
      </p>
    )
  } else if (inviteStatus === inviteState.PENDING) {
    return (
      <p>
        Invite is sent and pending
      </p>
    )
  } else {
    return (
      <button onClick={async () => {
        await sendInvite({ id: room.id, user: { id: userId } })
      }}>
        Invite
      </button>
    )
  }
}

function NewMessageIndexContext({ otherUser, setModal }: PropsWithChildren<{ otherUser: user, setModal: Function }>) {
  const { userRooms, setUserRooms, user } = useContext(UserContext)
  const navigate = useNavigate()

  async function getPrivateChat(singleUser: user) {
    const found = userRooms.find((room) => (!room.isGroup && (room.users.find((chatMember) => (chatMember.id === singleUser.id)) !== undefined)))
    if (found !== undefined) {
      console.log("we've found the room!")
      return found
    }
    console.log("no such room is found")
    const roomPayload = {
      id: 0,
      name: user.username + "-" + singleUser.username,
      users: [
        { id: singleUser.id }
      ],
      isGroup: false
    }

    const newRoom = await createRoom(roomPayload)
    newRoom["messages"] = []
    setUserRooms([...userRooms, newRoom])
    return newRoom
  }
  return (
    <button onClick={async () => {
      const room = await getPrivateChat(otherUser)
      setModal(false)
      navigate(`/chat/${room.id}`)
    }}>
      &#9998;
    </button>
  )
}

// event.preventDefault();
// // The serialize function here would be responsible for
// // creating an object of { key: value } pairs from the
// // fields in the form that make up the query.
// let params = serializeFormQuery(event.target);
// setSearchParams(params);
// }

// return (
// <div>
//   <form onSubmit={handleSubmit}>{/* ... */}</form>
// </div>
// );