import axios from "axios";

const axiosInstance = axios.create({
  // get url from env
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// axiosInstance.interceptors.request.use(async function (config) {
//   const auth = authStore.auth;
//   config.headers.Authorization = auth ? `Bearer ${auth.token}` : "";
//   // const res = axiosInstance.get("/sanctum/csrf-cookie");
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     if (error.response.status === 401 && authStore.auth) {
//       api.getUserByToken().catch(() => {
//         authStore.logout();
//       });
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
