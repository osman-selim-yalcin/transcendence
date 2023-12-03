import { useContext } from "react"
import { PopUpContext } from "../../context/PopUpContext"
import "./PopUp.scss"

export default function PopUp() {
  const {popupQueue} = useContext(PopUpContext)

  return (
    <div className={"popup-container"}>
      <ul>
      {popupQueue.map((popup) => (
        <li key={popup.id}>
          <p>
            {popup.content}
          </p>
          <div className={"progress-bar"}></div>
        </li>
      ))}  
      </ul>
    </div>
  )
}
