import { useContext, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getUsers } from "../../api/user"
import { NotificationStatus, NotificationType, user } from "../../types"
import { UserContext } from "../../context/UserContext"
import "./UserList.scss"
import { addFriend } from "../../api/friend"

export default function UserList() {
  const [search, setSearch] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const [users, setUsers] = useState(null)
  const { user } = useContext(UserContext)

  useEffect(() => {
    const queryParam = searchParams.get("q")
    if (queryParam !== null && queryParam !== "") {
      setSearch(queryParam)
    }
  }, [])

  useEffect(() => {
    const params = {
      "q": search
    }
    if (search !== "" && user) {
      setSearchParams(params)
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
      <h3>Users</h3>
      {user ?
        <>
          <input onChange={(e) => {
            setSearch(e.target.value)
            setSearchParams()
          }} type="text" value={search} />
          <h4>User List</h4>
          {users ?
            <>
              {users.length ?
                <ul>
                  {users.map((singleUser: user) => (
                    singleUser.id !== user.id &&
                    <li key={singleUser.id}>
                      <UserIndex user={singleUser} />
                    </li>
                  ))}
                </ul>
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

function UserIndex({ user }: { user: user }) {

  return (
    <>
      <p>
        <b>
          {user.username} - {user.id}
        </b>
      </p>
      <IndexContent userId={user.id} />
    </>
  )
}

function IndexContent({ userId }: { userId: number }) {
  const { friends, reloadNotifications, notifications, reloadFriends } = useContext(UserContext)

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
        reloadFriends()
        reloadNotifications()
      }}>Add friend</button>
    )
  }
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