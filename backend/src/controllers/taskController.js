/*******************************************
*
*   ファイル名     ：taskController.js
*   概要           ：リクエスト／レスポンス制御
*
*********************************************/

const taskService = require('../services/taskService');

exports.getTasks = async (req, res) => {
  try {
    const result = await taskService.getTasks(req.query);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message});
  }
};

// 以下はDBマイグレ前のコード。
/*
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

  // ステータスフィルタ
  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return sendError(res, 'VALIDATION_ERROR', 'statusの値が不正です', 400);
    }
    conditions.push('status = ?');
    params.push(status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // 総件数を取得
  db.get(`SELECT COUNT(*) AS count FROM tasks ${whereClause}`, params, (countErr, row) => {
    if (countErr) {
      return sendError(res, 'DB_ERROR', 'タスクの取得に失敗しました', 500);
    }

    const total = row.count;
    // タスク一覧を取得（ページング適用）
    db.all(
      `SELECT id, title, status FROM tasks ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, perPage, offset],
      (listErr, tasks) => {
        if (listErr) {
          return sendError(res, 'DB_ERROR', 'タスク一覧の取得に失敗しました', 500);
        }

        return res.json({
          page,
          per_page: perPage,
          total,
          tasks,
        });
      }
    );
  });
};

exports.getTaskById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return sendError(res, 'VALIDATION_ERROR', 'IDが不正です', 400);
  }

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
  db.run(query, [title, status], function (err) {
    if (err) {
      return sendError(res, 'DB_ERROR', 'タスクの作成に失敗しました', 500);
    }

    const newTaskId = this.lastID;
    db.get('SELECT * FROM tasks WHERE id = ?', [newTaskId], (getErr, task) => {
      if (getErr) {
        return sendError(res, 'DB_ERROR', '作成したタスクの取得に失敗しました', 500);
      }
      return res.status(201).json(task);
    });
  });
};

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
    db.run(updateQuery, params, (updateErr) => {
      if (updateErr) {
        return sendError(res, 'DB_ERROR', 'タスクの更新に失敗しました', 500);
      }
      return res.json({ message: 'Task updated successfully' });
    });
  });
};

exports.deleteTask = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return sendError(res, 'VALIDATION_ERROR', 'IDが不正です', 400);
  }

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
*/