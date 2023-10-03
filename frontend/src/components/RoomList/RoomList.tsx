import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import { room, roomPayload, user } from '../../types'
import { Modal } from '../Modal'
import GroupCreation from '../forms/GroupCreation'
import { deleteRoom } from '../../api/room'
import "./RoomList.scss"

export default function UserRoomList() {
  const { user, userRooms }: { user: user, userRooms: room[] } = useContext(UserContext)
  const [modal, setModal] = useState(false)


  return (
    <>
      <h3>Rooms</h3>
      {user ?
        <>
          <button onClick={() => {
            setModal(true)
          }}>Create Room</button>
          {userRooms ?
            <>
              {userRooms.length ?
                <ul>
                  {userRooms.map((room: room) => {
                    return (
                      <li key={room.id}>
                        <UserRoomIndex room={room} user={user} />
                      </li>
                    )
                  })}
                </ul>
                :
                <p>You do not have any membership in any of the rooms</p>
              }
            </>
            :
            <p>Loading</p>
          }
          <Modal isActive={[modal, setModal]}>
            <GroupCreation setModal={setModal} />
          </Modal>
        </>
        :
        <p>Sign in to see the rooms</p>
      }
    </>
  )
}



function UserRoomIndex({ room, user }: { room: room, user: user }) {
  const { reloadUserRooms } = useContext(UserContext)

  async function handleDelete(room: room) {
    const payload: roomPayload = {
      id: room.id,
      users: [],
      name: room.name,
      isGroup: room.isGroup
    }
    await deleteRoom(payload)
      .then((response) => {
        console.log("delete response:", response)
      })
    reloadUserRooms()
  }

  return (
    <>
      {/* <img src={room.avatar} alt="" /> */}
      <p><b>Name:</b>{room.name} | <b>Creator:</b> <i>{room.creator}</i> | <b>Members:</b> {room.users.map((user: user) => (user.username)).join(", ")}</p>
      {room.creator === user.username ?
        <button onClick={() => {
          handleDelete(room)
        }}>Delete Room</button>
        : null
      }
    </>
  )
}