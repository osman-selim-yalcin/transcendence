import { useContext, useEffect, useRef, useState } from "react"
import image from "../../public/notification.png"
import { UserContext } from "../../context/UserContext"
import { getNotifications } from "../../api/notification"

import './Notification.scss'
import NonModal from "../NonModal/NonModal"
import { NonModalPosition, notification } from "../../types"
import NotificationList from "../NotificationList/NotificationList"

export default function Notification() {

  const [modal, setModal] = useState(false)
  const dialogPosition = useRef<NonModalPosition>({})
  const { user, notifications } = useContext(UserContext)

  useEffect(() => {

    // socket.on("notification", (data: any) => {
    //   console.log("notification socket")
    //   console.log(data)
    //   console.log(notifications)
    //   notifications.push({
    //     ...data
    //   })
    //   setNotifications([...notifications])
    // })

    // return () => {
    //   socket.off("notification")
    // }
  }, [user])


  return (
    <div className="notification-button">
      <div className="img-container">
        <img src={image} alt="notification bell" className="bell-img"
          onClick={(event) => {
            event.stopPropagation()
            const node = event.target as HTMLElement
            dialogPosition.current["left"] = node.getBoundingClientRect().left
            dialogPosition.current["top"] = node.getBoundingClientRect().bottom
            setModal(!modal)
          }}
        />
        <div className={"new-notification" + (notifications?.length ? "" : " hidden")}></div>
      </div>
      <NonModal isActive={[modal, setModal]} dialogPosition={dialogPosition}>
        <NotificationList />
      </NonModal>
    </div>
  )
}
