import axios from "axios"

export const getUser = async (setUser: any) => {
  axios
    .get("http://localhost:3000/api/auth/user", {
      withCredentials: true
    })
    .then(res => {
      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
    })
    .catch(err => {
      console.log(err)
    })
}

export const getAllUsers = (setUsers: any) => {
  axios
    .get("http://localhost:3000/api/user/allUsers", {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      setUsers(response.data)
    })
    .catch(err => {
      console.log(err)
    })
}

export const addFriend = (username: string) => {
  axios
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
      console.log(response)
    })
    .catch(err => {
      console.log(err)
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

export const getAllFriends = (setFriends: any) => {
  axios
    .get("http://localhost:3000/api/user/allFriends", {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
			console.log(response.data)
			setFriends(response.data)
    })
    .catch(err => {
      console.log(err)
    })
}
