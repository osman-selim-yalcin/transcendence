/**
 ******************** USER *********************
 */

export type user = {
  id: number
  username: string
  sessionID: string
  status: string
  avatar: string
  lastSeen: string
}

export interface userContext {
  user: user
  setUser: Function
  friends: user[]
  reloadFriends: Function
  userRooms: room[]
  setUserRooms: Function
  reloadUserRooms: Function
  notifications: notification[]
  reloadNotifications: Function
}

export enum userStatus {
  ONLINE,
  OFFLINE,
  INGAME,
  AWAY,
  BUSY,
}

/**
 ******************** ROOM *********************
 */

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
  users: { id: number }[] | []
  isGroup: boolean
  password?: string
}

export type roomKickBody = {
  id: number,
  user: {
    id: number
  }
}

export interface message {
  id: number
  content: string
  createdAt: string
  owner: string
  room?: number
}

export enum RoomRank {
  MEMBER,
  MODERATOR,
  CREATOR
}

/**
 ******************** NOTIFICATION *********************
 */

export enum NotificationType {
  FRIEND,
  ROOM,
  GAME,
  KICK,// single button
  BAN,// single button
  MOD,// single button
}

export enum NotificationStatus {
  PENDING,
  ACCEPTED,
  DECLINED,
  QUESTION,
}

export type notification = {
  id: number
  content: any
  roomID: number
  status: NotificationStatus
  createdAt: string
  type: NotificationType
  creator: user
  user: user
  // sibling: notification
}

/**
 ******************** UI UTILS *********************
 */

export enum SocialView {
  FRIENDS,
  ROOMS,
  USERS
}

export type ContextContent = { clickedUser: user, currentRoomId: number, canBeControlled: boolean } | null

export interface NonModalContext {
  nonModalActive: boolean
  setNonModalActive: Function
  position: NonModalPosition
  setPosition: Function
  contentType: ContextMenuContentType
  setContentType: Function
  contextContent: ContextContent
  setContextContent: Function
  openContextMenu:Function
  closeContextMenu: Function
}

export enum ContextMenuContentType {
  ROOM_DETAIL_USER,
  NOTIFICATION
}

export interface NonModalPosition {
  top?: number
  left?: number
  bottom?: number
  right?: number
}

export enum UserListType {
  ADD_FRIEND,
  INVITE_USER,
  NEW_MESSAGE
}

// export type socketPayload = {}

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
