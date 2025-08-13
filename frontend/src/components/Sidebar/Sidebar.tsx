import { useState } from "react"
import { SocialView, UserListType } from "../../types"
import FriendList from "./FriendList"
import UserRoomList from "./RoomList"
import UserList from "./UserList"

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(SocialView.FRIENDS)

  const Tabs = [
    { key: SocialView.FRIENDS, label: "Friends" },
    { key: SocialView.ROOMS, label: "Rooms" },
    { key: SocialView.USERS, label: "Add Friend" }
  ]

  return (
    <>
      {/* Toggle button */}
      <button
        className="fixed top-4 left-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white shadow hover:bg-neutral-100"
        onClick={() => setOpen(v => !v)}
        aria-label="Toggle sidebar"
      >
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          &#8680;
        </span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[350px] bg-neutral-200 shadow-xl
                    transition-transform duration-300 ${
                      open ? "translate-x-0" : "-translate-x-full"
                    }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-center text-2xl font-semibold">Sidebar</h2>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {Tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setView(t.key)}
                className={`rounded-md border px-3 py-1 text-sm hover:bg-neutral-100
                            ${
                              view === t.key
                                ? "bg-neutral-900 text-white"
                                : "border-neutral-300"
                            }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 h-[calc(100%-112px)] overflow-y-auto">
          {view === SocialView.FRIENDS && <FriendList setBarActive={setOpen} />}
          {view === SocialView.ROOMS && <UserRoomList />}
          {view === SocialView.USERS && (
            <UserList userListType={UserListType.ADD_FRIEND} />
          )}
        </div>
      </aside>
    </>
  )
}
