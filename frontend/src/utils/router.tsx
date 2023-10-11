import { createBrowserRouter } from "react-router-dom"
import Home from "../views/Home"
import Profile from "../views/Profile"
import RootLayout from "../layouts/RootLayout"
import Game from "../views/Game/Game"
import FriendList from "../components/FriendList/FriendList"
import UserRoomList from "../components/RoomList/RoomList"
import UserList from "../components/UserList/UserList"
import { Chat } from "../components/Chat/Chat"
import LoadIndicator from "../components/LoadIndicator/LoadIndicator"

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
      },
      {
        path: "/chat/:id",
        element: <Chat />
      },
      {
        path: "*",
        element: <LoadIndicator />
      }
    ]
  }
])
