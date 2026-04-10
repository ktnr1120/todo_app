require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(express.json());
app.use(cors());

// ルートインポート（後で追加）
// const tasksRouter = require('./routes/tasks');
// app.use('/tasks', tasksRouter);

// DBとルートを読み込む
const db = require('./db');
const tasksRouter = require('./routes/tasks');
app.use('/tasks', tasksRouter);

// ヘルスチェック（動作確認用）
app.get('/health', (req, res) => {
    res.json({ status: 'OK'});
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// テスト用にエクスポート 
module.exports = app;
