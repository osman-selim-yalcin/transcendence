import axios from "axios"

export const login = (username, password, setUser) => {
  axios
    .post("http://localhost:3000/api/user/login", {
      username,
      password
    })
    .then(response => {
      setUser(response.data)
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
      setUser(response.data)
    })
    .catch(err => {
      console.log(err)
    })
}
