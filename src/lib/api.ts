import axios from "axios";

const apiClient = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add interceptors if needed
apiClient.interceptors.request.use(
    (config) => {
        // Example: add auth token
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
