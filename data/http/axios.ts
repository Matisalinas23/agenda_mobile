import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// RECUERDA: En móviles, 'localhost' no funciona. 
// Usa tu IP local (ej: http://192.168.1.100:3000) o http://10.0.2.2:3000 para Android Emulator.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000";
console.log("Conectando a la API en:", BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    }
})

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token")

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                api.post("/auth/refresh", {}, { _retry: true } as any)
                    .then(async ({ data }) => {
                        const newToken = data;
                        await AsyncStorage.setItem("token", newToken);
                        
                        // NOTA: Para sincronizar el store de Zustand en móvil, 
                        // lo ideal es importar el store aquí si es necesario, 
                        // pero por ahora mantengamos la lógica base.

                        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        processQueue(null, newToken);
                        resolve(api(originalRequest));
                    })
                    .catch(async (err) => {
                        processQueue(err, null);
                        await AsyncStorage.removeItem("token");
                        // Aquí podrías disparar un evento de redirección al login si fuera necesario
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export default api
