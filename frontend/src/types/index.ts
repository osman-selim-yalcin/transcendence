
export type user = {
  id: number
  username: string
  sessionID: string
  status: string
  avatar: string
  lastSeen: string
}

export type socketPayload = {
  
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