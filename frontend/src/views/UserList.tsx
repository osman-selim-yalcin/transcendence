import { useContext, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getUsers } from "../api/user"
import { user } from "../types"
import { UserContext } from "../context/UserContext"

export default function UserList() {
  const [search, setSearch] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const [users, setUsers] = useState(null)
  const { user } = useContext(UserContext)

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
          setUsers(response)
        })
    } else {
      setUsers(null)
    }
    console.log("deneme")
  }, [search])

  return (
    <>
      <h1>Users</h1>
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
                  {users.map((user: user) => (
                    <li key={user.id}>
                      <UserIndex user={user} />
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

function UserIndex({ user }: { user: user }) {
  return (
    <>
      {user.username} - {user.id}
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