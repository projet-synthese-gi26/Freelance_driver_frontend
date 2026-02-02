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
        const currentContext = sessionService.getUserSessionContext();
        if (currentContext && response.data?.user) {
          sessionService.saveSessionContext({
            ...currentContext,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken ?? currentContext.refreshToken,
            user: response.data.user,
          });
        }
      }
    }

    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (error?.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionService.getRefreshToken();
      if (refreshToken) {
        const response = await refreshClient.post('/api/auth/refresh', { refreshToken });
        sessionService.setTokens(response.data.accessToken, response.data.refreshToken);
        const currentContext = sessionService.getUserSessionContext();
        if (currentContext && response.data?.user) {
          sessionService.saveSessionContext({
            ...currentContext,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken ?? currentContext.refreshToken,
            user: response.data.user,
          });
        }
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${response.data.accessToken}`,
        };
        return apiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;