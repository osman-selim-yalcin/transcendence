export default function Logout() {
  return (
    <div>
      <button
        onClick={() => {
          localStorage.clear()
          window.open("http://localhost:3000/api/auth/logout", "_self")
        }}
      >
        Logout
      </button>
    </div>
  )
}
