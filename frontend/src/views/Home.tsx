import { useContext } from "react"
import { PopUpContext } from "../context/PopUpContext.tsx"
import Leaderboard from "../components/Leaderboard/Leaderboard.tsx"

export default function Home() {
  const { addPopUp, removePopUp } = useContext(PopUpContext)

  return (
    <div style={{ height: "100%" }}>
      <h1>42 Transcendence by <i>bmat&osyalcin</i></h1>
      <button onClick={() => {
        const id = new Date().getTime()
        addPopUp(id)
      }}>Add PopUp</button>
      <button onClick={() => {
        removePopUp()
      }}>Remove PopUp</button>
      <Leaderboard />
    </div>
  )
}
