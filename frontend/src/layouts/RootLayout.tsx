import Navbar from '../components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import "../styles/app.scss"
import NonModal from '../components/NonModal/NonModal'
import { useContext, useEffect, useState } from 'react'
import { Modal } from '../components/Modal/Modal'
import { UserContext } from '../context/UserContext'
import NicknameSetter from '../components/NicknameSetter'

export default function RootLayout() {
  const [modal, setModal] = useState(false)
  const { user } = useContext(UserContext)
  useEffect(() => {
    if (user && !user.displayName) {
      setModal(true)
    }
  }, [user])


  return (
    <div className='root-layout'>
      <Navbar />
      <Sidebar />
      <main>
        <Outlet />
      </main>
      <footer>
        Transcedence &copy;
      </footer>
      <Modal isActive={[modal, setModal]} removable={false} >
        <NicknameSetter setModal={setModal} />
      </Modal>
      <NonModal />
    </div>
  )
}
