# TODO App 開発レポート

## 作成日時

2026年4月11日

## 概要

TODO App のバックエンド開発（Node.js + Express + SQLite）を実施。CRUD機能の実装とPostmanでの動作確認まで完了。

## 実施したこと

### 1. ソフトウェアのダウンロード・インストール

- **Node.js**: v24.14.1 (LTS版)
- **npm**: 11.11.0
- **Postman**: Web版 (https://web.postman.co/) で動作確認

### 2. プロジェクト構造の作成

```
backend/
├── .env                    # 環境変数設定ファイル
├── package.json            # npm設定ファイル
├── src/
│   ├── server.js           # Expressサーバー起動ファイル
│   ├── db.js               # SQLiteデータベース接続・初期化
│   ├── routes/
│   │   └── tasks.js        # タスク関連APIルーティング
│   └── controllers/
│       └── taskController.js # タスクCRUD処理
└── database/
    └── todos.db            # SQLiteデータベースファイル（自動生成）
```

### 3. インストールしたnpmパッケージ

- **express**: ^5.2.1 - Webサーバーフレームワーク
- **cors**: ^2.8.6 - クロスオリジン対応（フロント連携用）
- **dotenv**: ^17.4.1 - 環境変数管理
- **sqlite3**: ^6.0.1 - SQLiteデータベースドライバ

### 4. 実装した機能

- **サーバー起動**: `npm start` でポート3000で起動
- **DB初期化**: 起動時に `tasks` テーブル自動作成
- **CRUD API**:
  - `GET /tasks` - タスク一覧取得（ページング、キーワード検索、ステータスフィルタ対応）
  - `GET /tasks/:id` - タスク詳細取得
  - `POST /tasks` - タスク作成
  - `PUT /tasks/:id` - タスク更新
  - `DELETE /tasks/:id` - タスク削除
- **バリデーション**: 入力値チェック、エラーハンドリング
- **ヘルスチェック**: `GET /health` - サーバー動作確認用

## 確認できたところ

### Postmanでの動作確認（✅ 成功）

- **タスク一覧取得 (GET /tasks)**:
  - レスポンス: `{"page":1,"per_page":10,"total":0,"tasks":[]}`
  - ステータス: 200 OK

- **タスク作成 (POST /tasks)**:
  - リクエストボディ: `{"title":"テストタスク","status":"todo"}`
  - レスポンス: `{"id":1,"title":"テストタスク","status":"todo","created_at":"2026-04-11T...","updated_at":null}`
  - ステータス: 201 Created

### 仕様書との整合性確認

- **API.md**: エンドポイント、レスポンス形式が一致
- **DB.md**: テーブル構造、ステータス定義が一致
- **requirement.md**: CRUD機能、検索・フィルタ機能が実装済み

## 次回予定

- フロントエンド（React）の実装
- バックエンドとの連携テスト
- UI/UXの設計・実装

## 備考

- git構成管理対象外のため、このレポートはローカル保存のみ
- サーバーは `localhost:3000` で起動中
- データベースはSQLiteを使用（ファイルベース）
