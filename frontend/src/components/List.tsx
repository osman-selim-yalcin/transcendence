import { typeAllRooms } from "../types"

export default function List(props: any) {

  return (
    <div>
      {props.list.map((item: typeAllRooms, index: number) => {
        return (
          <div
            className="chat_div_friends_friend"
            key={item.id}
            onClick={() => props.buttons(item.users, item.id)}
          >
            <div className="chat_div_friends_friend_info">
              <div className="chat_div_friends_friend_info_up">
                <img
                  src={item.users.avatar}
                  alt=""
                  className="chat_div_friends_friend_info_up_img"
                />
                <p>
                  {item.users.username} /// {item.users.status}
                </p>
              </div>
              <div className="chat_div_friends_friend_info_msg">
                <p>{item.messages[0] ? item.messages[0].content : "start the chat"}</p>
              </div>
            </div>
            <div className="chat_div_friends_friend_buttons">
            </div>
          </div>
        )
      })}
    </div>
  )
}
