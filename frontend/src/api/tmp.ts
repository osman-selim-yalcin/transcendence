import axios from "axios"

export const login = (username: string, setUser: any, navigate: Function) => {
  axios
    .post("http://localhost:3000/api/auth/tmp/login", {
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
