import React, { useContext, useState } from "react"
import { UserContext } from "../context/context"
import { addFriend, getAllUsers, getAllFriends, removeFriend } from "../api"

export default function Profile() {
  const { user } = useContext(UserContext)
  const [allUsers, setAllUsers] = useState([])
  const [friends, setFriends] = useState([])

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
