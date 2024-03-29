import "./NotificationList.scss"
import { notification, NotificationStatus, NotificationType } from '../../types'
import LoadIndicator from '../LoadIndicator/LoadIndicator'
import { addFriend } from "../../api/friend"
import { UserContext } from "../../context/UserContext"
import { MouseEventHandler, PropsWithChildren, useContext } from "react"
import { deleteNotification } from "../../api/notification"
import { joinRoom } from "../../api/room"
import { sendGameInvite } from "../../api/game"

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
  let statement = null
  if (notification.status === NotificationStatus.PENDING || notification.status === NotificationStatus.DECLINED) {
    statement = <ReadyContentSingleButtonNotification notification={notification} isPositive={false} />
  } else if (notification.status === NotificationStatus.ACCEPTED) {
    statement = <ReadyContentSingleButtonNotification notification={notification} isPositive={true} />
  } else if (notification.status === NotificationStatus.QUESTION) {
    if (notification.type === NotificationType.FRIEND) {
      statement = <DoubleButtonNotification notification={notification} onAccept={async () => {
        await addFriend({ id: notification.creator.id })
      }} />
    } else if (notification.type === NotificationType.ROOM) {
      statement = <DoubleButtonNotification notification={notification} onAccept={async () => {
        await joinRoom({ id: notification.roomID })
      }} />
    } else if (notification.type === NotificationType.GAME) {
      statement = <DoubleButtonNotification notification={notification} onAccept={async () => {
        await sendGameInvite({ id: notification.creator.id })
      }} />
    }
  }
  return (statement)
}

function ReadyContentSingleButtonNotification({ notification, isPositive }: PropsWithChildren<{ notification: notification, isPositive: boolean }>) {
  return (
    <>
      <p>
        {notification.content}
      </p>
      <button onClick={async () => {
        await deleteNotification({ id: notification.id })
      }}>{isPositive ? <>&#10003;</> : <>&#10005;</>}</button>
    </>
  )
}

function DoubleButtonNotification({ notification, onAccept }: PropsWithChildren<{ notification: notification, onAccept: MouseEventHandler<HTMLButtonElement> }>) {

  return (
    <>
      <p>
        {notification.content}
      </p>
      <div className="buttons">
        <button onClick={onAccept}>&#10003;</button>
        <button onClick={async () => {
          await deleteNotification({ id: notification.id })
        }}>&#10005;</button>
      </div>
    </>
  )
}