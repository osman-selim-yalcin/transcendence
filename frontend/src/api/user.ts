import axios from "axios"
import { SERVER_URL } from "../serverUrl"

export const getToken = async (params?: { code: string }) => {
  console.log("gettoken")
  return axios
  .get(SERVER_URL + "/api/auth/token", {
    withCredentials: true,
    params
  })
  .then(res => {
    console.log(res)
    if (res.data.token) {
      localStorage.setItem("token", res.data.token)
      if (!params) {
        window.location.reload()
      } else {
        window.location.href = "/"
      }
    } else {
      console.log("No token returned")
    }
  })
  .catch(err => {
    console.log(err)
    throw err.response
  })
}
export const getUser = async () => {
  console.log("gettoken")
  return axios
    .get(SERVER_URL + "/api/user/info", {
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
      throw err
    })
}

export const getUsers = (queryString: string) => {
  return axios
    .get(SERVER_URL + "/api/user", {
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
    .post(SERVER_URL + "/api/user/block", body, {
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
  return axios
    .post(SERVER_URL + "/api/user/file", body, {
      headers: {
        accept: "*/*",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": "multipart/form-data;",
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      return response.data
    })
}

export const changeNickname = async (body: any) => {
  return axios
    .put(SERVER_URL + "/api/user", body, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      return response.data
    })
}

export const generateQR = async () => {
  return axios
    .post(SERVER_URL + "/api/user/2fa", null, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      return response.data
    })
}
export const verifyQR = async (body: { token: string }) => {
  return axios
    .post(SERVER_URL + "/api/user/2fa/verify", body, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      console.log(response)
      return response.data
    })
}

export const disable2fa = async () => {
  return axios
    .post(SERVER_URL + "/api/user/2fa/disable", null, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      return response.data
    })
}

export const defaultAvatar = async () => {
  return axios
    .post(SERVER_URL + "/api/user/file42", null, {
      headers: {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token") ? localStorage.getItem("token") : "")
      }
    })
    .then(response => {
      return response.data
    })
}