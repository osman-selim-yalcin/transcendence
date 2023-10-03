import Navbar from '../components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import "../styles/app.scss"

export default function RootLayout() {


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
    </div>
  )
}
