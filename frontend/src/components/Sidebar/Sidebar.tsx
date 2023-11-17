import { useEffect, useRef, useState } from 'react'
import FriendList from '../FriendList/FriendList'
import UserList from '../UserList/UserList'
import UserRoomList from '../RoomList/RoomList'
import { SocialView, UserListType } from '../../types'
import "./Sidebar.scss"

export default function Sidebar() {
  const [barActive, setBarActive] = useState(false)
  const [view, setView] = useState(SocialView.FRIENDS)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (barActive) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    }
  }, [barActive])

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
    }}><span className={"arrow" + (barActive ? " active" : "")}>&#8680;</span></button> {/* &equiv; */}
    <div className={"sidebar" + (barActive ? " active" : "")} ref={sidebarRef}>
      <h2>Sidebar</h2>
      <div className={"buttons"}>
        <button onClick={() => {setView(SocialView.FRIENDS)}}>&#9786;</button>
        <button onClick={() => {setView(SocialView.ROOMS)}}>&#9750;</button>
        <button onClick={() => {setView(SocialView.USERS)}}>&#x2B;</button>
      </div>
      <div className="sidebar-content" style={{
        "transform": `translate(-${view * 350}px)`
      }}>
        <FriendList setBarActive={setBarActive} />
        <UserRoomList />
        <UserList userListType={UserListType.ADD_FRIEND} />
      </div>
    </div>
    </>
  )
}
