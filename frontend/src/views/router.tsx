// Router.tsx
import { useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Chat } from "./Chat/Chat"
import Game from "./Game/Game"
import Home from "./Home"
import Profile from "./Profile/Profile"
import RootLayout from "./RootLayout"

function ScrollToTop() {
  useEffect(() => {
    const onRoute = () => window.scrollTo({ top: 0, behavior: "instant" })
    window.addEventListener("popstate", onRoute)
    return () => window.removeEventListener("popstate", onRoute)
  }, [])
  return <></>
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<RootLayout />}>
          {/* "/" için index route */}
          <Route index element={<Home />} />

          <Route path="profile" element={<Profile />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route path="game" element={<Game />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:id" element={<Chat />} />

          {/* wildcard */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
