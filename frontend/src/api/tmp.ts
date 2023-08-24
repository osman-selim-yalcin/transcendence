import axios from "axios"

export const login = (username: string, setUser: any, navigate: Function) => {
  axios
    .post("http://localhost:3000/api/auth/tmp/login", {
      username: username
    })
    .then(res => {
      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
      navigate("/profile")
    })
    .catch(err => {
      console.log(err)
    })
}
