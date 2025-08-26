import { PropsWithChildren, createContext } from "react"
import { getFriends } from "../api/friend"
import { getNotifications } from "../api/notification"
import { getUserRooms } from "../api/room"
import useInitial from "../hooks/useInitial"
import { notification, room, user, userContext } from "../types"

export const UserContext = createContext<userContext>(null)

export default function UserProvider({ children }: PropsWithChildren) {
  const {
    user,
    setUser,
    friends,
    setFriends,
    userRooms,
    setUserRooms,
    notifications,
    setNotifications
  } = useInitial()

  async function reloadFriends() {
    getFriends().then((response: user[]) => {
      setFriends(response)
    })
  }
  async function reloadUserRooms() {
    getUserRooms().then((response: room[]) => {
      setUserRooms(response)
    })
  }
  async function reloadNotifications() {
    getNotifications().then((response: notification[]) => {
      setNotifications(response)
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        friends,
        reloadFriends,
        userRooms,
        setUserRooms,
        reloadUserRooms,
        notifications,
        reloadNotifications
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
