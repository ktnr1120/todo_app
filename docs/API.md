---

## タスク一覧取得

### エンドポイント
GET /tasks

### クエリパラメータ

| パラメータ | 型  | 必須 | 説明                     |
|------------|-----|------|--------------------------|
| page       | int | 任意 | ページ番号（デフォルト:1） |
| keyword    | string | 任意 | タスク検索キーワード     |
| status     | string | 任意 | タスクステータスフィルタ（todo, doing, done） |

---

---

## 正常系レスポンス例

### 一覧取得（GET /tasks）

````json
{
  "page": 1,
  "per_page": 10,
  "total": 2,
  "tasks": [
    {
      "id": 1,
      "title": "タスク1",
      "status": "todo"
    },
    {
      "id": 2,
      "title": "タスク2",
      "status": "doing"
    }
  ]
}

## 詳細取得（GET/tasks/id）
{
  "id": 1,
  "title": "タスク1",
  "status": "todo",
  "created_at": "2026-04-10T10:00:00Z",
  "updated_at": null
}
---

## 作成（POST /tasks）
{
  "id": 3,
  "title": "新しいタスク",
  "status": "todo",
  "created_at": "2026-04-10T12:00:00Z",
  "updated_at": null
}

## 更新（PUT /tasks/:id）
{
  "message": "Task updated successfully"
}

## 削除（DELETE /tasks/:id）
{
  "message": "Task deleted successfully"
}



## エラー系レスポンス例

### 共通フォーマット

```json
{
  "code": "ERROR_CODE",
  "message": "エラーメッセージ",
  "details": []
}

## バリデーションエラー（400）
{
  "code": "VALIDATION_ERROR",
  "message": "入力値に誤りがあります",
  "details": [
    {
      "field": "title",
      "message": "タイトルは必須です"
    }
    {
      "field": "title",
      "message": "100文字以内で入力してください"
    }
  ]
}

## リソース未存在（404）
{
  "code": "TASK_NOT_FOUND",
  "message": "指定されたタスクは存在しません",
  "details": []
}

## サーバーエラー（500）
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "サーバーエラーが発生しました",
  "details": []
}
````
