import axios from "axios"

export const getNotifications = async (setNotifications: any) => {
  axios
    .get("http://localhost:3000/api/user/getNotifications", {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(res => {
      console.log(res.data)
      setNotifications(res.data)
    })
    .catch(err => {
      console.log(err)
    })
}

export const createNotification = async (
  content: string,
  username: string,
  type: string
) => {
  axios
    .post(
      "http://localhost:3000/api/user/createNotification",
      {
        content,
        username,
        type
      },
      {
        headers: {
          authorization:
            "Bearer " +
            (localStorage.getItem("token") ? localStorage.getItem("token") : "")
        }
      }
    )
    .then(res => {})
    .catch(err => {})
}

export const deleteNotification = async (id: number) => {
  axios
    .delete("http://localhost:3000/api/user/deleteNotification/" + id, {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(res => {})
    .catch(err => {})
}
