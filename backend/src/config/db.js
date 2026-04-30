/*******************************************
*
*   ファイル名     ：db.js
*   概要           ：MariaDBへの接続設定
*   作成日         :2026.4.30
*   改修内容       :SQlite→MariaDBへマイグレ
*
*********************************************/

const mysql = require('mysql2/promise');

// 接続エラー処理
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.error('DB環境変数が設定されていません。');
  process.exit(1);
}

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

// 接続確認
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('DB接続成功');
    connection/release();
  }
  catch (err)
  {
    console.error('DB接続エラー', err);
    process.exit(1);
  }
})();

module.exports = pool;