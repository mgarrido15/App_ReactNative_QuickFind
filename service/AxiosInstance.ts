import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // Base URL de tu API
});

let isRefreshing = false; // Lock para evitar múltiples solicitudes de refresh
let refreshSubscribers: ((token: string) => void)[] = []; // Lista de suscriptores para reintentar solicitudes

// Función para notificar a las solicitudes en espera
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token"); // Usa await para obtener el token
    console.log("Token obtenido de AsyncStorage:", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Añade el token al encabezado
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = await AsyncStorage.getItem("refreshToken"); // Obtén el refresh token
      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true; // Activa el lock
          try {
            const { data } = await axios.post("http://localhost:4000/api/users/auth/refresh", {
              refreshToken,
            });

            // Guarda el nuevo token en AsyncStorage
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("refreshToken", data.refreshToken);

            // Notifica a las solicitudes en espera
            onRefreshed(data.token);

            isRefreshing = false; // Libera el lock
          } catch (refreshError) {
            console.error("Error al refrescar el token:", refreshError);
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("refreshToken");
            isRefreshing = false; // Libera el lock
            return Promise.reject(refreshError);
          }
        }

        // Espera a que el token sea actualizado
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest._retry = true; // Marca la solicitud como reintentada
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest)); // Reintenta la solicitud original
          });
        });
      } else {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("refreshToken");
      }
    }

    return Promise.reject(error);
  }
);

export default api;