import { Ref, RefObject, useEffect, useRef, useState } from "react"
import { getAllUsers } from "../../api"
import {
  addFriend,
  getAllFriends,
  isFriend,
  removeFriend
} from "../../api/friend"
import { typeAllRooms, typeRoom, typeUser } from "../../types"
import List, { GroupList } from "../List"
import { createGroup, deleteRoom, getGroups, getUsersRooms, startRoom } from "../../api/room"
import { createNotification } from "../../api/notification"
import { socket } from "../../context/WebsocketContext"
import { getTime } from "../../functions"
import GroupCreation from "../forms/GroupCreation"

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
  const [data, setData] = useState<any>([])
  const [buttons, setButtons] = useState([])
  const [groups, setGroups] = useState<typeAllRooms[]>([])
  const [isGroup, setIsGroup] = useState(false)
  const groupFormRef = useRef<HTMLDialogElement>(null)


  useEffect(() => {
    getAllUsers(setAllUsers)
    getAllFriends(setFriends)
    getGroups(setGroups)
  }, [])

  useEffect(() => {
    setData(friends)
    setButtons(friendsButtons)
  }, [friends])

  // useEffect(() => {
  //   console.log("allRooms", allRooms)
  // }, [allRooms])

  const handleCreateRoom = async (friend: typeUser) => {
    const allRoom: typeAllRooms = await startRoom(friend.username)

    handleStartRoom(allRoom.room, allRoom.users)
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

		const r = await addFriend(friend.username)
    if (!r) return
    friends.push(friend)
    setFriends([...friends])
  }

  const handleRemoveFriend = (event: React.MouseEvent, friend: typeUser) => {
    event.stopPropagation()
    removeFriend(friend.username)
    const tmpFriends = friends.filter(item => item.id !== friend.id)
    setFriends(tmpFriends)
    setData(tmpFriends)
  }

  const handleGroupInfo = (event: React.MouseEvent, group: typeAllRooms) => {
    event.stopPropagation()
    console.log(group.room.name + ":", group)
  }

  const handleRemoveGroup = (event: React.MouseEvent, group: typeAllRooms) => {
    event.stopPropagation()
    deleteRoom(group.room.roomID)
    setGroups(groups.filter(item => item.room.roomID !== group.room.roomID))
    setData(groups.filter(item => item.room.roomID !== group.room.roomID))
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

  const groupsButtons = [
    {
      name: "Group Info",
      action: (event: any, group: typeAllRooms) => {
        handleGroupInfo(event, group)
      }
    },
    {
      name: "Delete Group",
      action: (event: any, group: typeAllRooms) => {
        handleRemoveGroup(event, group)
      }
    }
  ]

  const handleListData = (data: any, buttons: any) => {
    setData(data)
    setButtons(buttons)
  }

  const closeModal = (e: any, ref: any) => {
    const dialogDimensions = ref.current.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      ref.current.close()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={e => closeModal(e, dialogRef)}
    >
      <div className="modal">
        <div className="modal_swaps">
          <div
            className="modal_swaps_item"
            onClick={() => {
              handleListData(friends, friendsButtons)
              setIsGroup(false)
            }}
          >
            Friends
          </div>
          <div
            className="modal_swaps_item"
            onClick={() => {
              handleListData(allUsers, allUserButtons)
              setIsGroup(false)
            }}
          >
            All Users
          </div>
          <div className="modal_swaps_item" 
              onClick={() => {
                handleListData(groups, groupsButtons)
                setIsGroup(true)
              }}>
            Groups
          </div>
        </div>
        <input placeholder="search bar" className="modal_search"></input>
        {isGroup ? 
        <div>
          <button
            onClick={() => {groupFormRef.current?.showModal()}}
          >Create Group</button>
        </div> 
        : null}
        <div className="list">
          {!data?.length && <div className="list_item">No data</div>}
          {data?.map((item: any) => (
            isGroup ?
            <GroupList
              key={item.id}
              room={item.room}
              users={item.users}
              messages={item.messages}
              mainButton={null}
              image={"https://source.unsplash.com/featured/300x202"}
              buttons={buttons.map((button: any) => {
                return {
                  name: button.name,
                  action: (event: any) => button.action(event, item)
                }
              })}
            />
            :
            <List
              status={item.status}
              key={item.id}
              name={item.username}
              avatar={item.avatar}
              messages={item.messages}
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
        <dialog
              ref={groupFormRef}
              onClick={e => {
                // e.stopPropagation()
                closeModal(e, groupFormRef)
              }}
            >
              <GroupCreation 
              parentRef={groupFormRef}
              friends={friends}
              setGroups={setGroups}
              handleListData={handleListData}
              groupsButtons={groupsButtons}
              />
            </dialog>
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
