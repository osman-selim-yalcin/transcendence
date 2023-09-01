import { useEffect, useState } from "react"
import { getAllUsers } from "../../api"
import {
  addFriend,
  getAllFriends,
  isFriend,
  removeFriend
} from "../../api/friend"
import { typeAllRooms, typeUser } from "../../types"
import List from "../List"
import { startRoom } from "../../api/room"
import { createNotification } from "../../api/notification"
import { socket } from "../../context/WebsocketContext"
import { getTime } from "../../functions"

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
      getAllUsers(setAllUsers)
	  getAllFriends(setFriends)
  }, [])


  useEffect(() => {

      setData(friends)
      setButtons(friendsButtons)
  }, [friends])

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

    // const tmp = await createNotification(
    //   "content yapılacak",
    //   friend.username,
    //   "addFriend"
    // )
    // if (!tmp) return
    // socket.emit("notification", {
    //   type: "addFriend",
    //   owner: friend.username,
    //   content: "content yapılacak",
    //   createdAt: new Date().toLocaleString("tr-TR", {
    //     timeZone: "Europe/Istanbul"
    //   }),
    //   to: friend.sessionID
    // })
    console.log(friends)
    const r = await addFriend(friend.username)
    if (!r) return
    friends.push(friend)
    setFriends([...friends])
  }

  const handleRemoveFriend = (event: React.MouseEvent, friend: typeUser) => {
    event.stopPropagation()
    removeFriend(friend.username)
    console.log("here", friends)
    const tmpFriends = friends.filter(item => item.id !== friend.id)
    console.log("tmpfriends", tmpFriends)
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

  const osman = () => {
		console.log(friends);
	  }

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => {
        const dialogDimensions = dialogRef.current.getBoundingClientRect()
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          dialogRef.current.close()
        }
      }}
    >
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
		  <div onClick={osman}>OSMAN DENEME</div>
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
