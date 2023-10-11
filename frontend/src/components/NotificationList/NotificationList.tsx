import "./NotificationList.scss"
import { notification, NotificationStatus, NotificationType } from '../../types'
import LoadIndicator from '../LoadIndicator/LoadIndicator'
import { addFriend } from "../../api/friend"
import { UserContext } from "../../context/UserContext"
import { useContext } from "react"
import { deleteNotification } from "../../api/notification"

export default function NotificationList() {
  const { notifications } = useContext(UserContext)
  return (
    <div className={"notification-list"}>
      {notifications === null ?
        <LoadIndicator />
        :
        <>
        {notifications.length ?
          <ul>
          {notifications.map((singleNotification) => (
            <li key={singleNotification.id}>
              <NotificationIndex notification={singleNotification} />
            </li>
          ))}
          </ul>
          :
          <div className="empty-list">
          <p>
            There is no notification
          </p>
          </div>
        }
          </>
        }
    </div>
  )
}

function NotificationIndex({ notification }: { notification: notification }) {
  const { reloadFriends, reloadNotifications } = useContext(UserContext)
  let statement = null
  if (notification.type === NotificationType.FRIEND) {
    if (notification.status === NotificationStatus.QUESTION) {
      statement = 

      <>
        <p>
          You have a friend request from {notification.creator.username}
        </p>
        <div className="buttons">
       <button onClick={async () => {
         await addFriend({ id: notification.creator.id })
         reloadFriends()
         reloadNotifications()
        }}>&#10003;</button>
       <button onClick={async () => {
          await deleteNotification({ id: notification.id })
          reloadNotifications()
        }}>&#10005;</button>
        </div>
      </>

    } else if (notification.status === NotificationStatus.PENDING) {
      statement = 

      <>
        <p>
          Your friend request to {notification.creator.username} is pending
        </p>
        <button onClick={async () => {
          await deleteNotification({ id: notification.id })
          reloadNotifications()
        }}>&#10005;</button>
      </>

    } else {
      statement = 

      <>
        <p>
          {notification.content}
        </p>
        <button onClick={async () => {
          await deleteNotification({ id: notification.id })
          reloadNotifications()
        }}>{notification.status === NotificationStatus.ACCEPTED ? <>&#10003;</> : <>&#10005;</>}</button>
      </>
    }
  }
  return (statement)
}