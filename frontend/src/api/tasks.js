import axios from 'axios';

// バックエンドAPIのベースURL（proxy設定により /tasks が localhost:3000/tasks に転送される）
const API_BASE_URL = '/tasks';

// タスク一覧取得
export const getTasks = async (params = {}) => {
  console.log('API: getTasks called with params:', params);
  try {
    const response = await axios.get(API_BASE_URL, { params });
    console.log('API: getTasks success:', response.data);
    return response.data;
  } catch (error) {
    console.error('API: getTasks error:', error);
    throw error;
  }
};

// タスク詳細取得
export const getTaskById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('タスク詳細取得エラー:', error);
    throw error;
  }
};

// タスク作成
export const createTask = async (taskData) => {
  console.log('API: createTask called with:', taskData);
  try {
    const response = await axios.post(API_BASE_URL, taskData);
    console.log('API: createTask success:', response.data);
    return response.data;
  } catch (error) {
    console.error('API: createTask error:', error);
    throw error;
  }
};

// タスク更新
export const updateTask = async (id, taskData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error('タスク更新エラー:', error);
    throw error;
  }
};

// タスク削除
export const deleteTask = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('タスク削除エラー:', error);
    throw error;
  }
};