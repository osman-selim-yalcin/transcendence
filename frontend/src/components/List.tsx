import { getTime } from "../functions"
import { typeMsg, typeRoom, typeUser } from "../types"

export default function List({
  buttons,
  name,
  messages,
  mainButton,
  status,
  avatar
}: {
  mainButton: any
  status?: string
  avatar: string
  name: string
  messages: any
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
            {messages?.[messages.length - 1]
              ? `${messages[messages.length - 1].owner} : ${
                  messages[messages.length - 1].content
                }`
              : "start the chat"}
          </p>
        </div>
      </div>
      <div>
        {messages?.[messages.length - 1] && (
          <p>
            {getTime(messages[messages.length - 1].createdAt)}
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

export function GroupList(
  { 
    room, 
    users,
    messages,
    buttons,
    mainButton,
    image
  }: { 
    room: typeRoom
    users: typeUser[]
    messages: typeMsg[]
    buttons: any
    mainButton: any
    image: string | undefined
  }) {
	return (
		<div className="list_item" /*onClick={mainButton}*/>
		  <div className="list_item_info">
			{<img src={image} alt="" className="list_item_info_img" />}
			<div className="list_item_info_msg">
			  <p>
				{room.name}
			  </p>
			  <p>
				{/*messages?.[messages.length - 1]
				  ? `${messages[messages.length - 1].owner} : ${
					  messages[messages.length - 1].content
					}`
        : "start the chat"*/}
			  </p>
			</div>
		  </div>
		  <div>
			{/*messages?.[messages.length - 1] && (
			  <p>
				{getTime(messages[messages.length - 1].createdAt)}
			  </p>
      )*/}
		  </div>
		  <div className="list_item_buttons">
			{buttons?.map((button: any, index: number) => {
        if (!button)
          return null
			  return (
				<button
				  key={index}
				  onClick={button?.action}
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