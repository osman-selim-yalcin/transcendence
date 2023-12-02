import { useContext, useEffect, useState } from "react"
import image from "../../public/notification.png"
import { UserContext } from "../../context/UserContext"
import './Notification.scss'
import { ContextMenuContentType } from "../../types"
import { ContextMenuContext } from "../../context/ContextMenuContext"

export default function Notification() {
  const { notifications } = useContext(UserContext)
  const { openContextMenu, closeContextMenu, nonModalActive } = useContext(ContextMenuContext)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open && !nonModalActive) {
      setOpen(false)
    }
  
  }, [nonModalActive])
  

  return (
    <div className="notification-button">
      <div className="img-container">
        <img src={image} alt="notification bell" className="bell-img"
          onClick={(event) => {
            event.stopPropagation()
            const node = event.target as HTMLElement
            if (open) {
              setOpen(false)
              closeContextMenu()
            } else {
              setOpen(true)
              openContextMenu(node.getBoundingClientRect().left, 
              node.getBoundingClientRect().bottom,
              ContextMenuContentType.NOTIFICATION, null)
            }
          }}
        />
        <div className={"new-notification" + (notifications?.length ? "" : " hidden")}></div>
      </div>
    </div>
  )
}
