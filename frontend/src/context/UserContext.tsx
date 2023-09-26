import { PropsWithChildren, createContext } from "react"
import useInitial from "../hooks/useInitial"

export const UserContext = createContext(null)

export default function UserProvider({ children }: PropsWithChildren) {
  const { user, setUser, users, setUsers, rooms, setRooms } = useInitial()

  return (
      <UserContext.Provider value={{user, setUser, users, setUsers, rooms, setRooms}}>
        {children}
      </UserContext.Provider>
  )
}