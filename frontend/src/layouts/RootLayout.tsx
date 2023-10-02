import Navbar from '../components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import "../styles/app.scss"

export default function RootLayout() {


  return (
    <div className='root-layout'>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>
        Transcedence &copy;
      </footer>
    </div>
  )
}
