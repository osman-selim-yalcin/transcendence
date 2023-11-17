import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import { room } from '../../types'
import { Modal } from '../Modal/Modal'
import GroupCreation from '../forms/GroupCreation'
import { getRooms } from '../../api/room'
import "./RoomList.scss"
import LoadIndicator from '../LoadIndicator/LoadIndicator'
import GroupJoin from '../forms/GroupJoin'

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
  const [modal, setModal] = useState(false)
  const [clickedRoom, setClickedRoom] = useState(null)

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

  useEffect(() => {
    if (clickedRoom) {
      console.log("clicked:", clickedRoom)
      setModal(true)
    }
  }, [clickedRoom])

  useEffect(() => {
    if (!modal)
      setClickedRoom(null)
  }, [modal])
  


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
                  <UserRoomIndex room={room} setClickedRoom={setClickedRoom} setModal={setModal} />
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
      <Modal isActive={[modal, setModal]} removable={true}>
        <GroupJoin room={clickedRoom} setModal={setModal} />
      </Modal>
    </>
  )
}


function UserRoomIndex({ room, setClickedRoom, setModal }: { room: room, setClickedRoom: Function, setModal: Function }) {

  return (
    <>
      <div className="avatar">
        <img src={room.avatar} alt="" />
      </div>
      <p><b>Name:</b>{room.name} | <b>Creator:</b> <i>{room.creator}</i></p>
      <button onClick={() => {
        setClickedRoom(room)
        setModal(true)
      }}>&#8942;</button>
    </>
  )
}