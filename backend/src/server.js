require('dotenv').config();
const express = require('express');
const cors = require('cors');

// TODO: ログイン機能追加 - セッション設定追加
// const session = require('express-session');
// const PgSession = require('connect-pg-simple')(session);

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(express.json());
app.use(cors());

// TODO: ログイン機能追加 - セッション設定追加
// app.use(session({
//   store: new PgSession({
//     pool: require('./db'), // PostgreSQL接続
//     tableName: 'session'
//   }),
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: process.env.NODE_ENV === 'production',
//     httpOnly: true,
//     maxAge: parseInt(process.env.SESSION_MAX_AGE)
//   }
// }));

// TODO: ログイン機能追加 - 認証ミドルウェア追加
// const authMiddleware = require('./middleware/auth');
// app.use('/tasks', authMiddleware); // タスクAPIに認証必須

// ルートインポート（後で追加）
// const tasksRouter = require('./routes/tasks');
// app.use('/tasks', tasksRouter);

// DBとルートを読み込む
const db = require('./db');
const tasksRouter = require('./routes/tasks');
app.use('/tasks', tasksRouter);

// TODO: ログイン機能追加 - 認証ルート追加
// const authRouter = require('./routes/auth');
// app.use('/auth', authRouter);

// ヘルスチェック（動作確認用）
app.get('/health', (req, res) => {
    res.json({ status: 'OK'});
});

// TODO: ログイン機能追加 - ログイン/ログアウトAPI追加
// app.post('/login', ...);
// app.post('/logout', ...);

module.exports = app;

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// テスト用にエクスポート 
module.exports = app;
