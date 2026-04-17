# ログイン機能設計書

## 作成日時

2026年4月16日

## 1. 概要

既存のTODOアプリに認証機能を追加し、ユーザー単位でのデータ管理を実現する。セッションベース認証を採用し、セキュリティを確保しながらシンプルな実装とする。

## 2. 機能要件

### 2.1 認証対象

- 未ログインユーザーは全機能利用不可
- 例外: ヘルスチェックAPI (/health) は未認証アクセス可能

### 2.2 ユーザー種別

- 一般ユーザー (user)
- 管理者 (admin)

### 2.3 権限管理

- usersテーブルにroleカラムを保持
- ロールに応じた機能制御を実施

### 2.4 認証方式

- メールアドレス + パスワード認証
- 外部認証 (Google等) は対象外

### 2.5 セッション管理

- セッションベース認証
- セッションIDをHttpOnly属性付きCookieに保存
- HTTPS環境ではSecure属性有効化
- セッション有効期限: 30分 (スライディングセッション)
- 同一ユーザー同時ログイン不可 (新規ログインで既存セッション破棄)

### 2.6 パスワード仕様

- 入力条件: 英数字8文字以上
- 保存方式: bcryptハッシュ化 (平文保存禁止)

### 2.7 ログイン制御

- エラーメッセージ: 「メールアドレスまたはパスワードが違います」(統一メッセージ)
- ロックアウト: ログイン失敗5回で10分間アカウントロック

## 3. API設計

### 3.1 ログインAPI

- **エンドポイント**: POST /login
- **リクエストボディ**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **レスポンス (成功)**:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```
- **レスポンス (失敗)**:
  ```json
  {
    "message": "メールアドレスまたはパスワードが違います"
  }
  ```

### 3.2 ログアウトAPI

- **エンドポイント**: POST /logout
- **レスポンス**:
  ```json
  {
    "message": "Logout successful"
  }
  ```

### 3.3 認証状態確認API

- **エンドポイント**: GET /auth/status
- **レスポンス**:
  ```json
  {
    "authenticated": true,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "user"
    }
  }
  ```

## 4. データベース設計

### 4.1 DB移行

- SQLite → MariaDB(MySQL互換)に移行
- 既存データはマイグレーションスクリプトで移行

### 4.2 usersテーブル

| カラム名       | 型                    | 制約                             | 説明                        |
| -------------- | --------------------- | -------------------------------- | --------------------------- |
| id             | INT AUTO_INCREMENT    | PRIMARY KEY                      | ユーザーID                  |
| email          | VARCHAR(255)          | UNIQUE, NOT NULL                 | メールアドレス              |
| password_hash  | VARCHAR(255)          | NOT NULL                         | パスワードハッシュ (bcrypt) |
| role           | ENUM('user', 'admin') | NOT NULL, DEFAULT 'user'         | ロール                      |
| locked_until   | TIMESTAMP             | NULL                             | アカウントロック解除時刻    |
| login_attempts | INT                   | DEFAULT 0                        | ログイン失敗回数            |
| created_at     | TIMESTAMP             | DEFAULT CURRENT_TIMESTAMP        | 作成日時                    |
| updated_at     | TIMESTAMP             | NULL ON UPDATE CURRENT_TIMESTAMP | 更新日時                    |

### 4.3 todosテーブル変更

- user_idカラム追加 (INT, NOT NULL, FOREIGN KEY REFERENCES users(id))
- 既存タスクはデフォルトユーザー割り当て

## 5. フロントエンド設計

### 5.1 画面構成

- **ログインページ (/login)**: メールアドレス/パスワード入力フォーム
- **メイン画面**: 認証状態に応じて表示/非表示

### 5.2 認証状態管理

- React ContextまたはReduxで認証状態管理
- ページ遷移時に認証チェック
- 未認証時はログインページへリダイレクト

### 5.3 UI要件

- ログイン失敗時のエラーメッセージ表示
- ログアウトボタン配置
- レスポンシブ対応

## 6. セキュリティ要件

### 6.1 CSRF対策

セッションベース認証によりCSRF攻撃を防ぐ。以下の対策を実施：

- **セッションCookieのSameSite属性**: `SameSite=Lax` または `SameSite=Strict` を設定し、クロスサイトリクエストを制限
- **Origin/Refererヘッダーチェック**: APIリクエスト時にOriginまたはRefererヘッダーを検証し、許可されたドメインからのみアクセスを許可
- **CSRFトークン**: 必要に応じて、フォーム送信時にCSRFトークンを付与（セッションIDとは別）
- **POST/PUT/DELETEメソッド制限**: 状態変更を伴うリクエストはPOST/PUT/DELETEに限定し、GETは安全な読み取り専用に使用

### 6.2 XSS対策

クロスサイトスクリプティング攻撃を防ぐため、以下の対策を実施：

- **出力時エスケープ**: ユーザー入力データをHTML出力時にエスケープ
  - HTMLコンテキスト: `<`, `>`, `&`, `"`, `'` をエスケープ
  - JavaScriptコンテキスト: 文字列を適切にクォートし、エスケープ
- **Content Security Policy (CSP)**: HTTPヘッダーでCSPを設定
  - `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`
- **入力サニタイズ**: ユーザー入力時に危険なタグ/スクリプトを除去
  - DOMPurifyライブラリを使用したHTMLサニタイズ
- **クッキー設定**: HttpOnly属性でJavaScriptからのアクセスを禁止

### 6.3 バリデーション

サーバー側で全入力値を検証し、不正データを防ぐ：

- **入力値検証ライブラリ**: express-validator または joi を使用
- **メールアドレス**: RFC準拠の形式チェック、正規表現 `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- **パスワード**: 最小8文字、英数字必須、大文字/小文字/数字の組み合わせ推奨
- **タスクタイトル**: 最大100文字、HTMLタグ禁止、SQLインジェクション防止
- **レートリミティング**: 短時間での大量リクエストを制限（express-rate-limit使用）
- **SQLインジェクション対策**: パラメータ化クエリを使用（pgライブラリのプレースホルダ）
- **エラーメッセージ**: 詳細なエラーを返さず、一般的なメッセージに統一

## 7. ログ管理

- ログイン成功/失敗をサーバーログに出力
- トレースログも出力

## 8. 実装順序

1. DB移行 (PostgreSQLセットアップ、スキーマ変更)
2. バックエンド認証実装 (usersテーブル、セッション管理)
3. API実装 (login/logout/status)
4. フロントエンド認証UI実装
5. 既存APIの認証ミドルウェア適用
6. テスト・デバッグ
