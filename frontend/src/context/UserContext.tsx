import { PropsWithChildren, createContext } from "react"
import useInitial from "../hooks/useInitial"
import { room, user } from "../types"
import { getUserRooms } from "../api/room"
import { getFriends } from "../api/friend"

export const UserContext = createContext(null)

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
      .then((response: { newAllRooms: room[], userRooms: room[] }) => {
        setUserRooms(response)
      })
  }
  return (
    <UserContext.Provider value={{ user, setUser, friends, userRooms, reloadUserRooms }}>
      {children}
    </UserContext.Provider>
  )
}