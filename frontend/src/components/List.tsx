export default function List({
  buttons,
  name,
  item,
  messages,
  mainButton,
  user,
  avatar
}: {
  mainButton: any
  messages?: any
  user: any
  avatar: string
  name: string
  item: any
  buttons?: any
}) {
  return (
    <div className="list_item" onClick={() => mainButton(user, item.id)}>
      <div className="list_item_info">
        <div className="list_item_info_up">
          <img src={avatar} alt="" className="list_item_info_up_img" />
          <p>{name}</p>
        </div>
        <div className="list_item_info_msg">
          <p>
            {item.messages?.[item.messages.length - 1]
              ? `${item.messages[item.messages.length - 1].owner} : ${
                  item.messages[item.messages.length - 1].content
                }`
              : "start the chat"}
          </p>
        </div>
      </div>
      <div className="list_item_buttons">
        {buttons?.map((button: any, index: number) => {
          return (
            <button
              key={index}
              onClick={event => button.action(event, user, item.id)}
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
