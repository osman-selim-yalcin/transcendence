import { PropsWithChildren, createContext } from "react"
import useInitial from "../hooks/useInitial"
import { getUsers } from "../api/user"
import { room, user } from "../types"
import { getRooms } from "../api/room"
import { getFriends } from "../api/friend"

export const UserContext = createContext(null)

export default function UserProvider({ children }: PropsWithChildren) {
  const { user, setUser, friends, setFriends, rooms, setRooms } = useInitial()

  // async function reloadUsers() {
  //   getUsers()
  //     .then((response: { users: user[], friends: user[] }) => {
  //       setUsers(response.users)
  //     })
  // }
  async function reloadFriends() {
    getFriends()
      .then((response: user[]) => {
        setFriends(response)
      })
  }
  async function reloadRooms() {
    getRooms()
      .then((response: { newAllRooms: room[], userRooms: room[] }) => {
        setRooms(response)
      })
  }
  return (
    <UserContext.Provider value={{ user, setUser, friends, rooms, reloadRooms }}>
      {children}
    </UserContext.Provider>
  )
}