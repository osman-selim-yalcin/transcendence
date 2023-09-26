import { useEffect, useState } from "react"
import { getUser, getUsers } from "../api/user"
import { user } from "../types"
import { getRooms } from "../api/room"


type userPayload = {
  username: string
}

const useInitial = () => {
  const [user, setUser] = useState<userPayload>(null)
  const [users, setUsers] = useState([])
  const [rooms, setRooms] = useState([])

  useEffect(() => {

    if (localStorage.getItem("token")) {
      console.log("there is TOKEN")
    }

    async function getInitialData() {

      getUser()
      .then((response: any) => {
        console.log("current user ", response, "but user is", user)
        setUser(response)
      
        if (response !== undefined) {
          getUsers()
          .then((response: { users: user[], friends: user[] }) => {
            setUsers(response.users)
          })
          .catch((err: any) => {
            console.log(err)
          })
          
          getRooms()
          .then((response) => {
            console.log("rooms response", response)
          })
          .catch((err: any) => {
            console.log(err)
          })
        }
      })
      .catch((err: any) => {
        console.log("Error occurred while getting user information:", err)
      })

    }
    
    getInitialData()

  }, [])

  return { user, setUser, users, setUsers, rooms, setRooms }
}

export default useInitial