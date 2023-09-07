import React from 'react'
import Navbar from '../components/Navbar'
import UserInfo from '../components/UserInfo'
import { Outlet } from 'react-router-dom'
import Chat from '../components/Chat'
import { UserContext } from '../context/UserContext'

export default function RootLayout() {
  
  const { user } = React.useContext(UserContext)
  
  return (
    <div>
      <Navbar />
      <Outlet />
      {user && <Chat />}
    </div>
  )
}
