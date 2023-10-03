import React, { useEffect, useRef, useState } from 'react'
import FriendList from '../FriendList/FriendList'
import UserList from '../UserList/UserList'
import UserRoomList from '../RoomList/RoomList'
import "./Sidebar.scss"

enum SocialView {
  FRIENDS,
  USERS,
  ROOMS
}

export default function Sidebar() {
  const [barActive, setBarActive] = useState(false)
  const [view, setView] = useState(<FriendList />)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [])

  function handleClickOutside(event: any) {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setBarActive(false)
    }
  }

  return (
    <>
    <button className='bar-button' onClick={(e) => {
      e.stopPropagation()
      setBarActive(!barActive)
    }}><span className={"arrow" + (barActive ? " active" : "")}>&#8678;</span></button> {/* &equiv; */}
    <div className={"sidebar" + (barActive ? " active" : "")} ref={sidebarRef}>
      <h2>Sidebar</h2>
      <div className={"buttons"}>
        <button onClick={() => {setView(<FriendList />)}}>&#9786;</button>
        <button onClick={() => {setView(<UserRoomList />)}}>&#9750;</button>
        <button onClick={() => {setView(<UserList />)}}>&#x2B;</button>
      </div>
      {view}
    </div>
    </>
  )
}
