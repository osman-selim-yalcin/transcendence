import axios from "axios"
import { SERVER_URL } from "../serverUrl"


export async function getLeaderboard() {
  return axios
    .get(SERVER_URL + "/api/game/leaderboard", {
      headers: {
        authorization:
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

export async function getGameHistory(id: number) {
  return axios
    .get(SERVER_URL + "/api/game", {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      },
      params: {
        id: id
      }
    })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export async function getOpponent() {
  return axios
    .get(SERVER_URL + "/api/game/opponent", {
      headers: {
        authorization:
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

export async function sendGameInvite(data: { id: number }) {
  return axios
    .post(SERVER_URL + "/api/game/invite", data, {
      headers: {
        authorization:
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
