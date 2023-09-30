import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { user } from '../types'

export default function FriendList() {
  const { user, friends }: { user: user, friends: user[] } = useContext(UserContext)

  return (
    <>
      <h1>Friends</h1>
      {user ?
        (friends ?
          <>
            {friends.length ?
              <ul>
                {friends.map((item: user, index: number) => (
                  <li key={index}>
                    <FriendIndex user={item} />
                  </li>
                ))}
              </ul>
              :
              <p>You have no friend to display</p>
            }
          </>
          :
          <p>Loading</p>
        )
        :
        <p>Sign in to see your friends</p>
      }
    </>
  )
}

function FriendIndex({ user }: { user: user }) {
  return (
    <>
      {user.username} - <small>{user.status}</small>
    </>
  )
}