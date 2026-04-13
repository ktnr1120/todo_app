import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // タスク一覧を取得
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (searchKeyword) params.keyword = searchKeyword;

      console.log('タスク取得開始:', params);
      const data = await getTasks(params);
      console.log('タスク取得成功:', data);
      setTasks(data.tasks || []);
      setError(null);
    } catch (err) {
      console.error('タスク取得エラー詳細:', err);
      console.error('エラーレスポンス:', err.response?.data);
      console.error('エラーステータス:', err.response?.status);
      setError('タスクの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 初回読み込み
  useEffect(() => {
    fetchTasks();
  }, []);

  // フィルタ変更時に再取得
  useEffect(() => {
    fetchTasks();
  }, [filterStatus, searchKeyword]);

  // 新規タスク作成
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    console.log('タスク作成開始:', newTaskTitle.trim());

    try {
      const result = await createTask({ title: newTaskTitle.trim(), status: 'todo' });
      console.log('タスク作成成功:', result);
      setNewTaskTitle('');
      fetchTasks(); // 再取得
    } catch (err) {
      console.error('タスク作成エラー詳細:', err);
      console.error('エラーレスポンス:', err.response?.data);
      console.error('エラーステータス:', err.response?.status);
      setError(`タスクの作成に失敗しました: ${err.message}`);
    }
  };

  // タスク削除
  const handleDeleteTask = async (id) => {
    if (!window.confirm('このタスクを削除しますか？')) return;

    try {
      await deleteTask(id);
      fetchTasks(); // 再取得
    } catch (err) {
      setError('タスクの削除に失敗しました');
      console.error(err);
    }
  };

  // ステータス更新
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTask(id, { status: newStatus });
      fetchTasks(); // 再取得
    } catch (err) {
      setError('タスクの更新に失敗しました');
      console.error(err);
    }
  };

  return (
    <div className="app">
      <h1>TODO App</h1>

      {error && <div className="error">{error}</div>}

      {/* 新規タスク作成フォーム */}
      <form onSubmit={handleCreateTask} className="task-form">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          required
        />
        <button type="submit">追加</button>
      </form>

      {/* フィルタと検索 */}
      <div className="filters">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">すべてのステータス</option>
          <option value="todo">未着手</option>
          <option value="doing">実施中</option>
          <option value="done">完了</option>
        </select>

        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="キーワード検索..."
        />
      </div>

      {/* タスク一覧 */}
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
                  <h3>{task.title}</h3>
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
    </div>
  );
}

export default App;
