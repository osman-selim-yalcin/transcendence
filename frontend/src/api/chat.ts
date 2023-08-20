import axios from "axios"

export const startChat = async (username: string) => {
  const response = axios.post(
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
  return (await response).data
}

export const findChat = async (roomId: number, setMessages: Function) => {
  axios
    .post(
      "http://localhost:3000/api/user/findChat",
      {
        roomId
      },
      {
        headers: {
          authorization:
            "Bearer " +
            (localStorage.getItem("token") ? localStorage.getItem("token") : "")
        }
      }
    )
    .then(res => {
			console.log("here", res.data)
      // setMessages(res.data.messages)
    })
    .catch(err => {
      console.log(err)
    })
}
