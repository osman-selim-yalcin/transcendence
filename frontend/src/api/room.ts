import axios from "axios"
import { roomCommandBody, roomPayload } from "../types"

// <---------------- REFACTOR ----------------->

export const getUserRooms = async () => {
  return axios
    .get("http://localhost:3000/api/room/user-rooms", {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}
export const getRooms = async (queryString: string) => {
  return axios
    .get("http://localhost:3000/api/room", {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      },
      params: {
        take: 10,
        q: queryString
      }
    })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const createRoom = async (body: roomPayload) => {
  return axios
    .post("http://localhost:3000/api/room", body, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const deleteRoom = async (body: roomPayload) => {
  return axios.delete("http://localhost:3000/api/room", {
    headers: {
      Authorization:
        "Bearer " +
        (localStorage.getItem("token") ? localStorage.getItem("token") : "")
    },
    data: body
  })
}

export const sendMessage = async (body: { content: string; id: number }) => {
  return axios
    .post("http://localhost:3000/api/room/message", body, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const leaveRoom = async (body: roomPayload) => {
  return axios
    .post("http://localhost:3000/api/room/leave", body, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const kickUser = async (body: roomCommandBody) => {
  return axios
    .post("http://localhost:3000/api/room/command/kick", body, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const joinRoom = async (body: { id: number; password?: string }) => {
  return axios
    .post("http://localhost:3000/api/room/join", body, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

export const sendInvite = async (body: roomCommandBody) => {
  return axios
    .post("http://localhost:3000/api/room/command/invite", body, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const changeMod = async (body: roomCommandBody) => {
  return axios
    .post("http://localhost:3000/api/room/command/mod", body, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const changeMute = async (body: roomCommandBody) => {
  return axios
    .post("http://localhost:3000/api/room/command/mute", body, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .catch(err => {
      console.log(err)
    })
}
