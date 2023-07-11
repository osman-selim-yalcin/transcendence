import React from "react"
import { authenticationTry } from "../api"

export default function Home() {
  return (
    <button
      onClick={authenticationTry}
    >
      try
    </button>
  )
}
