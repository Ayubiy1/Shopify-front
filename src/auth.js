import axios from "axios";

const api = axios.create({
  baseURL:
    "https://shopify-backend-vcnq.onrender.com" || "https://shopify-backend-vcnq.onrender.com/", // backend manzilingiz
  withCredentials: true, // agar cookie ishlatayotgan bo‘lsangiz
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// // src/auth.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:10000/api/auth",
// });

// api.interceptors.request.use((config) => {
//   console.log(config.headers.Authorization);

//   const token = localStorage.getItem("token"); // bu endi accessToken
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
