# DB設計

## 概要

ログイン機能追加に伴い、SQLiteからMariaDB(MySQL互換)に移行。ユーザー管理とタスクのユーザー関連付けを実現。

## DB移行

- **移行元**: SQLite
- **移行先**: MariaDB (MySQL互換)
- **理由**: 学習目的での無料DB利用、複数ユーザー対応、インストールの簡易性
- **移行手順**:
  1. MariaDBインストール・セットアップ
  2. データベース`todo_app`作成
  3. スキーマ作成
  4. データ移行スクリプト実行

## テーブル一覧

- users：ユーザー情報を管理するテーブル
- tasks：タスク情報を管理するテーブル（user_id追加）

---

## usersテーブル

### 概要

ユーザー認証・権限管理情報を保持する

### カラム定義

| カラム名       | 型           | 制約                                        | 説明                        |
| -------------- | ------------ | ------------------------------------------- | --------------------------- |
| id             | SERIAL       | PRIMARY KEY                                 | ユーザーID                  |
| email          | VARCHAR(255) | UNIQUE, NOT NULL                            | メールアドレス              |
| password_hash  | VARCHAR(255) | NOT NULL                                    | パスワードハッシュ (bcrypt) |
| role           | VARCHAR(20)  | NOT NULL, CHECK (role IN ('user', 'admin')) | ロール                      |
| locked_until   | TIMESTAMP    |                                             | アカウントロック解除時刻    |
| login_attempts | INTEGER      | DEFAULT 0                                   | ログイン失敗回数            |
| created_at     | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                   | 作成日時                    |
| updated_at     | TIMESTAMP    |                                             | 更新日時                    |

### CREATE文

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin')),
  locked_until TIMESTAMP,
  login_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## tasksテーブル

### 概要

タスク管理アプリにおけるタスク情報を保持する。ユーザー関連付けを追加。

---

### カラム定義

| カラム名   | 型           | 制約                      | 説明       |
| ---------- | ------------ | ------------------------- | ---------- |
| id         | SERIAL       | PRIMARY KEY               | タスクID   |
| user_id    | INTEGER      | NOT NULL, FOREIGN KEY     | ユーザーID |
| title      | VARCHAR(100) | NOT NULL                  | タスク内容 |
| status     | VARCHAR(20)  | NOT NULL, CHECK制約あり   | タスク状態 |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP | 作成日時   |
| updated_at | TIMESTAMP    |                           | 更新日時   |

---

### ステータス定義

| 値    | 意味   |
| ----- | ------ |
| todo  | 未着手 |
| doing | 実施中 |
| done  | 完了   |

---

### CREATE文

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('todo', 'doing', 'done')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);
```

## tasksテーブル

### 概要

タスク管理アプリにおけるタスク情報を保持する

---

### カラム定義

| カラム名   | 型           | 制約                      | 説明       |
| ---------- | ------------ | ------------------------- | ---------- |
| id         | SERIAL       | PRIMARY KEY               | タスクID   |
| title      | VARCHAR(100) | NOT NULL                  | タスク内容 |
| status     | VARCHAR(20)  | NOT NULL, CHECK制約あり   | タスク状態 |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP | 作成日時   |
| updated_at | TIMESTAMP    |                           | 更新日時   |

---

### ステータス定義

| 値    | 意味   |
| ----- | ------ |
| todo  | 未着手 |
| doing | 実施中 |
| done  | 完了   |

---

### CREATE文

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('todo', 'doing', 'done')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);
```
