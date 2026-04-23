/*******************************************
*
*   ファイル名     ：db.js
*   概要           ：MariaDBへの接続設定
*
*********************************************/

const mysql = require('mysql2/promise');

// MariaDB接続プール
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 接続テスト
pool.getConnection((err, connection) => {
  if(err) {
    console.error('DB接続エラー', err);
    process.exit(1);
  }
  console.log('DB接続成功');
  connection.release();
});

module.exports = pool;