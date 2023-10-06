import { PropsWithChildren, createContext } from "react"
import useInitial from "../hooks/useInitial"
import { room, user, userContext } from "../types"
import { getUserRooms } from "../api/room"
import { getFriends } from "../api/friend"

export const UserContext = createContext<userContext>(null)

export default function UserProvider({ children }: PropsWithChildren) {
  const { user, setUser, friends, setFriends, userRooms, setUserRooms } = useInitial()

  async function reloadFriends() {
    getFriends()
      .then((response: user[]) => {
        setFriends(response)
      })
  }
  async function reloadUserRooms() {
    getUserRooms()
      .then((response: room[]) => {
        console.log(response)
        setUserRooms(response)
      })
  }
  return (
    <UserContext.Provider value={{ user, setUser, friends, reloadFriends, userRooms, setUserRooms, reloadUserRooms }}>
      {children}
    </UserContext.Provider>
  )
}