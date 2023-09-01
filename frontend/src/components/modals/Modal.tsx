import { useEffect, useState } from "react"
import { getAllUsers } from "../../api"
import { addFriend, getAllFriends, removeFriend } from "../../api/friend"
import { typeAllRooms, typeUser } from "../../types"
import List from "../List"
import { startRoom } from "../../api/room"
import { createNotification } from "../../api/notification"

export default function Modal({
  dialogRef,
  allRooms,
  setAllRooms,
  handleStartRoom
}: {
  dialogRef: any
  allRooms: typeAllRooms[]
  setAllRooms: Function
  handleStartRoom: Function
}) {
  const [allUsers, setAllUsers] = useState<typeUser[]>([])
  const [friends, setFriends] = useState<typeUser[]>([])
  const [data, setData] = useState<typeUser[]>([])
  const [buttons, setButtons] = useState([])

  useEffect(() => {
    const handle = async () => {
      const tmp = await getAllFriends(setFriends)
      getAllUsers(setAllUsers)
      setData(tmp)
      setButtons(friendsButtons)
    }
    handle()
  }, [])

  const handleCreateRoom = async (friend: typeUser) => {
    const allRoom: typeAllRooms = await startRoom(friend.username)

    handleStartRoom(allRoom.room, [friend])
    dialogRef.current.close()
    if (
      allRooms.find(
        (item: typeAllRooms) => item.room.roomID === allRoom.room.roomID
      ) ||
      !allRoom.room.roomID
    )
      return

    setAllRooms([...allRooms, allRoom])
  }

  const handleAddFriend = async (event: React.MouseEvent, friend: typeUser) => {
    event.stopPropagation()
    createNotification("content yapılacak", friend.username, "addFriend")
    // console.log(friends)
    // const r = await addFriend(friend.username)
    // if (!r) return
    // friends.push(friend)
    // setFriends([...friends])
  }

  const handleRemoveFriend = (event: React.MouseEvent, friend: typeUser) => {
    event.stopPropagation()
    removeFriend(friend.username)
    console.log("here", friends)
    const tmpFriends = friends.filter(item => item.id !== friend.id)
    console.log(tmpFriends)
    setFriends(tmpFriends)
    setData(tmpFriends)
  }

  const allUserButtons = [
    {
      name: "Add Friend",
      action: (event: any, friend: typeUser) => handleAddFriend(event, friend)
    }
  ]

  const friendsButtons = [
    {
      name: "Remove Friend",
      action: (event: any, friend: typeUser) =>
        handleRemoveFriend(event, friend)
    }
  ]

  const handleListData = (data: typeUser[], buttons: any) => {
    console.log(data)
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
          {!data?.length && <div className="list_item">No data</div>}
          {data?.map((item: typeUser) => (
            <List
              status={item.status}
              key={item.id}
              name={item.username}
              avatar={item.avatar}
              users={[item]}
              item={item}
              mainButton={() => handleCreateRoom(item)}
              buttons={buttons.map((button: any) => {
                return {
                  name: button.name,
                  action: (event: any) => button.action(event, item)
                }
              })}
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
