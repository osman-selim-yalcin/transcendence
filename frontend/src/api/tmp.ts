import axios from "axios"

export const login = (username: string, setUser: any) => {
  axios
    .post("http://localhost:3000/api/auth/tmp/login", {
      username: username
    })
    .then(res => {
			console.log("here51", res)
      localStorage.setItem("token", res.data.token)
      setUser(res.data.user)
    })
    .catch(err => {
      console.log(err)
    })
}
