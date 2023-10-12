import { useContext } from "react"
import image from "../../public/notification.png"
import { UserContext } from "../../context/UserContext"
import './Notification.scss'
import { ContextMenuContentType } from "../../types"
import { ContextMenuContext } from "../../context/ContextMenuContext"

export default function Notification() {

  const { notifications } = useContext(UserContext)
  const { openContextMenu } = useContext(ContextMenuContext)

  return (
    <div className="notification-button">
      <div className="img-container">
        <img src={image} alt="notification bell" className="bell-img"
          onClick={(event) => {
            event.stopPropagation()
            const node = event.target as HTMLElement
            // const position: NonModalPosition = {}
            // position["left"] = node.getBoundingClientRect().left
            // position["top"] = node.getBoundingClientRect().bottom
            
            // setPosition(position)
            // setNonModalActive(!nonModalActive)
            openContextMenu(node.getBoundingClientRect().left, 
                            node.getBoundingClientRect().bottom,
                            ContextMenuContentType.NOTIFICATION, null)
          }}
        />
        <div className={"new-notification" + (notifications?.length ? "" : " hidden")}></div>
      </div>
      {/* <NonModal isActive={[modal, setModal]} dialogPosition={dialogPosition.current}>
        <NotificationList />
      </NonModal> */}
    </div>
  )
}
