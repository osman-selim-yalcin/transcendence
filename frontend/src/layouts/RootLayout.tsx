import { useContext, useEffect, useRef, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Modal } from "../components/Modal/Modal"
import Navbar from "../components/Navbar/Navbar"
import NicknameSetter from "../components/NicknameSetter"
import NonModal from "../components/NonModal/NonModal"
import PopUp from "../components/PopUp/PopUp"
import { SocketContext } from "../context/SocketContext"
import { UserContext } from "../context/UserContext"
import "../styles/app.scss"

export default function RootLayout() {
  const [modal, setModal] = useState(false)
  const { user } = useContext(UserContext)
  const socket = useContext(SocketContext)
  const [navigator, setNavigator] = useState<boolean>(false)
  const navigateFlag = useRef(0)
  const navigate = useNavigate()

  useEffect(() => {
    socket.on("game invite accepted", () => {
      setNavigator(navigator => !navigator)
    })

    return () => {
      socket.off("game invite accepted")
    }
  }, [])

  useEffect(() => {
    if (navigateFlag.current === 0) {
      navigateFlag.current = 1
    } else {
      navigate(`/game?ref=invite`)
    }
  }, [navigator])

  useEffect(() => {
    if (user && !user.displayName) {
      setModal(true)
    }
  }, [user])

  return (
    <div className="root-layout ">
      {/* <Sidebar /> */}
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>Transcedence &copy;</footer>

      <PopUp />
      <Modal isActive={[modal, setModal]} removable={false}>
        <NicknameSetter setModal={setModal} />
      </Modal>
      <NonModal />
    </div>
  )
}
