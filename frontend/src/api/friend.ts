import axios from "axios"

export const addFriend = (username: string) => {
  return axios
    .post(
      "http://localhost:3000/api/user/addFriend",
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
			console.log(response)
      return 1
    })
    .catch(err => {
			console.log(err)
			return 0
    })
}

export const removeFriend = (username: string) => {
  axios
    .post(
      "http://localhost:3000/api/user/removeFriend",
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
      console.log(response)
    })
    .catch(err => {
      console.log(err)
    })
}

export const getAllFriends = async (setFriends: Function) => {
  return await axios
    .get("http://localhost:3000/api/user/allFriends", {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      setFriends(response.data)
			return response.data
    })
    .catch(err => {
      console.log(err)
    })
}
