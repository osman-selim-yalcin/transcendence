import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/context"
import { WebsocketContext } from "../context/WebsocketContext"
import { addFriend, removeFriend, getAllFriends } from "../api/friend"
import { getAllUsers } from "../api"
import { startChat } from "../api/chat"

export default function Profile() {
  const { user } = useContext(UserContext)
  const socket = useContext(WebsocketContext)
  const [allUsers, setAllUsers] = useState([])
  const [friends, setFriends] = useState([])

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected")
    })
    socket.on(socket.id, () => {
      console.log("socket id", socket.id)
    })
    socket.on("onMessage", data => {
      console.log("data came", data)
    })
    return () => {
      console.log("unmounting")
      socket.off("connect")
      socket.off("onMessage")
    }
  }, [])

  if (!user) {
    return <div>not found user</div>
  }

  return (
    <div>
      <h1>Profile</h1>
      <div>
        <button onClick={() => getAllUsers(setAllUsers)}>show all users</button>
        {allUsers?.map(item => {
          if (item.username === user.username) return null
          return (
            <div key={item.id}>
              <button onClick={() => addFriend(item.username)}>
                {item.username} add friend
              </button>
            </div>
          )
        })}
      </div>
      <hr></hr>
      <button onClick={() => getAllFriends(setFriends)}>show friends</button>
      {friends?.length !== 0 ? (
        friends.map(item => {
          return (
            <div key={item.id}>
              {item.username}
              <button onClick={() => removeFriend(item.username)}>
                remove friend
              </button>
              <button onClick={() => startChat(item.username)}>
                start chat
              </button>
              {/* <button onClick={() => startGroupChat()}>start group chat</button> */}
            </div>
          )
        })
      ) : (
        <div>no friends</div>
      )}
      <hr></hr>
      <div>
        {user?.username}
        <img src={user?.avatar} alt="" />
      </div>
    </div>
  )
}
