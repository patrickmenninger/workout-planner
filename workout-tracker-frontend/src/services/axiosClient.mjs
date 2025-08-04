import axios from 'axios';

// Create the Axios instance
const axiosClient = axios.create({
  baseURL: '/api', // Replace with your backend API URL
});

// Axios interceptor to attach access token
axiosClient.interceptors.request.use(
  async (config) => {

    const authTokenString = localStorage.getItem("sb-mbgnyzzoaeiopibqwbks-auth-token");
    const accessToken = JSON.parse(authTokenString).access_token;

    if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
