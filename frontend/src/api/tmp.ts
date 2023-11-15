import axios from "axios"
import { SERVER_URL } from "../serverUrl"


export const login = (username: string, setUser: any, navigate: Function) => {
  axios
    .post(SERVER_URL + "/api/auth/tmp/login", {
      username: username
    })
    .then(res => {
      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
      setTimeout(() => {
        window.location.reload()
      }, 1000);
    })
    .catch(err => {
      console.log(err)
    })
}
