import axios from "axios"

export const startRoom = async (username: string) => {
  const response = axios.post(
    "http://localhost:3000/api/user/startRoom",
    {
      username: username
    },
    {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    }
  )
  return (await response).data
}

export const findRoom = async (roomId: number) => {
  return await axios
    .post(
      "http://localhost:3000/api/user/findRoom",
      {
        roomId
      },
      {
        headers: {
          authorization:
            "Bearer " +
            (localStorage.getItem("token") ? localStorage.getItem("token") : "")
        }
      }
    )
    .then(res => {
      return res.data.messages
    })
    .catch(err => {
      console.log(err)
    })
}

export const createMsg = async (msg: string, owner: string, roomID: number) => {
  axios
    .post(
      "http://localhost:3000/api/user/createMsg",
      {
        msg,
        owner,
        roomID
      },
      {
        headers: {
          authorization:
            "Bearer " +
            (localStorage.getItem("token") ? localStorage.getItem("token") : "")
        }
      }
    )
    .catch(err => {
      console.log(err)
    })
}
