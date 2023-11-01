import { useContext } from "react"
import { PopUpContext } from "../context/PopUpContext.tsx"

export default function Home() {
  const { addPopUp, removePopUp } = useContext(PopUpContext)

  return (
    <div>
      <h1>42 Transcendence by <i>bmat&osyalcin</i></h1>
      <button onClick={() => {
        const id = new Date().getTime()
        addPopUp(id)
      }}>Add PopUp</button>
      <button onClick={() => {
        removePopUp()
      }}>Remove PopUp</button>
    </div>
  )
}
