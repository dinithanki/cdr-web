import axios from 'axios'

const getApiUrl = () => {
    const fallbackUrl = import.meta.env.PROD
        ? "https://cdr-backend-1rjd.onrender.com/api"
        : "http://localhost:3000/api";

    const apiUrl = (import.meta.env.VITE_API_URL || fallbackUrl).replace(/\/$/, "");

    return apiUrl.endsWith("/api") ? apiUrl : `${apiUrl}/api`;
}

export const axiosInstance = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true,
})
