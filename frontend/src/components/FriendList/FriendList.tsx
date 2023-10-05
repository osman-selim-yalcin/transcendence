import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { user } from '../../types'
import "./FriendList.scss"
import { deleteFriend } from '../../api/friend'
import LoadIndicator from '../LoadIndicator/LoadIndicator'

export default function FriendList() {
  const { user, friends } = useContext(UserContext)
  return (
    <div className={"friend-list"}>
      <h3>Friends</h3>
      {user ?
        (friends ?
          <>
            {friends.length ?
              <ul>
                {friends.map((item: user, index: number) => (
                  <li className={"friend-index"} key={index}>
                    <FriendIndex user={item} />
                  </li>
                ))}
              </ul>
              :
              <p>You have no friend to display</p>
            }
          </>
          :
          <LoadIndicator />
        )
        :
        <p>Sign in to see your friends</p>
      }
    </div>
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