import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api-agenda-32fg.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = await AsyncStorage.getItem('token');
    if (token) {
      // Remover comillas dobles accidentales si se guardó como JSON string
      token = token.replace(/^["']|["']$/g, '');
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
