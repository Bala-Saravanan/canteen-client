import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.log(error);
    // if (error.response?.status === 401) {
    //   if (
    //     typeof window !== "undefined" &&
    //     window.location.pathname !== "/login"
    //   ) {
    //     window.location.href = "/login";
    //   }
    // }
    return Promise.reject(error);
  },
);

export default api;
