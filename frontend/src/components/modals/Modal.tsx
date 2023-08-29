import { useEffect, useState } from "react"
import { getAllUsers } from "../../api"
import { addFriend, getAllFriends, removeFriend } from "../../api/friend"
import { typeAllRooms, typeUser } from "../../types"
import List from "../List"
import { startRoom } from "../../api/room"

export default function Modal({
  dialogRef,
  allRooms,
  setAllRooms,
  handleStartRoom
}: any) {
  const [allUsers, setAllUsers] = useState<typeUser[]>([])
  const [friends, setFriends] = useState<typeUser[]>([])
  const [data, setData] = useState<typeUser[]>([])
  const [buttons, setButtons] = useState([])

  useEffect(() => {
    const handle = async () => {
      const friends = await getAllFriends(setFriends)
      getAllUsers(setAllUsers)
      setData(friends)
      setButtons(friendsButtons)
    }
    handle()
  }, [])

  const handleCreateRoom = async (friend: typeUser, id: number) => {
    const room = await startRoom(friend.username)

    handleStartRoom(friend, room.id)
    dialogRef.current.close()
    if (allRooms.find((item: typeAllRooms) => item.id === room.id) || !room.id)
      return

    setAllRooms([...allRooms, room])
  }

  const handleAddFriend = async (
    event: React.MouseEvent,
    friend: typeUser,
    id: number
  ) => {
    event.stopPropagation()
    const r = await addFriend(friend.username)
    if (!r) return
    friends.push(friend)
    setFriends([...friends])
  }

  const handleRemoveFriend = async (
    event: React.MouseEvent,
    friend: typeUser,
    id: number
  ) => {
    event.stopPropagation()
    removeFriend(friend.username)
    const index = friends.findIndex((item: typeUser) => item.id === friend.id)
    friends.splice(index, 1)
    setFriends([...friends])
  }

  const allUserButtons = [
    {
      name: "Add Friend",
      action: handleAddFriend
    }
  ]

  const friendsButtons = [
    {
      name: "Remove Friend",
      action: handleRemoveFriend
    }
  ]

  const handleListData = (data: typeUser[], buttons: any) => {
    setData(data)
    setButtons(buttons)
  }

  return (
    <dialog ref={dialogRef}>
      <div className="modal">
        <div className="modal_swaps">
          <div
            className="modal_swaps_item"
            onClick={() => {
              handleListData(friends, friendsButtons)
            }}
          >
            Friends
          </div>
          <div
            className="modal_swaps_item"
            onClick={() => {
              handleListData(allUsers, allUserButtons)
            }}
          >
            All Users
          </div>
          <div className="modal_swaps_item" onClick={() => {}}>
            Groups (disabled)
          </div>
        </div>
        <input placeholder="search bar" className="modal_search"></input>
        <div className="list">
          {data?.map((item: typeUser) => (
            <List
              status={item.status}
              key={item.id}
              name={item.username}
              avatar={item.avatar}
              user={item}
              item={item}
              mainButton={handleCreateRoom}
              buttons={buttons}
            />
          ))}
        </div>
        <div className="modal_buttons">
          <button
            onClick={() => dialogRef.current.close()}
            className="modal_buttons_item"
          >
            Close Modal
          </button>
        </div>
      </div>
    </dialog>
  )
}
