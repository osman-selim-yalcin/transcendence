import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/Home"
import Chat from "../pages/Chat"
import Login from "../auth/Login"

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
			}
    ]
  },
])
