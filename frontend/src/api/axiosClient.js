import axios from 'axios';
import { getAuthHeaders, getRefreshToken, refreshAccessToken, removeTokens } from './auth';

const client = axios.create();

client.interceptors.request.use((config) => {
  config.headers = {
    ...(config.headers || {}),
    ...getAuthHeaders(),
  };
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      if (originalRequest.url?.includes('/auth/refresh')) {
        removeTokens();
        return Promise.reject(error);
      }

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        removeTokens();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshResult = await refreshAccessToken(refreshToken);
        if (refreshResult?.token) {
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${refreshResult.token}`,
          };
        }
        return client(originalRequest);
      } catch (refreshError) {
        removeTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
