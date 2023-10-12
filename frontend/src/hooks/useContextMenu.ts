import { useState } from "react"
import { ContextContent, ContextMenuContentType, NonModalPosition } from "../types"

export const useContextMenu = () => {
  const [nonModalActive, setNonModalActive] = useState(false)
  const [position, setPosition] = useState<NonModalPosition>(null)
  const [contentType, setContentType] = useState<ContextMenuContentType>(null)
  const [contextContent, setContextContent] = useState(null)

  function openContextMenu(x: number, y: number, contentType: ContextMenuContentType, content: ContextContent) {
    const position: NonModalPosition = {}
    position["left"] = x
    position["top"] = y
    setPosition(position)
    setContentType(contentType)
    setContextContent(content)
    setNonModalActive(true)
  }

  function closeContextMenu() {
    setNonModalActive(false)
  }

  return { nonModalActive, setNonModalActive, position, setPosition, contentType, setContentType, contextContent, setContextContent, openContextMenu, closeContextMenu }
}