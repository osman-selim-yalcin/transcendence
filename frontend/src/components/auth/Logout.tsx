import { SERVER_URL } from "../../serverUrl"


export default function Logout() {
  return (
    <div>
      <button
        onClick={() => {
          localStorage.clear()
          window.open(SERVER_URL + "/api/auth/logout", "_self")
        }}
      >
        Logout
      </button>
    </div>
  )
}
