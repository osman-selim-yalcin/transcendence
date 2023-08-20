import axios from "axios"

export const getUser = async (setUser: any) => {
  if (localStorage.getItem("loginWith") === "username") {
    axios
      .get("http://localhost:3000/api/auth/tmp/getUser", {
        headers: {
          authorization:
            "Bearer " +
            (localStorage.getItem("token") ? localStorage.getItem("token") : "")
        }
      })
      .then(res => {
        setUser(res.data.user)
      })
      .catch(err => {
        console.log(err)
      })
  } else {
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
