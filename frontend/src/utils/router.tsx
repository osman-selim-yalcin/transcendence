import { createBrowserRouter } from "react-router-dom"
import Home from "../views/Home"
import Profile from "../views/Profile"
import RootLayout from "../layouts/RootLayout"
import Game from "../views/Game"
import FriendList from "../views/FriendList"
import UserRoomList from "../views/RoomList"
import UserList from "../views/UserList"
import { Chat } from "../components/Chat/Chat"

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/game",
        element: <Game />
      },
      {
        path: "/friends",
        element: <FriendList />
      },
      {
        path: "/user-rooms",
        element: <UserRoomList />
      },
      {
        path: "/users",
        element: <UserList />
      },
      {
        path: "/chat",
        element: <Chat />
      }
    ]
  }
])
