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
    // Modelの関数を呼び出してタスク一覧を取得
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

/*2026.04.18新規
exports.getTasks = async (req, res) => {
  try {
    const result = await taskService.getTasks(req.query);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message});
  }
};
*/


/*******************************************************************************
*
*   メソッド名         ：タスク詳細取得（GET /tasks/:id）
*   URLパラメータ      ：id = タスクID
*   処理概要           ：指定したIDに該当するタスク詳細を取得する
*   備考               ：該当データが存在しない場合は404エラーを返す
*   作成日             ：2026.04.30
*
*******************************************************************************/
exports.getTaskById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  // バリデーション
  if (Number.isNaN(id)) {
    return sendError(res, 'VALIDATION_ERROR', 'IDが不正です', 400);
  }

  try {
    const result = await taskModel.getTaskById(id);
    return res.json(result);

  } catch {
    // ★IDに該当するタスクが存在しない場合は404エラーを返す
    if (err.code === 'NOT_FOUND')
    {
      return sendError(res, 'NOT_FOUND', 'タスクが見つかりません', 404);
    }
    // その他のエラーはDBエラーとして500エラーを返す
    return sendError(res, 'DB_ERROR', 'タスクの削除に失敗しました', 500);
  }
};


/*******************************************************************************
*
*   メソッド名         ：タスク作成（POST /tasks）
*   リクエストボディ   ：title  = タスクタイトル（必須）
*                        status = タスク状態（任意、未指定時todo）
*   処理概要           ：タイトルとステータスを受け取り、新しいタスクを作成する
*   備考               ：入力バリデーションを実施する
*   作成日             ：2026.04.30
*
*******************************************************************************/
exports.createTask = async (req, res) => {
  const { title, status = 'todo' } = req.body;

  // タイトルが空白
  if (!title || typeof title !== 'string') {
    return sendError(res, 'VALIDATION_ERROR', 'タイトルは必須です', 400);
  }
  // タイトルが100文字オーバー
  if (title.length > 100) {
    return sendError(res, 'VALIDATION_ERROR', 'タイトルは100文字以内で入力してください', 400);
  }
  // ステータスが不正
  if (!validateStatus(status)) {
    return sendError(res, 'VALIDATION_ERROR', 'statusの値が不正です', 400);
  }

  try {
    const result = await taskModel.insertTask(title, status);
    return res.status(201).json(result);
  } catch(err) {
      return sendError(res, 'DB_ERROR', 'タスクの作成に失敗しました', 500);
  }
};


/*******************************************************************************
*
*   メソッド名         ：タスク更新（PUT /tasks/:id）
*   URLパラメータ      ：id = タスクID
*   リクエストボディ   ：title  = タスクタイトル（任意）
*                        status = タスク状態（任意）
*   処理概要           ：指定したタスクの情報を更新する
*   備考               ：入力バリデーションを実施する
*   作成日             ：2026.05.06
*
*******************************************************************************/
exports.updateTask = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, status } = req.body;

  // IDチェック
  if (Number.isNaN(id)) {
    return sendError(res, 'VALIDATION_ERROR', 'IDが不正です', 400);
  }
  // 更新項目チェック
  if (!title && !status){
    return sendError(res, 'VALIDATION_ERROR', '更新する項目を指定してください', 400);
  }
  // タイトルチェック
  if (title && typeof title !== 'string') {
    return sendError(res, 'VALIDATION_ERROR', 'タイトルは文字列で指定してください', 400);
  }
  // タイトル文字数チェック
  if (title && title.length > 100) {
    return sendError(res, 'VALIDATION_ERROR', 'タイトルは100文字以内で入力してください', 400);
  }
  // ステータスチェック
  if (status && !validateStatus(status)) {
    return sendError(res, 'VALIDATION_ERROR', 'statusの値が不正です', 400);
  }

  try {
    // タスクの存在チェック（5.06に削除（DB2回アクセスするため））
    // await taskModel.getTaskById(id);
    // タスクの更新
    const result = await taskModel.updateTaskById(id,title,status);

    return res.json(result);

  } catch(err) {
    // ★IDに該当するタスクが存在しない場合は404エラーを返す
    if (err.code === 'NOT_FOUND')
    {
      return sendError(res, 'NOT_FOUND', 'タスクが見つかりません', 404);
    }
    // その他のエラーはDBエラーとして500エラーを返す
    return sendError(res, 'DB_ERROR', 'タスクの更新に失敗しました', 500);
  }
};
// 変更前
  /*/ ★IDに該当するタスクが存在するか確認
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
};*/


/*******************************************************************************
*
*         メソッド             ：タスク削除（DELETE /tasks/:id）
*         クエリパラメータ      ：URLパラメータ       ：id = タスクID
*         内容                 ：指定したIDのタスクを削除する
*         備考                 ：存在しないIDの場合は404エラーを返す
*         作成日               ：2026.04.30
*
*******************************************************************************/
exports.deleteTask = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id))
  {
    return sendError(res, 'VALIDATION_ERROR', 'IDが不正です', 400);
  }

  try
  {
    // タスク削除処理を実行
    await taskModel.deleteTaskById(id);
    return res.json({ message: 'タスクを削除しました。' });
  }
  catch (err)
  {
    // ★IDに該当するタスクが存在しない場合は404エラーを返す
    if (err.code === 'NOT_FOUND')
    {
      return sendError(res, 'NOT_FOUND', 'タスクが見つかりません', 404);
    }

    // その他のエラーはDBエラーとして500エラーを返す
    return sendError(res, 'DB_ERROR', 'タスクの削除に失敗しました', 500);
  }
};

/*  一段階目SQliteでの処理
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
};*/