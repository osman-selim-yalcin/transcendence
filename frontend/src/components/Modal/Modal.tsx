import { PropsWithChildren, useEffect, useRef } from "react"
import "./Modal.scss"


export function Modal({ children, isActive: [modal, setModal], removable }: PropsWithChildren<{ isActive: [boolean, Function], removable: boolean }>) {

  const modalRef = useRef<HTMLDialogElement>()

  useEffect(() => {
    if (modal) {
      openModal(modalRef)
      document.addEventListener("keydown", handleEscapeKey)
    } else {
      modalRef.current.close()
      document.removeEventListener("keydown", handleEscapeKey)
    }
    return (() => {
      document.removeEventListener("keydown", handleEscapeKey)
    })
  }, [modal])

  function handleEscapeKey(event: any) {
    if (event.key === "Escape") {
      event.preventDefault()
      if (removable) {
        setModal(false)
      }
    }
  }

  function closeModal(e: any, ref: any) {
    const dialogDimensions = ref.current.getBoundingClientRect()
    if (
      removable &&
      (e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom)
    ) {
      setModal(false)
      ref.current.close()
    }
  }

  function openModal(ref: any) {
    ref.current.showModal()
  }

  return (
    <dialog
      className={"modal-dialog"}
      ref={modalRef}
      onClick={(e) => {
        closeModal(e, modalRef)
      }}>
      <div className="modal-body">
        {children}
      </div>
    </dialog>
  )
}
