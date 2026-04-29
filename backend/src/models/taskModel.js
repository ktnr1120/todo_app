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
*                                                                 2026.04.29追加
*         メソッド             ：タスク一覧取得（GET /tasks）
*           クエリパラメータ    ：page   = 表示ページ番号
*                               keyword = タイトル検索キーワード
*                               status  = タスク状態(todo / doing / done)
*         内容                 ：ページ番号、キーワード、ステータスを受け取り、
*                                 条件に合致するタスクの一覧を返す
*         備考                 ：ページング、キーワード検索、ステータスフィルタに対応
*
*******************************************************************************/
exports.getTasksList = ({ page, perPage, keyword, status }) => {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * perPage;
        const conditions = [];
        const params = [];

        if (keyword) {
            conditions.push('title LIKE ?');
            params.push(`%${keyword}%`);
        }

        if (status) {
            conditions.push('status = ?');
            params.push(status);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        db.get(`SELECT COUNT(*) AS count FROM tasks ${whereClause}`, params, (countErr, countResult) => {
            if (countErr) {
                return reject(countErr);
            }

            const total = countResult.count;

            db.all(
                `SELECT id,title,status,created_at,updated_at
                FROM tasks ${whereClause}
                ORDER BY id DESC
                LIMIT ? OFFSET ?`,
                [...params, perPage, offset],
                (listErr, tasks) => {
                    if (listErr) {
                    return reject(listErr);
                    }

                    resolve({ 
                        page,
                        per_page: perPage,
                        total,
                        tasks
                    });
                }
            );
        });
    });
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
*                                                                 2026.04.29追加
*         メソッド             ：タスク一覧取得（GET /tasks）
*         クエリパラメータ      ： page, keyword, status
*         内容                 ：ページ番号、キーワード、ステータスを受け取り、
*                                 条件に合致するタスクの一覧を返す
*         備考                 ：ページング、キーワード検索、ステータスフィルタに対応
*
*******************************************************************************/
// タスクを取得する関数
exports.findTasks = (whereClause, params, perPage, offset, callback) => {
    db.all(
      `SELECT id, title, status FROM tasks ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, perPage, offset],
      callback
    );
};

module.exports = {
    getTasksList,
    countTasks,
    findTasks
};

/*
async function insertTask(title) {
    // sqlにSQLクエリを設定
    const sql = 'INSERT INTO tasks (title) VALUES (?)';
    // 配列resultに引数titleをsqlで実行した結果を格納
    const [result] = await db.execute(sql, [title]);
    return result;
}
*/

// 他のDB操作関数もここに追加可能（例: getTasks, updateTask, deleteTaskなど）
module.exports = {
    insertTask
};