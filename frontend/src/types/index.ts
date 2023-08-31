export type typeMsg = {
  content: string
  createdAt: string
  owner: string
}

export type typeAllMsg = {
  roomID: number
  messages: typeMsg[]
}

export type typeRoom = {
  roomID: number
  name: string
  avatar: string
}

export type typeAllRooms = {
  users: typeUser[]
  messages: typeMsg[]
  room: typeRoom
}

export type typeUser = {
  username: string
  id: number
  status: string
  avatar: string
  messages: typeMsg[]
  userID: string
  sessionID: string
  hasNewMessages: boolean
}
