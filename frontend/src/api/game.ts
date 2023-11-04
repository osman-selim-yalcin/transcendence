import axios from "axios"

export async function getLeaderboard() {
  return axios
    .get("http://localhost:3000/api/game/leaderboard", {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}