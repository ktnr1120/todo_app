# Webアプリ開発から学ぶJavaScript学習ポイント

## 作成日時

2026年4月14日

## 概要

このTODOアプリ開発プロジェクトを通じて学んだ、JavaScript/Webアプリ開発の重要なポイントをまとめます。

## 1. JavaScriptの基礎概念

### 1.1 非同期処理（Async/Await）

```javascript
// バックエンド（Node.js）
const getTasks = async (req, res) => {
  try {
    const tasks = await db.all("SELECT * FROM tasks");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// フロントエンド（React）
const fetchTasks = async () => {
  try {
    const response = await axios.get("/tasks");
    setTasks(response.data);
  } catch (error) {
    setError(error.message);
  }
};
```

**学習ポイント**:

- `async/await` はPromiseを同期的に書ける構文
- `try/catch` でエラーハンドリング
- 非同期処理は「待つ」ことが重要

### 1.2 モジュールシステム

```javascript
// ES6モジュール（import/export）
import express from "express";
import { getTasks, createTask } from "./taskController.js";

export const getTasks = async (req, res) => {
  /* ... */
};
```

**学習ポイント**:

- `import`: 他のファイルの機能を読み込み
- `export`: 自ファイルの機能を外部に公開
- モジュール化でコードを整理

### 1.3 オブジェクト・配列操作

```javascript
// 配列操作（map, filter, find）
const activeTasks = tasks.filter((task) => !task.completed);
const taskTitles = tasks.map((task) => task.title);

// オブジェクト操作（スプレッド構文）
const newTask = { ...task, completed: true };
```

**学習ポイント**:

- 関数型プログラミングの考え方
- 不変性（immutability）の重要性
- 効率的なデータ操作

## 2. Webアプリ開発の全体像

### 2.1 クライアント・サーバーアーキテクチャ

```
ブラウザ（React） ←→ サーバー（Express） ←→ データベース（SQLite）
     ↑                    ↑                       ↑
   UI/UX              API/ロジック            データ永続化
```

**学習ポイント**:

- **フロントエンド**: ユーザーインターフェース
- **バックエンド**: ビジネスロジック・データ管理
- **データベース**: データの保存・検索

### 2.2 HTTP通信の理解

```javascript
// REST APIの基本操作
GET    /tasks     // 取得
POST   /tasks     // 作成
PUT    /tasks/:id // 更新
DELETE /tasks/:id // 削除
```

**学習ポイント**:

- HTTPメソッドの意味と使い方
- ステータスコード（200, 404, 500等）
- リクエスト/レスポンスの構造

### 2.3 MVCパターンの実践

```
Model（データ） ←→ Controller（ロジック） ←→ View（UI）
  ↓                     ↓                     ↓
SQLiteスキーマ    taskController.js      App.jsx
```

**学習ポイント**:

- 関心の分離（Separation of Concerns）
- 各層の責任を明確に
- 保守性の高いコード構造

## 3. Reactの学習ポイント

### 3.1 コンポーネント思考

```jsx
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <span>{task.title}</span>
      <button onClick={() => onDelete(task.id)}>削除</button>
    </div>
  );
}
```

**学習ポイント**:

- UIを小さな部品（コンポーネント）に分割
- Propsでデータを渡す
- 再利用可能なコンポーネント設計

### 3.2 状態管理（State）

```jsx
const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(false);

// 状態更新関数
const handleCreateTask = async (title) => {
  setLoading(true);
  try {
    const newTask = await createTask({ title });
    setTasks([...tasks, newTask]);
  } finally {
    setLoading(false);
  }
};
```

**学習ポイント**:

- `useState`: コンポーネントの状態管理
- 状態変更で自動再レンダリング
- 非同期処理中のローディング状態

### 3.3 副作用処理（useEffect）

```jsx
useEffect(() => {
  fetchTasks(); // 初回マウント時に実行
}, []); // 空配列 = マウント時のみ

useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]); // tasks変更時に実行
```

**学習ポイント**:

- コンポーネントのライフサイクル
- API呼び出しのタイミング
- クリーンアップ処理

## 4. Node.js/Expressの学習ポイント

### 4.1 ミドルウェアの概念

```javascript
// Expressアプリの設定
app.use(cors()); // CORS対応
app.use(express.json()); // JSONパーサー
app.use("/tasks", taskRoutes); // ルーティング
```

**学習ポイント**:

- リクエスト処理のパイプライン
- 順番が重要（上から下へ）
- 共通処理の抽出

### 4.2 ルーティング設計

```javascript
// routes/tasks.js
router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
```

**学習ポイント**:

- URL設計の重要性
- パラメータの扱い方（:id）
- RESTful APIの原則

### 4.3 データベース操作

