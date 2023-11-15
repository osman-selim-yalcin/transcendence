import axios from "axios"
import { SERVER_URL } from "../serverUrl"


export const getNotifications = async () => {
  return axios
    .get(SERVER_URL + "/api/notification", {
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

export const deleteNotification = async (body: { id: number }) => {
  return axios
    .delete(SERVER_URL + "/api/notification", 
    {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      },
      data: body
    })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}
