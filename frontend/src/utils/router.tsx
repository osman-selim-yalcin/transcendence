import { createBrowserRouter } from "react-router-dom"
import Home from "../views/Home"
import Login from "../views/Login"
import Profile from "../views/Profile"
import RootLayout from "../layouts/RootLayout"
import Game from "../views/Game"

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/game",
        element: <Game />
      }
    ]
  }
])
