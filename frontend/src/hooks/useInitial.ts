import { useEffect, useState } from "react"
import { getUser } from "../api/user"
import { room, user } from "../types"
import { getUserRooms } from "../api/room"
import { getFriends } from "../api/friend"


const useInitial = () => {
  const [user, setUser] = useState<user>(null)
  const [friends, setFriends] = useState<user[]>(null)
  const [userRooms, setUserRooms] = useState<room[]>(null)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      console.log("there is TOKEN")
    }

    async function getInitialData() {
      getUser()
        .then((response: any) => {
          // console.log("current user ", response, "but user is", user)
          setUser(response)

          if (response !== undefined) {
            getFriends()
              .then((response: user[]) => {
                setFriends(response)
              })
              .catch((err: any) => {
                console.log(err)
              })

            getUserRooms()
              .then(response => {
                setUserRooms(response)
                console.log("user room response", response)
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

  return {
    user,
    setUser,
    friends,
    setFriends,
    userRooms,
    setUserRooms
  }
}

export default useInitial
