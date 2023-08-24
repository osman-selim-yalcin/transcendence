export default function List(props: any) {
  return (
    <div>
      {props.list.map((item: any, index: number) => {
        return (
          <div
            className="chat_div_friends_friend"
            key={index}
            onClick={() => props.buttons[0](item)}
          >
            <div className="chat_div_friends_friend_info">
              {/* <img
                src={item.avatar}
                alt=""
                className="chat_div_friends_friend_info_img"
              /> */}
              <p>{item.username}</p>
            </div>
            <div className="chat_div_friends_friend_buttons">
              <button onClick={() => props.buttons[1](item.username)}>X</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
