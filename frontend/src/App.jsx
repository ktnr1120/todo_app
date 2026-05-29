import { useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getToken } from './api/auth';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks';
import './App.css';

const STATUS_OPTIONS = [
  { value: '', label: 'すべてのステータス' },
  { value: 'todo', label: '未着手' },
  { value: 'doing', label: '実施中' },
  { value: 'done', label: '完了' },
];

const initialAuthForm = {
  email: '',
  password: '',
  passwordConfirm: '',
};

function App() {
  // 認証状態の管理
  const [token, setToken] = useState(getToken());
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState(initialAuthForm);
  const [authError, setAuthError] = useState(null);

  // タスク管理の状態
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskError, setTaskError] = useState(null);

  const isAuthenticated = Boolean(token);

  // 認証後にタスクを取得する
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, filterStatus, searchKeyword]);

  const clearSession = () => {
    apiLogout();
    setToken(null);
    setTasks([]);
    setAuthError('セッションを破棄しました。再度ログインしてください。');
  };

  // タスク一覧取得
  const fetchTasks = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      setTaskError(null);

      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (searchKeyword) params.keyword = searchKeyword;

      const data = await getTasks(params);
      setTasks(data.tasks || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearSession();
        return;
      }
      setTaskError('タスクの取得に失敗しました');
      console.error('fetchTasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 認証エラーハンドリング
  const handleAuthError = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      clearSession();
      return;
    }
    setAuthError(err.response?.data?.message || '認証に失敗しました');
  };

  // ログイン処理
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const data = await apiLogin({
        email: authForm.email.trim(),
        password: authForm.password,
      });
      setToken(data.token);
      setAuthForm(initialAuthForm);
    } catch (err) {
      handleAuthError(err);
    }
  };

  // ユーザー登録処理
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError(null);

    try {
      await apiRegister({
        email: authForm.email.trim(),
        password: authForm.password,
        passwordConfirm: authForm.passwordConfirm,
      });
      setAuthMode('login');
      setAuthForm(initialAuthForm);
      setAuthError('登録が完了しました。ログインしてください。');
    } catch (err) {
      handleAuthError(err);
    }
  };

  // ログアウト処理
  const handleLogout = () => {
    apiLogout();
    setToken(null);
    setTasks([]);
    setAuthError(null);
    setTaskError(null);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await createTask({ title: newTaskTitle.trim(), status: 'todo' });
      setNewTaskTitle('');
      fetchTasks();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearSession();
        return;
      }
      setTaskError('タスクの作成に失敗しました');
      console.error('handleCreateTask error:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('このタスクを削除しますか？')) return;

    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearSession();
        return;
      }
      setTaskError('タスクの削除に失敗しました');
      console.error('handleDeleteTask error:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearSession();
        return;
      }
      setTaskError('タスクの更新に失敗しました');
      console.error('handleStatusChange error:', err);
    }
  };

  return (
    <div className="app">
      <h1>TODO App</h1>

      {isAuthenticated ? (
        <section className="section">
          <header className="section-header">
            <h2>タスク管理</h2>
            <button className="logout-btn" onClick={handleLogout}>
              ログアウト
            </button>
          </header>

          {taskError && <div className="error">{taskError}</div>}

          <form onSubmit={handleCreateTask} className="task-form">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="新しいタスクを入力..."
            />
            <button type="submit">追加</button>
          </form>

          <div className="filters">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="キーワード検索..."
            />
          </div>

          {loading ? (
            <div className="loading">読み込み中...</div>
          ) : (
            <div className="task-list">
              {tasks.length === 0 ? (
                <p>タスクがありません</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <div className="task-content">
                      <div>
                        <h3>{task.title}</h3>
                        <p className="task-meta">ID: {task.id}</p>
                      </div>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option value="todo">未着手</option>
                        <option value="doing">実施中</option>
                        <option value="done">完了</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="delete-btn"
                    >
                      削除
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      ) : (
        <section className="section auth-section">
          <header className="section-header">
            <h2>{authMode === 'login' ? 'ログイン' : 'ユーザー登録'}</h2>
          </header>

          {authError && <div className="error">{authError}</div>}

          <form
            onSubmit={authMode === 'login' ? handleLogin : handleRegister}
            className="auth-form"
          >
            <label>
              メールアドレス
              <input
                type="email"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm({ ...authForm, email: e.target.value })
                }
                required
              />
            </label>
            <label>
              パスワード
              <input
                type="password"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
                required
              />
            </label>
            {authMode === 'register' && (
              <label>
                パスワード確認
                <input
                  type="password"
                  value={authForm.passwordConfirm}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, passwordConfirm: e.target.value })
                  }
                  required
                />
              </label>
            )}
            <button type="submit">
              {authMode === 'login' ? 'ログイン' : '登録する'}
            </button>
          </form>

          <div className="auth-toggle">
            {authMode === 'login' ? (
              <p>
                新規登録は
                <button type="button" onClick={() => setAuthMode('register')}>
                  こちら
                </button>
              </p>
            ) : (
              <p>
                既にアカウントをお持ちの方は
                <button type="button" onClick={() => setAuthMode('login')}>
                  こちら
                </button>
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
