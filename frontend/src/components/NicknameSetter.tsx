import { PropsWithChildren, useContext, useState } from "react"
import { changeNickname } from "../api/user"
import { UserContext } from "../context/UserContext"

export default function NicknameSetter({ setModal }: PropsWithChildren<{ setModal: Function }>) {
  const [nickname, setNickname] = useState("")
  const [inputActive, setInputActive] = useState(false)
  const { user, setUser } = useContext(UserContext)

  return (
    <>
      <h2>Hold it right there! You don't have a nickname!</h2>
      <p>You can set a nickname that will be displayed to other users, or you can skip this step to use your 42 username as default.</p>
      {!inputActive ?
        <>
          <div className="buttons">
            <button onClick={() => {
              setUser({ ...user, displayName: user.username })
              setModal(false)
            }}>Skip</button>
            <button onClick={() => {
              setInputActive(true)
            }}>Set a Nickname</button>
          </div>
        </>
        :
        <>
          <input type="text" value={nickname}
            onChange={(e) => {
              setNickname(e.target.value)
            }} />
          <button onClick={() => {
            setInputActive(false)
          }}>Back</button>
          <button onClick={async () => {
            await changeNickname({ id: user.id, displayName: nickname })
            setUser({ ...user, displayName: nickname })
            setModal(false)
          }}>Set</button>
        </>
      }
    </>
  )
}