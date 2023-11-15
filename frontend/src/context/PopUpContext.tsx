import { PropsWithChildren, createContext } from "react"
import { usePopUp } from "../hooks/usePopUp"
import { PopUpIndex } from "../types"

export const PopUpContext = createContext<{ popupQueue: PopUpIndex[], addPopUp: Function, removePopUp: Function }>(null)

export default function PopUpProvider({ children }: PropsWithChildren) {
  const { popupQueue, addPopUp, removePopUp } = usePopUp()

  return (
    <PopUpContext.Provider value={{ popupQueue, addPopUp, removePopUp }}>
      {children}
    </PopUpContext.Provider>
  )
}
