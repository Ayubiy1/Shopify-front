import axios from "axios";

const api = axios.create({
  baseURL: "https://angry-korie-developerayubiy-4da36956.koyeb.app",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://angry-korie-developerayubiy-4da36956.koyeb.app",
//   withCredentials: true,
// });

// // const api = axios.create({
// //   baseURL: "https://angry-korie-developerayubiy-4da36956.koyeb.app",
// //   withCredentials: true, // 🔴 MUHIM
// // });

// // const api = axios.create({
// //   baseURL: "https://angry-korie-developerayubiy-4da36956.koyeb.app/", // backend manzilingiz
// //   withCredentials: true, // agar cookie ishlatayotgan bo‘lsangiz
// // });

// // "https://thundering-sheeree-muhammadayubiy-2a80f5fe.koyeb.app" ||

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
