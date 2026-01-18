import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Extract error message from response if available
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    // You can also handle global errors like 401 Unauthorized here
    if (error.response?.status === 401) {
      // Redirect to login or handle session expiry
      // window.location.href = '/admin/login';
      // (Be careful with window object in server-side rendering contexts)
    }

    return Promise.reject(new Error(message));
  },
);

export default api;
