import { RefObject, useContext, useEffect, useRef } from "react"
import './NonModal.scss'
import { ContextMenuContentType } from "../../types"
import { ContextMenuContext } from "../../context/ContextMenuContext"
import NotificationList from "../NotificationList/NotificationList"
import { ContextMenuButtons } from "../Chat/Chat"

export default function NonModal() {
  const dialogRef = useRef<HTMLDialogElement>()
  const { nonModalActive, 
          setNonModalActive,
          position, contentType, contextContent } = useContext(ContextMenuContext)

  useEffect(() => {
    if (nonModalActive) {
      openModal(dialogRef)
      document.addEventListener("click", closeModal)
    } else {
      dialogRef.current.close()
      document.removeEventListener("click", closeModal)
    }
    return (() => {
      document.removeEventListener("click", closeModal)
    })
  }, [nonModalActive, position])
  

  function closeModal(e: MouseEvent) {
    const dialogDimensions = dialogRef.current.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      setNonModalActive(false)
    }
  }

  function openModal(ref: RefObject<HTMLDialogElement>) {
    ref.current.style.top = `${position.top}px`
    ref.current.style.left = `${position.left}px`
    ref.current.show()
  }

  function getClassName(): string {
    if (contentType === ContextMenuContentType.NOTIFICATION) {
      return "notification reverse-x"
    }
    let returnString
    if (contentType === ContextMenuContentType.ROOM_DETAIL_USER) {
      returnString = "room-detail"
    } else {
      returnString = ""
    }
    if (position?.top > (window.innerHeight / 2)) {
      returnString += " reverse-y"
    }
    if (position?.left > (window.innerWidth / 2)) {
      returnString += " reverse-x"
    }
    return returnString
  }

  return (
    <dialog className={"nonmodal-dialog " + getClassName()} ref={dialogRef}>
      {contentType === ContextMenuContentType.NOTIFICATION && <NotificationList />}
      {contentType === ContextMenuContentType.ROOM_DETAIL_USER && <ContextMenuButtons clickedUser={contextContent.clickedUser} currentRoomId={contextContent.currentRoomId} canBeControlled={contextContent.canBeControlled} />}
    </dialog>
  )
}
