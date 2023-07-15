import axios from "axios"

export const getUser = async (setUser: any) => {
  axios
    .get("http://localhost:3000/api/auth/user", {
      withCredentials: true
    })
    .then(res => {
      localStorage.setItem("token", res.data.token)
      setUser({
        username: res.data.username
      })
    })
    .catch(err => {
      console.log(err)
    })
}

export const authenticationTry = () => {
  axios
    .post(
      "http://localhost:3000/api/user/allUsers",
      {},
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
