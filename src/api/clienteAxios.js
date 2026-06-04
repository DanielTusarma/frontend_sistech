import axios from "axios";

// cliente Axios centralizado para manejar las peticiones HTTP
const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para agregar automaticamente el token JWT a cada petición
clienteAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para manejar errores globales, como el 401 no autorizado
clienteAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("usuario");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default clienteAxios;
