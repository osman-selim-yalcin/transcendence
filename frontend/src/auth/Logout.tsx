export default function logout() {
  return (
    <div>
      <button
        onClick={() =>
          window.open("http://localhost:3000/api/auth/logout", "_self")
        }
      >
        Logout
      </button>
    </div>
  )
}
