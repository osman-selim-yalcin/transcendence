import { useContext, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getUsers } from "../../api/user"
import { user } from "../../types"
import { UserContext } from "../../context/UserContext"
import "./UserList.scss"
import { addFriend } from "../../api/friend"

export default function UserList() {
  const [search, setSearch] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const [users, setUsers] = useState(null)
  const { user, friends } = useContext(UserContext)

  useEffect(() => {
    const queryParam = searchParams.get("q")
    console.log("!", searchParams.get("q"), "!")
    if (queryParam !== null && queryParam !== "") {
      setSearch(queryParam)
    }
  }, [])

  useEffect(() => {
    const params = {
      "q": search
    }
    if (search !== "") {
      setSearchParams(params)
      getUsers(search)
        .then((response: user[]) => {
          setUsers(response.filter((singleUser) => user.id !== singleUser.id))
        })
    } else {
      setUsers(null)
    }
    console.log("deneme")
  }, [search])

 function isFriendId(id: number) {
  const found = friends.find((friend) => friend.id === id)
  return found === undefined ? false : true;
 }

  return (
    <>
      <h3>Users</h3>
      {user ?
        <>
          <input onChange={(e) => {
            setSearch(e.target.value)
            setSearchParams()
          }} type="text" value={search} />
          <h2>User List</h2>
          {users ?
            <>
              {users.length ?
                <ul>
                  {users.map((singleUser: user) => (
                    singleUser.id !== user.id &&
                    <li key={singleUser.id}>
                      <UserIndex user={singleUser} isFriend={isFriendId(singleUser.id)} />
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
    </>
  )
}

function UserIndex({ user, isFriend }: { user: user, isFriend: boolean }) {
  const { reloadFriends } = useContext(UserContext)
  return (
    <>
      <p>
        {user.username} - {user.id}
      </p>
      {!isFriend && 
      <button onClick={async () => {
        await addFriend({ id: user.id })// to be changed
        reloadFriends()
      }}>Add friend</button>
      }
    </>
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