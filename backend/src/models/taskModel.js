/*******************************************
*
*   ファイル名     ：taskModel.js
*   概要           ：DB操作のモデル定義
*
*********************************************/

// DB接続プールをインポート
const { jsx } = require('react/jsx-runtime');
const db = require('../config/db');



/*******************************************************************************
*                                                                 2026.04.30更新
*         メソッド             ：タスク一覧取得（GET /tasks）
*           クエリパラメータ    ：page   = 表示ページ番号
*                               keyword = タイトル検索キーワード
*                               status  = タスク状態(todo / doing / done)
*         内容                 ：ページ番号、キーワード、ステータスを受け取り、
*                                 条件に合致するタスクの一覧を返す
*         備考                 ：ページング、キーワード検索、ステータスフィルタに対応
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
        // 取得したタスク一覧と総件数を返す
        return rows[0];
    }
    catch(err) {
        // DB処理エラーはcontroller側でハンドリングするため再送出
        throw err;        
    }
};


/*******************************************************************************
*                                                                 2026.04.xx追加
*         メソッド             ：タスク作成（POST /tasks）
*         クエリパラメータ      ： title, status
*         内容                 ：タイトルとステータスを受け取り、新しいタスクを作成
*         備考                 ：入力バリデーションも実施
*
*******************************************************************************/
async function insertTask(title) {
    // sqlにSQLクエリを設定
    const sql = 'INSERT INTO tasks (title) VALUES (?)';
    // 配列resultに引数titleをsqlで実行した結果を格納
    const [result] = await db.execute(sql, [title]);
    return result;
}

/*******************************************************************************
*                                                                 2026.04.xx追加
*         メソッド             ：タスク更新（PUT /tasks/:id）
*         クエリパラメータ      ： title, status
*         内容                 ：タイトルとステータスを受け取り、タスクを更新
*         備考                 ：なし
*
*******************************************************************************/


/*******************************************************************************
*                                                                 2026.04.30追加
*         メソッド             ：タスク削除（DELETE /tasks）
*         URLパラメータ         ： id = タスクID
*         内容                 ：指定したIDのタスクを削除する
*         備考                 ：削除対象が存在しない場合はNOT_FOUNDを返す
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