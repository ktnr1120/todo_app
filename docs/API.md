---

## タスク一覧取得

### エンドポイント
GET /tasks

### クエリパラメータ

| パラメータ | 型  | 必須 | 説明                     |
|------------|-----|------|--------------------------|
| page       | int | 任意 | ページ番号（デフォルト:1） |
| keyword    | string | 任意 | タスク検索キーワード     |

---

### レスポンス（正常系）

````json
{
  "page": 1,
  "per_page": 10,
  "total": 25,
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

{
  "message": "Invalid query parameter"
}


---

# ✔ 更新API（エラー設計込み）


```md id="3m4l2v"
---

## タスク更新

### エンドポイント
PUT /tasks/:id

---

### リクエスト

```json
{
  "title": "更新後タスク"
}

{
  "message": "Task updated successfully"
}

###　レスポンス（異常系）

##作成失敗時
{
  "message": "Task not found"
}

##入力値不正
{
  "message": "Invalid input"
}

##削除失敗
{
  "message": "Invalid delete"
}

##サーバーエラー
{
  "message": "Internal server error"
}
````
