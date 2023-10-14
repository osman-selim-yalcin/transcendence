import { PropsWithChildren, useContext, useEffect, useRef, useState } from "react"
import { startRoom } from "../../api/room"
import { UserContext } from "../../context/UserContext"
import { user } from "../../types"
import "./Modal.scss"


export function Modal({ children, isActive: [modal, setModal] }: PropsWithChildren<{ isActive: [boolean, Function] }>) {

  const modalRef = useRef<HTMLDialogElement>()

  useEffect(() => {
    if (modal) {
      openModal(modalRef)
      document.addEventListener("keydown", handleEscapeKey)
    } else {
      modalRef.current.close()
      document.removeEventListener("keydown", handleEscapeKey)
    }
    return (() => {
      document.removeEventListener("keydown", handleEscapeKey)
    })
  }, [modal])

  function handleEscapeKey(event: any) {
    if (event.key === "Escape") {
      setModal(false)
    }
  }

  function closeModal(e: any, ref: any) {
    const dialogDimensions = ref.current.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      setModal(false)
      ref.current.close()
    }
  }

  function openModal(ref: any) {
    ref.current.showModal()
  }

  return (
    <dialog
      className={"modal-dialog"}
      ref={modalRef}
      onClick={(e) => {
        closeModal(e, modalRef)
      }}>
      <div className="modal-body">
        {children}
      </div>
    </dialog>
  )
}






// <---------------- REFACTOR ----------------->











export function DeprecatedModal({
  dialogRef,
  allRooms,
  setAllRooms,
  handleStartRoom,
  setTmp,
}: {
  dialogRef: any
  allRooms: any
  setAllRooms: Function
  handleStartRoom: Function
  setTmp: Function
}) {

  const [buttons, setButtons] = useState([])
  const [isGroup, setIsGroup] = useState(false)
  const groupFormRef = useRef<HTMLDialogElement>(null)
  const { user } = useContext(UserContext)


  useEffect(() => {
    // getUsers(setAllUsers)
    // getAllFriends(setFriends)
    // getGroups(setGroups)
    // console.log("user in modal", user)
  }, [])


  // useEffect(() => {
  //   console.log("data", data)
  // }, [data])

  // useEffect(() => {
  //   console.log("allRooms", allRooms)
  // }, [allRooms])

  const handleCreateRoom = async (friend: any) => {
    const allRoom: any = await startRoom(friend.username)

    handleStartRoom(allRoom.room, allRoom.users)
    dialogRef.current.close()
    if (
      allRooms.find(
        (item: any) => item.room.roomID === allRoom.room.roomID
      ) ||
      !allRoom.room.roomID
    )
      return

    setAllRooms([...allRooms, allRoom])
  }

  const handleAddFriend = async (event: React.MouseEvent, friend: user) => {
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

  const isUserInGroup = (userArray: any, username: string) => {
    if (!userArray) {
      console.log("userArray is null")
      return false
    }
    for (const user of userArray) {
      if (user.username === username) {
        return true
      }
    }
    return false
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
              setIsGroup(false)
            }}
          >
            Friends
          </div>
          <div
            className="modal_swaps_item"
            onClick={() => {
              setIsGroup(false)
            }}
          >
            All Users
          </div>
          <div className="modal_swaps_item"
            onClick={() => {
              setIsGroup(true)
            }}>
            Groups
          </div>
        </div>
        <input placeholder="search bar" className="modal_search"></input>
        {isGroup ?
          <div>
            <button
              onClick={() => { groupFormRef.current?.showModal() }}
            >Create Group</button>
          </div>
          : null}
        <div className="list">

        </div>
        <dialog
          ref={groupFormRef}
          onClick={e => {
            // e.stopPropagation()
            closeModal(e, groupFormRef)
          }}
        >
          {/* <GroupCreation
            parentRef={groupFormRef}
            friends={friends}
            setGroups={setGroups}
            handleListData={handleListData}
            groupsButtons={groupsButtons}
            setAllRooms={setAllRooms}
          /> */}
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
