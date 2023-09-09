import { useContext, useEffect, useState } from "react"
import { typeUser } from "../../types"
import { createGroup, getGroups, getUsersRooms } from "../../api/room";
import { UserContext } from "../../context/UserContext";

export default function GroupCreation(
  {
    friends,
    parentRef,
    setGroups,
    handleListData,
    groupsButtons,
    setAllRooms
  }: {
    friends: typeUser[]
    parentRef: any
    setGroups: Function
    handleListData: Function
    groupsButtons: any
    setAllRooms: Function
  }
) {
  const [checkboxes, setCheckboxes] = useState([])
  const [groupName, setGroupName] = useState("")
  const [password, setPassword] = useState("")
  const { user } = useContext(UserContext)

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setCheckboxes([...checkboxes, value]);
    } else {
      setCheckboxes(checkboxes.filter((item) => item !== value));
    }
  };

  // useEffect(() => {
  //   console.log("friends", friends)
  // }, [friends])
  // useEffect(() => {
  //   console.log("current checkbox", checkboxes)
  // }, [checkboxes])

  const hidePassword = () => {
    let node = document.querySelector("#password")
    node.setAttribute("type", "password")
    document.querySelector("#password_icon").setAttribute("src", "https://cdn-icons-png.flaticon.com/512/2767/2767146.png")
  }

  const showPassword = () => {
    let node = document.querySelector("#password")
    node.setAttribute("type", "text")
    document.querySelector("#password_icon").setAttribute("src", "https://cdn-icons-png.flaticon.com/512/159/159604.png")
  }
  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      let payload = password === "" ? {
        name: groupName,
        users: checkboxes
      } : {
        name: groupName,
        users: checkboxes,
        password: password
      }
      await createGroup(payload)
      parentRef.current.close()
      document.querySelectorAll(".group_creation_input").forEach((item: any) => {
        item.checked = false
      })
      setGroupName("")
      setCheckboxes([])
      setPassword("")
      handleListData(await getGroups(setGroups), groupsButtons)
      await getUsersRooms(setAllRooms, user)
      document.querySelector("#password").setAttribute("type", "password")
    }}>
      <div>
        <label htmlFor="name">Group Name:</label>
        <input
          type="text"
          id="name"
          value={groupName}
          onChange={(e) => { setGroupName(e.target.value) }}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="optional"
          onChange={(e) => { setPassword(e.target.value) }}
        />
        <img
          id="password_icon"
          src="https://cdn-icons-png.flaticon.com/512/2767/2767146.png" width={20} alt="show password"
          onClick={() => {
            if (document.querySelector("#password").getAttribute("type") === "password") {
              showPassword()
            } else {
              hidePassword()
            }
          }}
        />
      </div>
      <div>
        Group Members:
        {friends.map((friend: typeUser) => (
          <div key={friend.id}>
            <input
              className="group_creation_input"
              type="checkbox"
              name={friend.username}
              id={friend.username}
              value={friend.username}
              onChange={
                (e) => handleCheckboxChange(e.target.value, e.target.checked)
              }
            />
            <label htmlFor={friend.username}>{friend.username}</label>
          </div>
        ))}

      </div>
      <button disabled={groupName === "" ? true : false}>Create</button>
    </form>

  )
}