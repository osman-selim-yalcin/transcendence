import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import { room, roomPayload, user } from '../../types'
import { Modal } from '../Modal/Modal'
import GroupCreation from '../forms/GroupCreation'
import { deleteRoom, getRooms } from '../../api/room'
import "./RoomList.scss"
import LoadIndicator from '../LoadIndicator/LoadIndicator'

export default function UserRoomList() {
  const { user, userRooms } = useContext(UserContext)
  const [modal, setModal] = useState(false)


  return (
    <div className={"room-list"}>
      <h3>Rooms</h3>
      {user ?
        <>
          <button onClick={() => {
            setModal(true)
          }}>Create Room</button>
          {userRooms ?
            <>
              <RoomFilter />
            </>
            :
            <LoadIndicator />
          }
          <Modal isActive={[modal, setModal]} removable={true}>
            <GroupCreation setModal={setModal} />
          </Modal>
        </>
        :
        <p>Sign in to see the rooms</p>
      }
    </div>
  )
}


function RoomFilter() {
  const [search, setSearch] = useState("")
  const [rooms, setRooms] = useState<room[]>(null)

  useEffect(() => {
    if (search !== "") {
      getRooms(search)
        .then((response: room[]) => {
          setRooms(response)
        })
    } else {
      setRooms(null)
    }

  }, [search])


  return (
    <>
      <h4>Search Rooms</h4>
      <input type="text" value={search} onChange={(e) => {
        setSearch(e.target.value)
      }} />
      {rooms ?
        <>
          {rooms.length ?
            <ul className={"room-ul"}>
              {rooms.map((room) => (
                <li key={room.id}>
                  <UserRoomIndex room={room} />
                </li>
              ))}
            </ul>
            :
            <p>No room found with the given input</p>
          }
        </>
        :
        <p>Type something to search</p>
      }
    </>
  )
}


function UserRoomIndex({ room }: { room: room }) {
  const { reloadUserRooms } = useContext(UserContext)
  const { user } = useContext(UserContext)

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
      <div className="avatar">
        <img src={room.avatar} alt="" />
      </div>
      <p><b>Name:</b>{room.name} | <b>Creator:</b> <i>{room.creator}</i></p>
      {room.creator === user.username ?
        <button onClick={() => {
          handleDelete(room)
        }}>Delete Room</button>
        : null
      }
    </>
  )
}