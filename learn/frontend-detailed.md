# フロントエンド詳細解説

## 作成日時

2026年4月14日

## 概要

React（Vite）プロジェクトの詳細な構造と、開発時に触る主要ファイルを解説します。

## 1. Reactプロジェクトの作成フロー

### 1.1 Viteによるプロジェクト作成

```bash
npm create vite@latest frontend -- --template react
```

このコマンドで自動生成される内容：

#### コアライブラリ（dependencies）

```json
{
  "react": "^18.2.0", // React本体
  "react-dom": "^18.2.0", // DOM操作用
  "axios": "^1.6.8" // HTTP通信（手動追加）
}
```

#### 開発ツール（devDependencies）

```json
{
  "@types/react": "^18.2.73", // TypeScript型定義
  "@types/react-dom": "^18.2.22", // DOM型定義
  "@vitejs/plugin-react": "^4.2.1", // Vite Reactプラグイン
  "eslint": "^8.57.0", // コード品質チェック
  "eslint-plugin-react": "^7.34.1", // React ESLintルール
  "eslint-plugin-react-hooks": "^4.6.0", // Hooksルール
  "eslint-plugin-react-refresh": "^0.4.6", // Fast Refresh
  "vite": "^5.2.0" // ビルドツール
}
```

### 1.2 各ライブラリの役割

#### React関連

- **react**: UI構築のコアライブラリ
- **react-dom**: Webブラウザ向けDOM操作
- **@types/react**: TypeScript使用時の型定義

#### 開発支援

- **vite**: 高速ビルド・開発サーバー
- **@vitejs/plugin-react**: Reactコードの変換
- **eslint**: コード品質チェック・自動修正

#### 手動追加

- **axios**: API通信（fetchの代替として使いやすい）

## 2. ディレクトリ構成詳細

### 2.1 全体構造

```
frontend/
├── node_modules/          # 外部ライブラリ（自動生成）
├── public/                # 静的ファイル
│   └── vite.svg          # Viteロゴ
├── src/                   # ⭐ メイン開発フォルダ
│   ├── api/              # ⭐ API通信関連
│   │   └── tasks.js      # ⭐ API関数定義
│   ├── assets/           # 画像・フォント等
│   ├── App.jsx           # ⭐ メインコンポーネント
│   ├── App.css           # ⭐ メインスタイル
│   ├── index.css         # グローバルスタイル
│   └── main.jsx          # ⭐ エントリーポイント
├── index.html            # HTMLテンプレート
├── package.json          # プロジェクト設定
├── vite.config.js        # ビルド設定
└── eslint.config.js      # ESLint設定
```

### 2.2 開発時に主に触るファイル

#### 必須ファイル（必ず編集）

- **src/App.jsx**: メインUIコンポーネント
- **src/main.jsx**: Reactアプリの起動ポイント
- **src/App.css**: メインコンポーネントのスタイル

#### API関連（バックエンド連携時）

- **src/api/tasks.js**: API通信関数
- **vite.config.js**: プロキシ設定

#### 設定ファイル（必要に応じて）

- **package.json**: 依存関係、スクリプト
- **vite.config.js**: ビルド設定

## 3. 主要ファイルの詳細解説

### 3.1 src/main.jsx（エントリーポイント）

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

**役割**:

- Reactアプリの起動
- HTMLの#root要素にAppコンポーネントをマウント
- StrictMode: 開発時の追加チェック

### 3.2 src/App.jsx（メインコンポーネント）

```jsx
import { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api/tasks";
import "./App.css";

function App() {
  // 状態管理
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // タスク取得関数
  const fetchTasks = async () => {
    // ... API呼び出し
  };

  // 初回読み込み
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app">
      <h1>TODO App</h1>
      {/* UI要素 */}
    </div>
  );
}

export default App;
```

**役割**:

- 状態管理（useState）
- 副作用処理（useEffect）
- UIレンダリング（JSX）

### 3.3 src/api/tasks.js（API通信）

```javascript
import axios from "axios";

// API関数定義
export const getTasks = async (params = {}) => {
  try {
    const response = await axios.get("/tasks", { params });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// 他のAPI関数...
```

**役割**:

- バックエンドAPIとの通信
- エラーハンドリング
- データ変換

### 3.4 vite.config.js（ビルド設定）

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/tasks": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

**役割**:

- 開発サーバー設定
- APIプロキシ設定
- ビルド最適化

## 4. React開発のワークフロー

### 4.1 開発サイクル

1. **コード編集** → src/App.jsx 等
2. **自動リロード** → Viteが変更検知
3. **ブラウザ確認** → http://localhost:5174/
4. **デバッグ** → ブラウザDevTools + コンソール

### 4.2 主要コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド（本番用）
npm run build

# ビルドプレビュー
npm run preview

# コード品質チェック
npm run lint
```

## 5. 学習時の注目ポイント

### 5.1 Reactの特徴

- **コンポーネントベース**: UIを再利用可能な部品に分割
- **宣言的**: 何を表示するかを記述（どのように描画するかはReactが決める）
- **状態管理**: useStateで動的データ管理
- **副作用**: useEffectでAPI呼び出し等

### 5.2 Viteの特徴

- **高速起動**: ESModuleを使用した高速開発サーバー
- **HMR**: Hot Module Replacement（変更の即時反映）
- **最適化ビルド**: Rollupベースの効率的なバンドル

### 5.3 ファイル構成の考え方

- **src/**: 開発するコード
- **public/**: ビルド後もそのままコピーされるファイル
- **node_modules/**: 外部ライブラリ（編集しない）
- **dist/**: ビルド出力（自動生成）

## 6. 拡張時の考慮点

### 6.1 コンポーネント分割

```
src/
├── components/     # UIコンポーネント
│   ├── TaskList.jsx
│   ├── TaskForm.jsx
│   └── TaskItem.jsx
├── hooks/         # カスタムHooks
├── utils/         # ユーティリティ関数
└── api/           # API通信
```

### 6.2 状態管理の拡張

- **Context API**: グローバル状態管理
- **Redux/Zustand**: 大規模アプリ向け

### 6.3 ルーティング

```bash
npm install react-router-dom
```

- 複数ページのSPA作成

## 7. トラブルシューティング

### 7.1 よくあるエラー

- **Module not found**: importパス確認
- **Port already in use**: プロセス停止
- **CORS error**: vite.config.jsのproxy設定確認

### 7.2 デバッグ方法

- **ブラウザDevTools**: コンソール + Networkタブ
- **React DevTools**: コンポーネントツリー確認
- **Vite DevTools**: ビルド情報確認
