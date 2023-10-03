import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { user } from '../../types'
import "./FriendList.scss"
import { deleteFriend } from '../../api/friend'

export default function FriendList() {
  const { user, friends }= useContext(UserContext)
  return (
    <>
      <h3>Friends</h3>
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
  const { reloadFriends } = useContext(UserContext)
  return (
    <>
      <p>
        {user.username} - <small>{user.status}</small>
      </p>
      <button onClick={async () => {
        await deleteFriend({ id: user.id })
        reloadFriends()
      }}>Remove Friend</button>
    </>
  )
}