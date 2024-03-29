import axios from "axios"
import { SERVER_URL } from "../serverUrl"



export async function getFriends() {
  return axios
    .get(SERVER_URL + "/api/user/friends", {
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

export async function addFriend(data: { id: number }) {
  return axios
    .post(SERVER_URL + "/api/user", 
    data,
    {
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

export async function deleteFriend(data: { id: number }) {
  return axios
    .delete(SERVER_URL + "/api/user",
    {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      },
      data
    })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}




// --------------------- REFACTOR --------------------------

export const deprecatedAddFriend = (
  username: string
  // setFriends: Function,
  // friends: typeUser[]
) => {
  return axios
    .post(
      SERVER_URL + "/api/user/addFriend",
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
    .then(response => {
      console.log(response.data)
      // setFriends([...friends, response.data])
      return 1
    })
    .catch(err => {
      console.log(err)
      return 0
    })
}

export const removeFriend = (username: string) => {
  axios
    .post(
      SERVER_URL + "/api/user/removeFriend",
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
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.log(err)
    })
}

export const getAllFriends = async (setFriends: Function) => {
  return await axios
    .get(SERVER_URL + "/api/user/allFriends", {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      setFriends(response.data)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const isFriend = async (username: string) => {
  return await axios
    .get(SERVER_URL + "/api/user/isFriend", {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      console.log(response.data)
    })
    .catch(err => {
      console.log(err)
    })
}
