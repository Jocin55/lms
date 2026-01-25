import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const tokenString = sessionStorage.getItem("accessToken");
      if (tokenString) {
        const accessToken = JSON.parse(tokenString);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
    } catch (error) {
      console.error("Error parsing access token:", error);
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - please check your connection';
    } else if (error.message === 'Network Error') {
      error.message = 'Cannot connect to server. Please make sure the server is running on port 3000';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;