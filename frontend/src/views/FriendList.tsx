import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { user } from '../types'

export default function FriendList() {
  const { friends } = useContext(UserContext)
  return (
    <>
      <h1>Friends</h1>
      {!friends?.length ? "No data" : friends.map((item: user, index: number) => (
        <li key={index}>
          <UserIndex user={item} />
        </li>
      ))}
    </>
  )
}

function UserIndex({ user }: { user: user }) {
  return (
    <>
      {user.username} - <small>{user.status}</small>
    </>
  )
}