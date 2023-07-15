import React from "react"
import { authenticationTry } from "../api/index.ts"

export default function Home() {
  return <button onClick={authenticationTry}>try</button>
}
