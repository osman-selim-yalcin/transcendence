import { createBrowserRouter } from "react-router-dom"
import Home from "../views/Home"
import Profile from "../views/Profile"
import RootLayout from "../layouts/RootLayout"
import Game from "../views/Game"
import FriendList from "../views/FriendList"
import RoomList from "../views/RoomList"
import UserList from "../views/UserList"

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
        path: "/rooms",
        element: <RoomList />
      },
      {
        path: "/users",
        element: <UserList />
      }
    ]
  }
])
