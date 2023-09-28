import { useState } from "react"
import UserInfo from "../components/UserInfo.tsx"
import { Modal } from "../components/Modal.tsx"

export default function Home() {
  const [modal, setModal] = useState(false)
  return (
    <div>
      <h1>42 Transcendence by <i>bmat&osyalcin</i></h1>
      <UserInfo />
      <Modal isActive={[modal, setModal]}>
        Welcome to Home Page
      </Modal>
      <button onClick={() => {
        setModal(true)
      }}>open modal</button>
    </div>
  )
}
