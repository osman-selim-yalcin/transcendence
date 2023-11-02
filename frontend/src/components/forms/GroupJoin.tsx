import { PropsWithChildren, useContext, useState } from "react";
import { room, roomPayload } from "../../types";
import { deleteRoom, joinRoom } from "../../api/room";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function GroupJoin({ room, setModal }: PropsWithChildren<{ room: room, setModal: Function }>) {
  const [password, setPassword] = useState("")
  const { user, userRooms, reloadUserRooms } = useContext(UserContext)
  const navigate = useNavigate()

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
      {room &&
        <div className="group-name">
          <h3>{room.name}</h3>
          <p><b>Creator:</b> {room.creator}</p>
          {!room.isInviteOnly &&
            <>
              {room.password &&
                <div>
                  <b>Password:</b> <input type="password" value={password} onChange={(e) => {
                    setPassword(e.target.value)
                  }} />
                </div>
              }
              {!userRooms.find((userRoom) => (userRoom.id === room.id))  &&
                <button onClick={async () => {
                  await joinRoom({ id: room.id })
                  await reloadUserRooms()
                  setModal(false)
                  navigate(`/chat/${room.id}`)
                }}>Join</button>
              }
              {room.creator === user.username &&
                <button onClick={() => {
                  handleDelete(room)
                }}>Delete Room</button>
              }
            </>}
        </div>
      }
    </>
  )
}
