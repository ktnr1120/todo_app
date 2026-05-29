import axios from 'axios';

const API_BASE_URL = '/auth';
const TOKEN_KEY = 'todo_app_token';
const REFRESH_TOKEN_KEY = 'todo_app_refresh_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setRefreshToken = (refreshToken) => localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
export const removeTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const login = async ({ email, password }) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });

  if (response.data?.token) {
    setToken(response.data.token);
  }
  if (response.data?.refreshToken) {
    setRefreshToken(response.data.refreshToken);
  }

  return response.data;
};

export const register = async ({ email, password, passwordConfirm }) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    email,
    password,
    passwordConfirm,
  });
  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await axios.post(`${API_BASE_URL}/refresh`, {
    refreshToken,
  });

  if (response.data?.token) {
    setToken(response.data.token);
  }
  if (response.data?.refreshToken) {
    setRefreshToken(response.data.refreshToken);
  }

  return response.data;
};

export const logout = async () => {
  const refreshToken = getRefreshToken();
  removeTokens();

  try {
    await axios.post(`${API_BASE_URL}/logout`, { refreshToken });
  } catch (err) {
    // ログアウト処理はクライアント側のセッション破棄を優先する
  }
};
