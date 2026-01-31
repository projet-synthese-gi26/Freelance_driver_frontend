import axios from 'axios';
import { sessionService } from './sessionService';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (sessionService.isAccessTokenExpired()) {
      const refreshToken = sessionService.getRefreshToken();
      if (refreshToken) {
        const response = await refreshClient.post('/api/auth/refresh', { refreshToken });
        sessionService.setTokens(response.data.accessToken, response.data.refreshToken);
      }
    }

    const token = sessionService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;