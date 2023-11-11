import axios from "axios"

export const getUser = async () => {
  console.log("getUser called")
  if (localStorage.getItem("loginWith") === "username") {
    return axios
      .get("http://localhost:3000/api/user/info", {
        headers: {
          authorization:
            "Bearer " +
            (localStorage.getItem("token") ? localStorage.getItem("token") : "")
        }
      })
      .then(res => {
        return res.data
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    return axios
      .get("http://localhost:3000/api/auth/user", {
        withCredentials: true
      })
      .then(res => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token)
        }
        // console.log("user from 42", res.data)
        return res.data.user
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export const getUsers = (queryString: string) => {
  return axios
    .get("http://localhost:3000/api/user", {
      headers: {
        authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      },
      params: {
        take: 10,
        q: queryString
      }
    })
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}

export const changeBlock = async (body: { id: number }) => {
  return axios
    .post("http://localhost:3000/api/user/block", body, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .catch(err => {
      console.log(err)
    })
}

export const changeAvatar = async (body: any) => {
  return axios.post("http://localhost:3000/api/user/file", body, {
    headers: {
    'accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.8',
    'Content-Type': 'multipart/form-data;',
      "Authorization":
        "Bearer " +
        (localStorage.getItem("token") ? localStorage.getItem("token") : "")
    }
  })
  .then((response) => {
    return response.data
  })
}

export const changeNickname = async (body: any) => {
  return axios.put("http://localhost:3000/api/user", body, {
    headers: {
      "Authorization":
        "Bearer " +
        (localStorage.getItem("token") ? localStorage.getItem("token") : "")
    }
  })
  .then((response) => {
    return response.data
  })
}

export const generateQR = async () => {
  return axios.post("http://localhost:3000/api/user/2fa", null, {
    headers: {
      "Authorization":
        "Bearer " +
        (localStorage.getItem("token") ? localStorage.getItem("token") : "")
    }
  })
  .then((response) => {
    return response.data
  })
}
export const verifyQR = async (body: {token: string}) => {
  return axios.post("http://localhost:3000/api/user/2fa/verify", body, {
    headers: {
      "Authorization":
        "Bearer " +
        (localStorage.getItem("token") ? localStorage.getItem("token") : "")
    }
  })
  .then((response) => {
    console.log(response)
    return response.data
  })
}
