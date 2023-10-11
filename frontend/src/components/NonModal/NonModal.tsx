import { RefObject, useEffect, useRef } from "react"
import './NonModal.scss'

export default function NonModal({ children, isActive: [modal, setModal], dialogPosition }: any) {
  const dialogRef = useRef<HTMLDialogElement>()

  useEffect(() => {
    if (modal) {
      openModal(dialogRef)
      document.addEventListener("click", closeModal)
    } else {
      dialogRef.current.close()
      document.removeEventListener("click", closeModal)
    }
    return (() => {
      document.removeEventListener("click", closeModal)
    })
  }, [modal])
  

  function closeModal(e: any) {
    const dialogDimensions = dialogRef.current.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      setModal(false)
    }
  }

  function openModal(ref: RefObject<HTMLDialogElement>) {
    ref.current.style.top = `${dialogPosition.current.top}px`
    ref.current.style.left = `${dialogPosition.current.left}px`
    ref.current.show()
  }

  return (
    <dialog className={"nonmodal-dialog"} ref={dialogRef}>
      {children}
    </dialog>
  )
}
