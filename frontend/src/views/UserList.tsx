import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { user } from '../types'

export default function UserList() {
  const { users } = useContext(UserContext)
  return (
    <div>
      {!users.length ? "No data" : users.map((item: user, index: number) => (
        <li key={index}>{item.username}</li>
      ))}
    </div>
  )
}
