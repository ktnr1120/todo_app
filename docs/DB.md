# DB設計

## テーブル一覧

- tasks：タスク情報を管理するテーブル

---

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
