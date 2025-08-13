import { createBrowserRouter } from "react-router-dom"
import { Chat } from "./Chat/Chat"
import Game from "./Game/Game"
import Home from "./Home"
import Profile from "./Profile/Profile"
import RootLayout from "./RootLayout"

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
        element: <Home />
      }
    ]
  }
])
