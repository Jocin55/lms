import axios from "axios";

console.log("API BASE URL:", import.meta.env.VITE_API_URL);

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
    console.error("Axios error:", error);

    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout. Server may be sleeping.";
    } else if (!error.response) {
      error.message = "Backend not reachable. Please try again.";
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;