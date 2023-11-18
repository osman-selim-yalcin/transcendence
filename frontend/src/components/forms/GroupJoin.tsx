import { PropsWithChildren, useContext, useState } from "react";
import { room, roomPayload } from "../../types";
import { deleteRoom, joinRoom } from "../../api/room";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { PopUpContext } from "../../context/PopUpContext";

export default function GroupJoin({ room, setModal, setSearch }: PropsWithChildren<{ room: room, setModal: Function, setSearch: Function }>) {
  const [password, setPassword] = useState("")
  const { user, userRooms, reloadUserRooms } = useContext(UserContext)
  const { addPopUp } = useContext(PopUpContext)
  const navigate = useNavigate()

  async function handleDelete(room: room) {
    const payload: roomPayload = {
      id: room.id,
      users: [],
      name: room.name,
      isGroup: room.isGroup
    }
    return deleteRoom(payload)
      .then((response) => {
        console.log("delete response:", response)
      })
  }
  return (
    <>
      {room &&
        <div className="group-name">
          <h3>{room.name}</h3>
          <p><b>Creator:</b> {room.creator}</p>
          {!room.isInviteOnly &&
            <>
              {!userRooms.find((userRoom) => (userRoom.id === room.id)) &&
                <>
                  {room.password &&
                    <div>
                      <b>Password:</b> <input type="password" value={password} onChange={(e) => {
                        setPassword(e.target.value)
                      }} />
                    </div>
                  }
                  <button onClick={async () => {
                    setPassword("")
                    const res = await joinRoom({ id: room.id, password: password === "" ? null : password })
                    if (res.response?.data.message === "password uncorrect") {
                      addPopUp("Incorrect password")
                    } else {
                      await reloadUserRooms()
                      setModal(false)
                      navigate(`/chat/${room.id}`)
                    }
                  }}>Join</button>
                </>
              }
              {room.creator === user.username &&
                <button onClick={async () => {
                  await handleDelete(room)
                  setSearch("")
                  setModal(false)
                }}>Delete Room</button>
              }
            </>}
        </div>
      }
    </>
  )
}
