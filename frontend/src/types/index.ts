/**
 ******************** USER *********************
 */

export type user = {
  id: number
  username: string
  displayName: string
  sessionID: string
  status: userStatus
  avatar: string
  lastSeen: string
  blockList: { blockedUser: string, blockingUser: string }[]
  elo: number
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
  BLOCKED
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
  muteList: MutedUser[]
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

export type roomCommandBody = {
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

export type ContextContent = { clickedUser: user, clickedUserRank: RoomRank, currentRoomId: number, currentRoomCreator: string, canBeControlled: boolean } | null

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

export type MutedUser = {
  username: string
  time: number
}

/**
 ******************** GAME *********************
 */

export type player = {
  user: user,
  color: number
}

export type gameScore = {
  scores: number[]
}

export type currentPositions = {
  ball: {
    position: {
      x: number
      y: number
    }
  }
  paddles: [
    {
      position: {
        y: number
      }
    },
    {
      position: {
        y: number
      }
    }
  ]
}

export enum GameState {
  PREQUEUE,
  IN_QUEUE,
  PREGAME_NOT_READY,
  PREGAME_READY,
  IN_GAME,
  POST_GAME
}

/**
 ******************** POP-UP *********************
 */

export type PopUpIndex = {
  id: number
  content: string
}