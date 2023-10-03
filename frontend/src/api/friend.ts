import axios from "axios"

export async function getFriends() {
  return axios
    .get("http://localhost:3000/api/user/friends", {
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
    .post("http://localhost:3000/api/user", 
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
    .delete("http://localhost:3000/api/user",
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
      "http://localhost:3000/api/user/addFriend",
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
      "http://localhost:3000/api/user/removeFriend",
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
    .get("http://localhost:3000/api/user/allFriends", {
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
    .get("http://localhost:3000/api/user/isFriend", {
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
