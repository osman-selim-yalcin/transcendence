export type typeMsg = {
  content: string
  owner: string
}

export type typeAllMsg = {
  roomID: number
  messages: typeMsg[]
}

export type typeRoom = {
  roomID: number
  friend: typeUser
}

export type typeAllRooms = {
  id: number
  user: typeUser
  messages: typeMsg[]
  createdAt: string
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
