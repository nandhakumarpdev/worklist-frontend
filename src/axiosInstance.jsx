import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://worklist-backend-rbu0.onrender.com/api/"
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
}, (error) => {
    return Promise.reject(error);
})

export default axiosInstance;