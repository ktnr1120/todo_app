/*******************************************
*
*   ファイル名     ：migrate.js
*   概要           ：データベースのCRUD操作処理
*
*********************************************/
const db = require('../src/db');

async function migrate() {
    try {
        // users テーブルの作成
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
            locked_until TIMESTAMP NULL,
            login_attempts INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
            )  
        `);

        // tasksテーブルにuser_id追加（既存テーブルがある場合）
        await db.execute(`
            ALTER TABLE tasks
            ADD COLUMN user_id INT NOT NULL DEFAULT 1,
            ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        `);

        console.log('Migration completed');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();