import { PropsWithChildren, createContext } from "react"
import { NonModalContext } from "../types"
import { useContextMenu } from "../hooks/useContextMenu"

export const ContextMenuContext = createContext<NonModalContext>(null)

export default function ContextMenuProvider({ children }: PropsWithChildren) {
  const { nonModalActive, setNonModalActive, position, setPosition, contentType, setContentType, contextContent, setContextContent, openContextMenu, closeContextMenu } = useContextMenu()

  return (
    <ContextMenuContext.Provider value={{ nonModalActive, setNonModalActive, position, setPosition, contentType, setContentType, contextContent, setContextContent, openContextMenu, closeContextMenu }}>
      {children}
    </ContextMenuContext.Provider>
  )
}
