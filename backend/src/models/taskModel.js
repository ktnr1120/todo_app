/*******************************************
*
*   ファイル名     ：taskModel.js
*   概要           ：DB操作のモデル定義
*
*********************************************/

// DB接続プールをインポート
const db = require('../config/db');

/*
async function countTasks(where, params) {
    const sql = `
        SELECT id, title, status
        FROM tasks
        ${where}
        ORDER BY id DESC
        LIMIT ? OFFSET ?
    `;
    const [rows] = await db.execute(sql, [...params, limit, offset]);
    return rows;
}
*/

// タスクの件数を取得する関数
exports.countTasks = (whereClause, params, callback) => {
    db.getConnection(
        `SELECT COUNT(*) AS count FROM tasks ${whereClause}`,
        params,
        callback
    );
};

exports.findTasks = (whereClause, params, perPage, offset, callback) => {
    db.all(
      `SELECT id, title, status FROM tasks ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, perPage, offset],
      callback
    );
};

module.exports = {
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