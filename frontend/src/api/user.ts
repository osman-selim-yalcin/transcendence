import axios from "axios"

export const getUser = async () => {
  console.log("getUser called")
  if (localStorage.getItem("loginWith") === "username") {
    return axios
      .get("http://localhost:3000/api/user/info", {
        headers: {
          authorization:
            "Bearer " +
            (localStorage.getItem("token") ? localStorage.getItem("token") : "")
        }
      })
      .then(res => {
        return res.data
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    return axios
      .get("http://localhost:3000/api/auth/user", {
        withCredentials: true
      })
      .then(res => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token)
        }
        // console.log("user from 42", res.data)
        return res.data.user
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export const getUsers = () => {
  return axios
    .get("http://localhost:3000/api/user", {
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
