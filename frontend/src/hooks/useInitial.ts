import { useEffect, useState } from "react"
import { getUser } from "../api/user"
import { room, user } from "../types"
import { getUserRooms } from "../api/room"
import { getFriends } from "../api/friend"
import { getNotifications } from "../api/notification"


const useInitial = () => {
  const [user, setUser] = useState<user>(null)
  const [friends, setFriends] = useState<user[]>(null)
  const [userRooms, setUserRooms] = useState<room[]>(null)
  const [notifications, setNotifications] = useState(null)

  useEffect(() => {
    async function getInitialData() {
      getUser()
        .then((response: any) => {
          console.log("current user ", response, "but user is", user)
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
              })
              .catch((err: any) => {
                console.log(err)
              })

            getNotifications()
              .then(response => {
                setNotifications(response)
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
    setUserRooms,
    notifications,
    setNotifications
  }
}

export default useInitial
