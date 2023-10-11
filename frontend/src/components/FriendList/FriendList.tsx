import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { user } from '../../types'
import "./FriendList.scss"
import { deleteFriend } from '../../api/friend'
import LoadIndicator from '../LoadIndicator/LoadIndicator'
import { createRoom } from '../../api/room'
import { redirect, useNavigate } from 'react-router-dom'

export default function FriendList({ setBarActive }: { setBarActive: Function }) {
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
                    <FriendIndex singleFriend={item} setBarActive={setBarActive} />
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

function FriendIndex({ singleFriend, setBarActive }: { singleFriend: user, setBarActive: Function }) {
  const { reloadFriends, userRooms, setUserRooms, user } = useContext(UserContext)
  const navigate = useNavigate()

  async function getPrivateChat(friend: user) {
    const found = userRooms.find((room) => (!room.isGroup && (room.users.find((chatMember) => (chatMember.id === friend.id)) !== undefined)))
    if (found !== undefined) {
      console.log("we've found the room!")
      return found
    }
    console.log("no such room is found")
    const roomPayload = {
      id: 0,
      name: user.username + "-" + friend.username,
      users: [{ id: user.id },
              { id: friend.id}
      ],
      isGroup: false
    }

    const newRoom = await createRoom(roomPayload)
    newRoom["messages"] = []
    setUserRooms([...userRooms, newRoom])
    return newRoom
  }

  return (
    <>
      <p>
        {singleFriend.username} - <small>{singleFriend.status}</small>
      </p>
      <button onClick={async () => {
        const room = await getPrivateChat(singleFriend)
        setBarActive(false)
        navigate(`/chat/${room.id}`)
      }}>Chat</button>
      <button onClick={async () => {
        await deleteFriend({ id: singleFriend.id })
        reloadFriends()
      }}>Remove Friend</button>
    </>
  )
}