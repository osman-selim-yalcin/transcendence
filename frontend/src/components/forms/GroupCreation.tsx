import { useContext, useState } from "react"
import { roomPayload, user } from "../../types"
import { createRoom } from "../../api/room";
import { UserContext } from "../../context/UserContext";

export default function GroupCreation({ setModal }: any) {
  const [checkboxes, setCheckboxes] = useState([])
  const [groupName, setGroupName] = useState("")
  const [password, setPassword] = useState("")
  const { friends } = useContext(UserContext)

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setCheckboxes([...checkboxes, value]);
    } else {
      setCheckboxes(checkboxes.filter((item) => item !== value));
    }
  };

  // useEffect(() => {
  //   console.log("users", friends)
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

  function generatePayload() {
    const users = checkboxes.map((id: string) => {
      return { id: parseInt(id) }
    })

    const payload: roomPayload = {
      id: 0,
      name: groupName,
      users: users,
      isGroup: true
    }
    if (password !== "") {
      payload["password"] = password
    }
    return payload
  }

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()

      await createRoom(generatePayload())
      .then((res) => {
        console.log("new room created:", res)
      })

      setModal(false)
      document.querySelectorAll(".group_creation_input").forEach((item: any) => {
        item.checked = false
      })
      setGroupName("")
      setCheckboxes([])
      setPassword("")
      document.querySelector("#password").setAttribute("type", "password")
    }}>
      <h3>Group Creation</h3>
      <div>
        <label htmlFor="groupName">Group Name:</label>
        <input
          type="text"
          id="groupName"
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
        {!!friends?.length && "Group Members:"}
        {friends && friends.map((friend: user) => (
          <div key={friend.id}>
            <input
              className="group_creation_input"
              type="checkbox"
              name={friend.username}
              id={friend.username}
              value={friend.id}
              onChange={
                (e) => handleCheckboxChange(e.target.value, e.target.checked)
              }
            />
            <label htmlFor={friend.username}>{friend.displayName || friend.username}</label>
          </div>
        ))}

      </div>
      <button disabled={groupName === "" ? true : false}>Create</button>
    </form>
  )
}