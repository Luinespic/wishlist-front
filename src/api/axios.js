import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Interceptor de petición: añade el token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta: si el token ha expirado redirige al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes("/auth/");
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
