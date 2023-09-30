import { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { room, roomPayload, user } from '../types'
import { Modal } from '../components/Modal'
import GroupCreation from '../components/forms/GroupCreation'
import { deleteRoom } from '../api/room'

export default function RoomList() {
  const { user, rooms } = useContext(UserContext)
  const [modal, setModal] = useState(false)


  return (
    <>
      <h1>Rooms</h1>
      {user ?
        <>
          <button onClick={() => {
            setModal(true)
          }}>Create Room</button>
          <ul>

            {rooms && rooms.userRooms.map((room: room) => {
              return (
                <li key={room.id}>
                  <RoomIndex room={room} user={user} />
                </li>
              )
            })}
          </ul>
          <Modal isActive={[modal, setModal]}>
            <GroupCreation setModal={setModal} />
          </Modal>
        </> :
        <p>Please sign in to see the rooms</p>
      }
    </>
  )
}



function RoomIndex({ room, user }: { room: room, user: user }) {
  const { reloadRooms } = useContext(UserContext)

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
    reloadRooms()
  }

  return (
    <>
      {/* <img src={room.avatar} alt="" /> */}
      <p><b>{room.name}</b> creator: <i>{room.creator}</i></p>
      {room.creator === user.username ?
        <button onClick={() => {
          handleDelete(room)
        }}>Delete Room</button>
        : null
      }
    </>
  )
}