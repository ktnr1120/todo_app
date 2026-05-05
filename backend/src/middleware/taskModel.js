/*******************************************
*
*   ファイル名     ：taskModel.js
*   概要           ：DB操作のモデル定義
*
*********************************************/

const db = require('../config/db');
// const { param } = require('../routes/tasks');

// タスクの件数を取得する関数
exports.countTasks = (whereClause, params, callback) => {
    db.getConnection(
        `SELECT COUNT(*) AS count FROM tasks ${whereClause}`,
        params,
        callback
    );
};

// タスクを取得する関数
exports.findTasks = (whereClause, params, perPage, offset, callback) => {
    db.all(
      `SELECT id, title, status FROM tasks ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, perPage, offset],
      callback
    );
};