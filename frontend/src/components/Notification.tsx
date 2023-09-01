import React, { useContext, useEffect } from "react"
import image from "../public/notification.png"
import { socket } from "../context/WebsocketContext"
import { UserContext } from "../context/context"
import {
  createNotification,
  deleteNotification,
  getNotifications
} from "../api/notification"
import { typeNotification } from "../types"
import { getTime } from "../functions"
import { addFriend } from "../api/friend"

export default function Notification() {
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const [notifications, setNotifications] = React.useState<typeNotification[]>(
    []
  )
  const { user } = useContext(UserContext)

  useEffect(() => {
    getNotifications(setNotifications)

    // socket.on("notification", (data: typeNotification) => {
    //   setNotifications([...notifications, data])
    // })
  }, [])

  const handleConfirm = (event: React.MouseEvent, item: typeNotification) => {
    event.stopPropagation()
    if (item.type === "addFriend") {
      addFriend(item.owner)
    }
    handleDeleteNotification(item.id)
  }

  const handleDeleteNotification = (id: number) => {
    deleteNotification(id)
    setNotifications(notifications.filter(item => item.id !== id))
  }

  return (
    <div
      className="notification"
      onClick={() => {
        dialogRef.current.show()
      }}
    >
      <img src={image} alt="notification" className="notification_img"></img>
      {notifications?.length && (
        <div className="notification_new">{notifications?.length}</div>
      )}
      <dialog
        className="notification_dialog"
        ref={dialogRef}
        onClick={event => {
          event.stopPropagation()
          dialogRef.current.close()
        }}
      >
        <div className="notification_dialog_list">
          {notifications?.map((item, index) => {
            return (
              <div key={index} className="notification_dialog_list_item">
                {item.type} / {item.content} / {item.owner} /
                {getTime(item.createdAt)}
                <div>
                  <button onClick={event => handleConfirm(event, item)}>
                    confirm
                  </button>
                  <button onClick={() => handleDeleteNotification(item.id)}>
                    reject
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </dialog>
    </div>
  )
}
