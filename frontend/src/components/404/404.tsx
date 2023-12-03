import { useNavigate } from "react-router-dom"

export default function ErrorLanding() {
  const navigate = useNavigate()
  return (
    <div className="four-oh-four">
      <h1>404</h1>
      <p>This page doesn't exist. You can go back to homepage</p>
      <button onClick={() => {
        navigate("/")
      }}>Home</button>
    </div>
  )
}
