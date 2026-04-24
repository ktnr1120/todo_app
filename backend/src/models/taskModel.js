/*******************************************
*
*   ファイル名     ：taskModel.js
*   概要           ：DB操作のモデル定義
*
*********************************************/

// DB接続プールをインポート
const db = require('../config/db');

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

module.exports = {
    countTasks
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