import { createBrowserRouter } from "react-router-dom"
import Home from "../views/Home/Home"
import Profile from "../views/Profile/Profile"
import RootLayout from "../layouts/RootLayout"
import Game from "../views/Game/Game"
import { Chat } from "../components/Chat/Chat"
import TwoFactorForm from "../components/forms/TwoFactorForm/TwoFactorForm"
import ErrorLanding from "../components/404/404"

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
        path: "/2fa",
        element: <TwoFactorForm />
      },
      {
        path: "*",
        element: <ErrorLanding />
      }
    ]
  }
])
