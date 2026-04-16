const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// TODO: ログイン機能追加 - PostgreSQL移行時に以下を変更
// const { Pool } = require('pg');
// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
// });

// 環境変数からDBパスを読み込み。指定がなければ backend/database/todos.db を使う
const dbPath = process.env.DB_PATH || path.join(__dirname, '../database/todos.db');
const dbDir = path.dirname(dbPath);

// DBファイル格納先のディレクトリが存在しない場合は作成する
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// SQLiteデータベースに接続
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database:', dbPath);
});

// 初回起動時に tasks テーブルを作成する
// すでに存在する場合は何もしない
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('todo', 'doing', 'done')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT
    )
  `);
  // TODO: ログイン機能追加 - usersテーブル作成とtasksテーブルにuser_id追加
  // db.run(`CREATE TABLE IF NOT EXISTS users (...)`);
  // db.run(`ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id)`);
});

// 他のモジュールから db を使えるようにエクスポート
module.exports = db;
