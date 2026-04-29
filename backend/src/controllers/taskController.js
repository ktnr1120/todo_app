/*******************************************
*
*   ファイル名     ：taskController.js
*   概要           ：リクエスト／レスポンス制御
*
*********************************************/

const taskService = require('../services/taskService');
const taskModel = require('../models/taskModel');
const db = require('../config/db');

// 有効なステータス値の定義
const VALID_STATUSES = ['todo', 'doing', 'done'];
// デフォルトの1ページあたりの表示件数
const DEFAULT_PER_PAGE = 10;


// ステータス値のバリデーション関数
function validateStatus(status) {
  return status && VALID_STATUSES.includes(status);
}

// エラーレスポンスを統一して送信する関数
function sendError(res, code, message, status = 400) {
  return res.status(status).json({ code, message, details: [] });
}

/*2026.04.29改修前
exports.getTasks = async (req, res) => {
  try {
    const result = await taskService.getTasks(req.query);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message});
  }
};

// タスク一覧取得（GET /tasks）
// クエリパラメータ: page, keyword, status
// ページング、キーワード検索、ステータスフィルタに対応
exports.getTasks = (req, res) => {
  // クエリパラメータからページ番号を取得（デフォルト1ページ目）
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const perPage = DEFAULT_PER_PAGE;
  const { keyword, status } = req.query;
  const offset = (page - 1) * perPage;

  // WHERE句の条件とパラメータを動的に構築
  const conditions = [];
  const params = [];

  // キーワード検索（タイトルに含まれる場合）
  if (keyword) {
    conditions.push('title LIKE ?');
    params.push(`%${keyword}%`);
  }

  // ステータスフィルタ(バリデーションも実施)
  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return sendError(res, 'VALIDATION_ERROR', 'statusの値が不正です', 400);
    }
    conditions.push('status = ?');
    params.push(status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // ★総件数を取得
  taskModel.countTasks(whereClause, params, (countErr, countRow) => {
    if (countErr) {
      return sendError(res, 'DB_ERROR', 'タスクの取得に失敗しました', 500);
    }

    const total = countRow.count;

    // ★タスク一覧を取得（ページング適用）
    taskModel.findTasks(whereClause, params, perPage, offset, (listErr, tasks) => {
      if (listErr) {
        return sendError(res, 'DB_ERROR', 'タスク一覧の取得に失敗しました', 500);
      }

      return res.json({
        page,
        per_page: perPage,
        total,
        tasks,
      });
    });
  });
};
*/

/*******************************************************************************
*
*   メソッド名         ：タスク一覧取得（GET /tasks）
*   クエリパラメータ   ：page    = 表示ページ番号
*                        keyword = タイトル検索キーワード
*                        status  = タスク状態(todo / doing / done)
*   処理概要           ：条件に一致するタスク一覧をページングして取得する
*   備考               ：ページング、キーワード検索、ステータス絞り込み対応
*   作成日             ：2026.04.29
*
*******************************************************************************/
exports.getTasks = async  (req, res) => {
  // クエリパラメータからページ番号を取得（デフォルト1ページ目）
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const perPage = DEFAULT_PER_PAGE;
  const { keyword, status } = req.query;

  // ステータスフィルタ(バリデーションも実施)
  if (status && !VALID_STATUSES.includes(status)) {
    return sendError(res, 'VALIDATION_ERROR', 'statusの値が不正です', 400);
  }

  // ★総件数を取得
  try {
    const result = await taskModel.getTasksList({
      page,
      perPage,
      keyword,
      status
    });

    return res.json(result);

  } catch (Err) {
    return sendError(res, 'DB_ERROR', 'タスクの取得に失敗しました', 500);
  }
};


/*******************************************************************************
*                                                                 2026.04.xx追加
*         メソッド             ：タスク詳細取得（GET /tasks/:id）
*         クエリパラメータ      ：なし
*         内容                 ：URLパラメータで受け取ったIDに該当するタスクの詳細を返す
*         備考                 ：IDに該当するタスクを取得
*
*******************************************************************************/
exports.getTaskById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return sendError(res, 'VALIDATION_ERROR', 'IDが不正です', 400);
  }
  // ★IDに該当するタスクを取得
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
    if (err) {
      return sendError(res, 'DB_ERROR', 'タスクの取得に失敗しました', 500);
    }
    if (!task) {
      return sendError(res, 'NOT_FOUND', 'タスクが見つかりません', 404);
    }

    return res.json(task);
  });
};


