import axios from "axios"

const instance = axios.create({
  baseURL: "/api", // API'nin temel URL'i
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// İstek gönderilmeden önce token ekle
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default instance