```javascript
// SQLite操作
const db = new sqlite3.Database("./todo.db");

// パラメータ化クエリ（SQLインジェクション対策）
db.run("INSERT INTO tasks (title) VALUES (?)", [title], callback);
```

**学習ポイント**:

- SQLの基本操作（CRUD）
- パラメータ化クエリのセキュリティ
- 非同期処理の扱い

## 5. 開発環境・ツールの理解

### 5.1 パッケージ管理（npm）

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^5.2.1",
    "react": "^18.2.0"
  }
}
```

**学習ポイント**:

- `npm install`: ライブラリインストール
- `package.json`: プロジェクト設定
- `scripts`: コマンドの定義

### 5.2 ビルドツール（Vite）

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:3000" },
  },
});
```

**学習ポイント**:

- 開発サーバーの高速化
- プロキシ設定でCORS回避
- 本番ビルドの最適化

### 5.3 バージョン管理・デプロイ

```bash
# Git操作
git add .
git commit -m "Add task creation feature"
git push origin main

# サーバー起動
npm run dev    # 開発
npm run build  # ビルド
npm start      # 本番
```

**学習ポイント**:

- コード変更の追跡
- チーム開発の基礎
- デプロイメントの流れ

## 6. セキュリティ・ベストプラクティス

### 6.1 SQLインジェクション対策

```javascript
// ❌危険：文字列連結
db.run(`INSERT INTO tasks (title) VALUES ('${title}')`);

// ✅安全：パラメータ化
db.run("INSERT INTO tasks (title) VALUES (?)", [title]);
```

**学習ポイント**:

- ユーザー入力の検証
- パラメータ化クエリの使用
- セキュリティ意識の重要性

### 6.2 エラーハンドリング

```javascript
// 包括的なエラー処理
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error("Error:", error);
  throw new Error("Operation failed");
}
```

**学習ポイント**:

- エラーの予測と対処
- 適切なエラーメッセージ
- ログの重要性

## 7. 学習の進め方・見方

### 7.1 全体像を把握してから詳細へ

1. **アーキテクチャ理解**: クライアント↔サーバー↔DBの関係
2. **データフロー**: リクエスト→処理→レスポンスの流れ
3. **各技術の役割**: React（UI）、Express（API）、SQLite（データ）

### 7.2 デバッグの重要性

- **ブラウザDevTools**: フロントエンドのデバッグ
- **コンソールログ**: 処理の追跡
- **Postman**: APIのテスト
- **エラーメッセージ**: 問題解決のヒント

### 7.3 公式ドキュメントの活用

- **MDN Web Docs**: JavaScript基礎
- **React公式**: コンポーネント・Hooks
- **Express公式**: API開発
- **SQLite公式**: データベース操作

### 7.4 実践的な学習ステップ

1. **小さな機能から**: 1つのAPIエンドポイントを実装
2. **UIから**: 見た目を作ってから機能を追加
3. **エラーを味方にする**: 失敗から学ぶ
4. **コードを書き換える**: 理解のためにリファクタリング

## 8. このプロジェクトでの学びのポイント

### 8.1 技術スタックの選択理由

- **Node.js**: JavaScriptでフルスタック開発
- **Express**: シンプルで学習しやすいフレームワーク
- **SQLite**: セットアップ不要の軽量DB
- **React**: 宣言的UIで理解しやすい
- **Vite**: 高速開発体験

### 8.2 開発フローの実践

1. **仕様確認** → 2. **設計** → 3. **実装** → 4. **テスト** → 5. **デバッグ**
2. **バックエンド優先**: APIを作ってからフロントエンド
3. **段階的実装**: CRUDの基本から拡張機能

### 8.3 保守性の高いコード

- **関心の分離**: 各ファイルの責任を明確に
- **エラーハンドリング**: 堅牢なアプリケーション
- **ドキュメント**: 仕様書・操作手順の整備

## 9. 次のステップへのアドバイス

### 9.1 拡張機能の実装

- **認証機能**: JWTトークン
- **フィルタリング**: ステータス別表示
- **ページネーション**: 大量データ対応
- **リアルタイム更新**: WebSocket

### 9.2 技術の深化

- **TypeScript**: 型安全性の導入
- **テスト**: Jestでの自動テスト
- **CI/CD**: GitHub Actions
- **クラウドデプロイ**: Vercel/Netlify

### 9.3 学習リソース

- **公式ドキュメント**: 一次情報源
- **実践プロジェクト**: 手を動かして学ぶ
- **コミュニティ**: Stack Overflow、GitHub
- **書籍**: 「JavaScript本格入門」「React入門」

このプロジェクトを通じて、JavaScript/Webアプリ開発の基礎を体系的に学べたと思います。重要なのは「なぜその技術を選んだか」「どのように動作するか」を理解することです。
