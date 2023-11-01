import { useEffect, useState } from "react"
import { PopUpIndex } from "../types"

export const usePopUp = () => {
  const [popupQueue, setPopupQueue] = useState<PopUpIndex[]>([])

  useEffect(() => {
    console.log(popupQueue)
  }, [popupQueue])

  function addPopUp(information: string) {
    const popup: PopUpIndex = { content: information, id: new Date().getTime() }
    setPopupQueue([...popupQueue, popup])
    setTimeout(() => {
      setPopupQueue(queue => queue.slice(1))
    }, 9000)
  }

  function removePopUp() {
    setPopupQueue(popupQueue.slice(1))
  }

  return {
    popupQueue,
    addPopUp,
    removePopUp
  }
}