/*******************************************************************************
*                                                                 2026.04.xx追加
*         メソッド             ：タスク作成（POST /tasks）
*         クエリパラメータ      ：タイトルは必須、ステータスは任意（デフォルトは'todo'）
*         内容                 ：タイトルとステータスを受け取り、新しいタスクを作成
*         備考                 ：入力バリデーションも実施
*
*******************************************************************************/
exports.createTask = (req, res) => {
  const { title, status = 'todo' } = req.body;

  if (!title || typeof title !== 'string') {
    return sendError(res, 'VALIDATION_ERROR', 'タイトルは必須です', 400);
  }
  if (title.length > 100) {
    return sendError(res, 'VALIDATION_ERROR', 'タイトルは100文字以内で入力してください', 400);
  }
  if (!validateStatus(status)) {
    return sendError(res, 'VALIDATION_ERROR', 'statusの値が不正です', 400);
  }

  const query = 'INSERT INTO tasks (title, status) VALUES (?, ?)';
  // ★新しいタスクを挿入
  db.run(query, [title, status], function (err) {
    if (err) {
      return sendError(res, 'DB_ERROR', 'タスクの作成に失敗しました', 500);
    }

    const newTaskId = this.lastID;
    // ★作成したタスクの詳細を取得してレスポンスに返す
    db.get('SELECT * FROM tasks WHERE id = ?', [newTaskId], (getErr, task) => {
      if (getErr) {
        return sendError(res, 'DB_ERROR', '作成したタスクの取得に失敗しました', 500);
      }
      return res.status(201).json(task);
    });
  });
};


/*******************************************************************************
*                                                                 2026.04.xx追加
*         メソッド             ：タスク更新（PUT /tasks/:id）
*         クエリパラメータ      ：ID（URLパラメータ）
*         内容                 ：タイトルとステータスの両方、またはいずれかを更新可能
*         備考                 ：入力バリデーションも実施
*
*******************************************************************************/
exports.updateTask = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, status } = req.body;

  if (Number.isNaN(id)) {
    return sendError(res, 'VALIDATION_ERROR', 'IDが不正です', 400);
  }
  if (title && typeof title !== 'string') {
    return sendError(res, 'VALIDATION_ERROR', 'タイトルは文字列で指定してください', 400);
  }
  if (title && title.length > 100) {
    return sendError(res, 'VALIDATION_ERROR', 'タイトルは100文字以内で入力してください', 400);
  }
  if (status && !validateStatus(status)) {
    return sendError(res, 'VALIDATION_ERROR', 'statusの値が不正です', 400);
  }

  // ★IDに該当するタスクが存在するか確認
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (findErr, task) => {
    if (findErr) {
      return sendError(res, 'DB_ERROR', 'タスクの取得に失敗しました', 500);
    }
    if (!task) {
      return sendError(res, 'NOT_FOUND', 'タスクが見つかりません', 404);
    }

    const updates = [];
    const params = [];

    if (title) {
      updates.push('title = ?');
      params.push(title);
    }
    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    if (updates.length === 0) {
      return sendError(res, 'VALIDATION_ERROR', '更新するフィールドを指定してください', 400);
    }

    params.push(new Date().toISOString());
    params.push(id);

    const updateQuery = `UPDATE tasks SET ${updates.join(', ')}, updated_at = ? WHERE id = ?`;
    // ★タスクを更新
    db.run(updateQuery, params, (updateErr) => {
      if (updateErr) {
        return sendError(res, 'DB_ERROR', 'タスクの更新に失敗しました', 500);
      }
      return res.json({ message: 'Task updated successfully' });
    });
  });
};


/*******************************************************************************
*                                                                 2026.04.xx追加
*         メソッド             ：タスク削除（DELETE /tasks/:id）
*         クエリパラメータ      ：ID（URLパラメータ）
*         内容                 ：IDに該当するタスクを削除
*         備考                 ：IDに該当するタスクが存在するか確認し、存在しない場合は404エラーを返す
*
*******************************************************************************/
exports.deleteTask = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return sendError(res, 'VALIDATION_ERROR', 'IDが不正です', 400);
  }

  // ★IDに該当するタスクが存在するか確認
  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      return sendError(res, 'DB_ERROR', 'タスクの削除に失敗しました', 500);
    }
    if (this.changes === 0) {
      return sendError(res, 'NOT_FOUND', 'タスクが見つかりません', 404);
    }
    return res.json({ message: 'Task deleted successfully' });
  });
};