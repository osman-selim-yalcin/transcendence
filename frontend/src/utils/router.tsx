import { createBrowserRouter } from "react-router-dom"
import Home from "../views/Home"
import Profile from "../views/Profile/Profile"
import RootLayout from "../layouts/RootLayout"
import Game from "../views/Game/Game"
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
        path: "/profile/:username",
        element: <Profile />
      },
      {
        path: "/game",
        element: <Game />
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
