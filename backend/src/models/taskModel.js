/*******************************************
*
*   ファイル名     ：taskModel.js
*   概要           ：DB操作のモデル定義
*
*********************************************/

// DB接続プールをインポート
// const { jsx } = require('react/jsx-runtime');
const db = require('../config/db');



/*******************************************************************************
*
*         メソッド             ：タスク一覧取得（GET /tasks）
*           クエリパラメータ    ：page   = 表示ページ番号
*                               keyword = タイトル検索キーワード
*                               status  = タスク状態(todo / doing / done)
*         内容                 ：ページ番号、キーワード、ステータスを受け取り、
*                                 条件に合致するタスクの一覧を返す
*         備考                 ：ページング、キーワード検索、ステータスフィルタに対応
*         作成日               ：2026.04.30
*
*******************************************************************************/
exports.getTasksList = async ({ page, perPage, keyword, status }) => {
    const offset = (page - 1) * perPage;
    const conditions = [];
    const params = [];

    // キーワード検索（タイトルに含まれる場合）
    if (keyword) {
        conditions.push('title LIKE ?');
        params.push(`%${keyword}%`);
    }
    // ステータ条件追加
    if (status) {
        conditions.push('status = ?');
        params.push(status);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    try{
        // ★総件数を取得してからタスク一覧を取得する
        const [countRows] = db.query(
            `SELECT COUNT(*) AS count FROM tasks ${whereClause}`,
            params
        );
        // queryは配列を返すので,タスクがない場合の画面表示を以下で判定する。
        const total = countRows[0].count;

        // ★複数行取得
        const [tasks] = await db.query(
            `SELECT id,title,status,created_at,updated_at
            FROM tasks ${whereClause}
            ORDER BY id DESC
            LIMIT ? OFFSET ?`,
            [...params, perPage, offset]
        );

        // 取得したタスク一覧と総件数を返す
        return({ 
            page,
            per_page: perPage,
            total,
            tasks
        });
    }
    catch(err) {
        // DB処理エラーはcontroller側でハンドリングするため再送出
        throw err;
    }
};

/* 2026.04.29改修前
// タスクの件数を取得する関数
exports.countTasks = (whereClause, params, callback) => {
    db.getConnection(
        `SELECT COUNT(*) AS count FROM tasks ${whereClause}`,
        params,
        callback
    );
};
*/

/*******************************************************************************
*
*   メソッド名         ：タスク詳細取得（GET /tasks/:id）
*   URLパラメータ      ：id = タスクID
*   処理概要           ：指定したIDに該当するタスク詳細を1件取得する
*   備考               ：該当データが存在しない場合はNOT_FOUNDを返す
*   作成日             :2026.04.30
*
*******************************************************************************/
// タスクを取得する関数
exports.getTaskById = async (id) => {
    try {
        // 取得対象のカラムがわかるように明示的に記載（＊は使用しない）
        const [rows] = await db.query(
            'SELECT id, title, status, created_at, updated_at FROM tasks WHERE id = ?',
            [id]
        );
        // タスクIDがヒットしなかった場合
        if (rows.length === 0) {
            throw ({ code: `NOT_FOUND` });
        }
        // 取得したタスクを返す
        return rows[0];
    }
    catch(err) {
        // DB処理エラーはcontroller側でハンドリングするため再送出
        throw err;        
    }
};


/*******************************************************************************
*
*   メソッド名         ：タスク作成（POST /tasks）
*   リクエストボディ   ：title  = タスクタイトル
*                        status = タスク状態
*   処理概要           ：新しいタスクを作成し、作成したデータを返す
*   作成日             :2026.05.05
*
*******************************************************************************/
exports.insertTask = async (title, status) => {

    try {
        // INSERTの実行
        const [result] = await db.query(
            'INSERT INTO tasks (title, status) VALUES (?, ?)',
            [title, status]
        );

        // INSERTしたIDを取得
        const newId = result.insertId;

        // INSERT結果をSELECT
        const [rows] = await db.query(
            'SELECT id, title, status, created_at, updated_at FROM tasks WHERE id = ?', 
            [newId]
        );

        // SELECT結果を返却
        return rows[0];

    } catch(err) {
        // DB処理エラーはcontroller側でハンドリングするため再送出
        throw err;
    }
};


/*******************************************************************************
*
*   メソッド名         ：タスク更新（PUT /tasks/:id）
*   URLパラメータ      ：id = タスクID
*   リクエストボディ   ：title  = タスクタイトル（任意）
*                        status = タスク状態（任意）
*   処理概要           ：指定したタスクを更新し、更新後データを返す
*   作成日             ：2026.05.06
*
*******************************************************************************/
exports.updateTaskById = async (id,title,status) => {
    const updateTime = new Date();

    // 動的にSET句を組み立て
    const updates = [];
    const params = [];

    if (title !== undefined) {
        updates.push('title = ?');
        params.push(title);
    }

    if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);
    }

    // updated_atは必ず更新
    updates.push('updated_at = ?');
    params.push(updateTime);

    params.push(id);

    try {
        const [result] = await db.query(
            `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        // 念のため存在しない場合にNOTFOUNDを返す
        if(result.affectedRows === 0) {
            throw { code: 'NOT_FOUND' };
        }

        // 更新後データ取得
        const task = await getTaskById(id);

        // 取得したタスクを返す
        return task;

    } catch(err) {
        throw err;
    }
};



/*******************************************************************************
*
*         メソッド             ：タスク削除（DELETE /tasks）
*         URLパラメータ         ： id = タスクID
*         内容                 ：指定したIDのタスクを削除する
*         備考                 ：削除対象が存在しない場合はNOT_FOUNDを返す
*         作成日                :2026.04.30
*
*******************************************************************************/
exports.deleteTaskById = async (id) => {

    try {
        const result = await db.query(`DELETE FROM tasks WHERE id=?`, [id]);
        // タスクIDがヒットしなかった場合
        if (result.affectedRows === 0) {
            throw ({ code: `NOT_FOUND` });
        }
        return;
    }
    catch (err) {
        // DBアクセス異常は呼び出し元へ送出
        throw err;
    }
};

/*
module.exports = {
    getTasksList,
    countTasks,
    findTasks,
    insertTask,
    deleteTaskById
};*/