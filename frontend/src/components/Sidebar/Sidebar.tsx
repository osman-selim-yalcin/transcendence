import { useEffect, useRef, useState } from "react"
import { SocialView, UserListType } from "../../types"
import FriendList from "../FriendList/FriendList"
import UserRoomList from "../RoomList/RoomList"
import UserList from "../UserList/UserList"
import "./Sidebar.scss"

export default function Sidebar() {
  const [barActive, setBarActive] = useState(false)
  const [view, setView] = useState(SocialView.FRIENDS)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (barActive) {
      document.addEventListener("click", handleClickOutside)
    } else {
      document.removeEventListener("click", handleClickOutside)
    }
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [barActive])

  function handleClickOutside(event: any) {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setBarActive(false)
    }
  }

  return (
    <>
      <button
        className="bar-button"
        onClick={e => {
          e.stopPropagation()
          setBarActive(!barActive)
        }}
      >
        <span className={"arrow" + (barActive ? " active" : "")}>&#8680;</span>
      </button>{" "}
      {/* &equiv; */}
      <div
        className={
          "sidebar bg-[#e2e2e2] dark:bg-slate-900" +
          (barActive ? " active" : "")
        }
        ref={sidebarRef}
      >
        <h2>Sidebar</h2>
        <div className={"buttons"}>
          <button
            onClick={() => {
              setView(SocialView.FRIENDS)
            }}
          >
            Friends
          </button>
          <button
            onClick={() => {
              setView(SocialView.ROOMS)
            }}
          >
            Rooms
          </button>
          <button
            onClick={() => {
              setView(SocialView.USERS)
            }}
          >
            Add Friend
          </button>
        </div>
        <div
          className="sidebar-content"
          style={{
            transform: `translate(-${view * 350}px)`
          }}
        >
          <FriendList setBarActive={setBarActive} />
          <UserRoomList />
          <UserList userListType={UserListType.ADD_FRIEND} />
        </div>
      </div>
    </>
  )
}
