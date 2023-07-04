import axios from "axios"

export const authenticationTry = () => {
  axios
    .post(
      "http://localhost:3000/try",
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    )
    .then(response => {
      console.log(response.data)
    })
    .catch(err => {
      console.log(err)
    })
}

export const login = (username, password, setUser) => {
  axios
    .post("http://localhost:3000/api/user/login", {
      username,
      password
    })
    .then(response => {
      localStorage.setItem("token", response.data)
      setUser({
        username
      })
    })
    .catch(err => {
      console.log(err)
    })
}

export const register = (username, password, setUser) => {
  axios
    .post("http://localhost:3000/api/user/register", {
      username,
      password
    })
    .then(response => {
      localStorage.setItem("token", response.data)
      setUser({
        username
      })
    })
    .catch(err => {
      console.log(err)
    })
}
