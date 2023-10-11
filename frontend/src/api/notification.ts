import axios from "axios"

export const getNotifications = async () => {
  return axios
    .get("http://localhost:3000/api/notification", {
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
    .delete("http://localhost:3000/api/notification", 
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
