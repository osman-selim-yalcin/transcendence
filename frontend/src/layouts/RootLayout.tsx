import Navbar from '../components/Navbar/Navbar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import "../styles/app.scss"
import NonModal from '../components/NonModal/NonModal'
import { useContext, useEffect, useRef, useState } from 'react'
import { Modal } from '../components/Modal/Modal'
import { UserContext } from '../context/UserContext'
import NicknameSetter from '../components/NicknameSetter'
import PopUp from '../components/PopUp/PopUp'
import { SocketContext } from '../context/SocketContext'
import { LocationPathName } from '../types'

export default function RootLayout() {
  const [modal, setModal] = useState(false)
  const { user } = useContext(UserContext)
  const socket = useContext(SocketContext)
  const [navigator, setNavigator] = useState<boolean>(false)
  const [page, setPage] = useState<LocationPathName>(LocationPathName.ROOT)
  const navigateFlag = useRef(0)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    socket.on("game invite accepted", () => {
      // window.location.href = `/game?ref=invite`
      setNavigator((navigator) => (!navigator))
    })
  
    return () => {
      socket.off("game invite accepted")
    }
  }, [])

  useEffect(() => {
    if (location.pathname === "/") {
      setPage(LocationPathName.ROOT)
    } else if (location.pathname === "/profile") {
      setPage(LocationPathName.PROFILE)
    } else if (location.pathname === "/chat") {
      setPage(LocationPathName.CHAT)
    } else if (location.pathname === "/game") {
      setPage(LocationPathName.GAME)
    } else {
      setPage(LocationPathName.UNKNOWN)
    }
  
  }, [location.pathname])
  
  
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
    <div className='root-layout'>
      <Navbar page={page}/>
      <Sidebar />
      <main>
        <Outlet />
      </main>
      <footer>
        Transcedence &copy;
      </footer>
      <PopUp />
      <Modal isActive={[modal, setModal]} removable={false} >
        <NicknameSetter setModal={setModal} />
      </Modal>
      <NonModal />
    </div>
  )
}
