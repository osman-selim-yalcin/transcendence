import axios from "axios"
import { roomPayload } from "../types"

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
export const getRooms = async () => {
  return axios
    .get("http://localhost:3000/api/room", {
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

export const createRoom = async (body: any) => {
  return axios.post(
    "http://localhost:3000/api/room",
    body,
    {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    }
  )
  .then((response) => {
    console.log("api response", response)
    return response.data
  })
  .catch((err) => {
    console.log(err)
  })
}

export const deleteRoom = async (body: roomPayload) => {
  return axios.delete("http://localhost:3000/api/room",
  {
    headers: {
      Authorization:
      "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
    },
    data: body
  }
  )
}

export const sendMessage = async (body: {content: string, roomID: number}) => {
  axios
    .post(
      "http://localhost:3000/api/room/message",
      body,
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




// <---------------- REFACTOR ----------------->

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

// export const findRoom = async (roomId: number) => {
//   return await axios
//     .post(
//       "http://localhost:3000/api/user/findRoom",
//       {
//         roomId
//       },
//       {
//         headers: {
//           authorization:
//             "Bearer " +
//             (localStorage.getItem("token") ? localStorage.getItem("token") : "")
//         }
//       }
//     )
//     .then(res => {
//       return res.data.messages
//     })
//     .catch(err => {
//       console.log(err)
//     })
// }

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

export const joinGroup = async (body: any) => {
  const response = axios.post(
    "http://localhost:3000/api/user/joinGroup",
    body,
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

