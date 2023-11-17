import { useContext, useState } from 'react'
import { PopUpContext } from '../../../context/PopUpContext'
import { getToken } from '../../../api/user'
import "./TwoFactorForm.scss"

export default function TwoFactorForm() {
  const [code, setCode] = useState("")
  const { addPopUp } = useContext(PopUpContext)
  return (
    <div className='tfa-form'>
      <form onSubmit={async (e) => {
        e.preventDefault()
        if (code.length) {
          getToken({ code }).catch((e) => {
            addPopUp("Incorrect code")
          })
        }
      }}>
        <label htmlFor="2fa-code">
          <p>Enter the code from your authenticator app</p>
        </label>
        <input type="text" id='2fa-code' value={code} onChange={(e) => {
          setCode(e.target.value)
        }} />
        <button disabled={!code.length} >Confirm</button>
      </form>
    </div>
  )
}
