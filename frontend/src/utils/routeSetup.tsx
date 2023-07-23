import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/Home"
import Chat from "../pages/Chat"
import Login from "../auth/Login"
import Game from "../pages/Game"
import Profile from "../pages/Profile"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "chat",
        element: <Chat />
      },
      {
        path: "login",
        element: <Login />
      },
			{
				path: "/game",
				element: <Game />
			},
			{
				path: "/profile",
				element: <Profile />
			}
    ]
  },
])
