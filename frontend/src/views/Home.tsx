import { useContext, useState } from "react"
import UserInfo from "../components/UserInfo.tsx"
import { Modal } from "../components/Modal/Modal.tsx"
import LoadIndicator from "../components/LoadIndicator/LoadIndicator.tsx"
import { UserContext } from "../context/UserContext.tsx"

export default function Home() {
  const [modal, setModal] = useState(false)
  const { user } = useContext(UserContext)
  return (
    <div>
      <h1>42 Transcendence by <i>bmat&osyalcin</i></h1>
      <UserInfo user={user} />
      <Modal isActive={[modal, setModal]} removable={true}>
        Welcome to Home Page
        <LoadIndicator />
      </Modal>
      <button onClick={() => {
        setModal(true)
      }}>open modal</button>
    </div>
  )
}
