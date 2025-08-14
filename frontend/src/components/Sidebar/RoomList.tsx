import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { getRooms } from "../../api/room"
import { UserContext } from "../../context/UserContext"
import { room } from "../../types"
import LoadIndicator from "../LoadIndicator"
import GroupCreation from "../forms/GroupCreation"
import GroupJoin from "../forms/GroupJoin"

export default function UserRoomList() {
  const { user, userRooms } = useContext(UserContext)
  const [modal, setModal] = useState(false)

  return (
    <div className="w-full min-w-full overflow-y-scroll p-4 flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Rooms</h3>

      {user ? (
        <>
          <button
            onClick={() => setModal(true)}
            className="self-start rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100"
          >
            Create Room
          </button>

          {userRooms ? <RoomFilter /> : <LoadIndicator />}

          {/* MUI Dialog: Create Room */}
          <Dialog
            open={modal}
            onClose={() => setModal(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Create Room</DialogTitle>
            <DialogContent dividers>
              <GroupCreation setModal={setModal} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModal(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <p className="text-neutral-600">Sign in to see the rooms</p>
      )}
    </div>
  )
}

function RoomFilter() {
  const [search, setSearch] = useState("")
  const [rooms, setRooms] = useState<room[] | null>(null)
  const [modal, setModal] = useState(false)
  const [clickedRoom, setClickedRoom] = useState<room | null>(null)

  useEffect(() => {
    if (search !== "") {
      getRooms(search).then((response: room[]) => setRooms(response))
    } else {
      setRooms(null)
    }
  }, [search])

  useEffect(() => {
    if (clickedRoom) setModal(true)
  }, [clickedRoom])

  useEffect(() => {
    if (!modal) setClickedRoom(null)
  }, [modal])

  return (
    <>
      <h4 className="text-lg font-medium">Search Rooms</h4>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Type a room name…"
        className="w-full max-w-md rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
      />

      {rooms ? (
        rooms.length ? (
          <ul className="list-none p-4">
            {rooms.map(room => (
              <li
                key={room.id}
                className="flex items-center gap-4 border-b border-neutral-300 pb-4 mb-4 h-[8vh] max-h-[100px]"
              >
                <UserRoomIndex
                  room={room}
                  setClickedRoom={setClickedRoom}
                  setModal={setModal}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-600">No room found with the given input</p>
        )
      ) : (
        <p className="text-neutral-600">Type something to search</p>
      )}

      {/* MUI Dialog: Join/Invite to Room */}
      <Dialog
        open={modal}
        onClose={() => setModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {clickedRoom ? `Invite / Join: ${clickedRoom.name}` : "Room"}
        </DialogTitle>
        <DialogContent dividers>
          <GroupJoin
            room={clickedRoom}
            setModal={setModal}
            setSearch={setSearch}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function UserRoomIndex({
  room,
  setClickedRoom,
  setModal
}: {
  room: room
  setClickedRoom: (r: room) => void
  setModal: (b: boolean) => void
}) {
  return (
    <>
      <div className="h-full aspect-square">
        <img
          src={room.avatar}
          alt=""
          className="h-full w-full rounded-full object-cover"
        />
      </div>

      <p className="flex-1 text-sm md:text-base">
        <b>Name:</b> {room.name} &nbsp;|&nbsp; <b>Creator:</b>{" "}
        <i>{room.creator}</i>
      </p>

      <button
        onClick={() => {
          setClickedRoom(room)
          setModal(true)
        }}
        className="ml-auto rounded-md border border-neutral-300 px-3 py-2 text-lg leading-none hover:bg-neutral-100"
        aria-label="More"
      >
        &#8942;
      </button>
    </>
  )
}
