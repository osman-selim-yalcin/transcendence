import axios from "axios"

export const startChat = (username : string) => {
  axios
    .post(
      "http://localhost:3000/api/user/startChat",
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
      console.log(response.data)
    })
    .catch(err => {
      console.log(err)
    })
}
