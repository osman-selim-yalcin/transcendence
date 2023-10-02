export type user = {
  id: number
  username: string
  sessionID: string
  status: string
  avatar: string
  lastSeen: string
}

export type socketPayload = {}

export type room = {
  id: number
  createdAt: string
  password: boolean
  name: string
  avatar: string
  creator: string
  mods: string[]
  banList: string[]
  inviteList: string[]
  isGroup: boolean
  isInviteOnly: boolean
  users: user[]
  messages: message[]
}

export interface roomPayload {
  id: number
  name: string
  users: { id: string }[]
  isGroup: boolean
  password?: string
}

export interface message {
  id: number
  content: string
  createdAt: string
  owner: string
}

// export type typeMsg = {
//   content: string
//   createdAt: string
//   owner: string
// }

// export type typeAllMsg = {
//   roomID: number
//   messages: typeMsg[]
// }

// export type typeRoom = {
//   roomID: number
//   name: string
//   avatar: string
// }

// export type typeAllRooms = {
//   messages: typeMsg[]
//   room: typeRoom
// }

// export type typeNotification = {
//   id: number
//   content: string
//   createdAt: string
//   owner: string
//   type: string
// }
