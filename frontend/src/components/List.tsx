import { getTime } from "../functions"

export default function List({
  buttons,
  name,
  item,
  mainButton,
  users,
  status,
  avatar
}: {
  mainButton: any
  status?: string
  users: any
  avatar: string
  name: string
  item: any
  buttons?: any
}) {
  return (
    <div className="list_item" onClick={mainButton}>
      <div className="list_item_info">
        <img src={avatar} alt="" className="list_item_info_img" />
        <div className="list_item_info_msg">
          <p>
            {name} {status && `/ ${status}`}
          </p>
          <p>
            {item.messages?.[item.messages.length - 1]
              ? `${item.messages[item.messages.length - 1].owner} : ${
                  item.messages[item.messages.length - 1].content
                }`
              : "start the chat"}
          </p>
        </div>
      </div>
      <div>
        {item.messages?.[item.messages.length - 1] && (
          <p>
            {getTime(item.messages[item.messages.length - 1].createdAt)}
          </p>
        )}
      </div>
      <div className="list_item_buttons">
        {buttons?.map((button: any, index: number) => {
          return (
            <button
              key={index}
              onClick={button.action}
              className="list_item_buttons_item"
            >
              {button.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
