import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getUsers } from "../api/user"
import { user } from "../types"

export default function UserList() {
  const [search, setSearch] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const [users, setUsers] = useState(null)

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
        .then((response) => {
          if (response !== undefined) {
            setUsers(response)
          }
        })
    }
    console.log("deneme")
  }, [search])

  return (
    <>
      <h1>Users</h1>
      <input onChange={(e) => {
        setSearch(e.target.value)
        setSearchParams()
      }} type="text" value={search}/>
      <h2>User List</h2>
      <ul>
        {users ? users.map((user: user) => (
          <UserIndex user={user} />
        )) : "Search for users"}
      </ul>
    </>
  )
}

function UserIndex({ user }: { user: user }) {
  return (
    <>
      {user.username}
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