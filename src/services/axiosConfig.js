import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080", // Base URL of your backend
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => response, // If the response is successful, return it as is
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // If the token is invalid or user is logged out, clear localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("role");

            window.location.href = "/login"; // Redirect immediately
        }

        // Return the error so that it can be handled by the calling function
        return Promise.reject(error);
    }
);

export default axiosInstance;
