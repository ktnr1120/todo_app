-- TODO: ログイン機能追加 - PostgreSQLマイグレーションスクリプト新規作成
-- usersテーブル作成
-- CREATE TABLE users (...);

-- tasksテーブルにuser_idカラム追加
-- ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id);

-- セッションテーブル作成（connect-pg-simple用）
-- CREATE TABLE session (...);