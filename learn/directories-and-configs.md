# インストール後に作成したディレクトリ・設定ファイル

## 作成日時

2026年4月14日

## 概要

Node.js/Reactインストール後に作成したディレクトリ構造と設定ファイルを整理します。

## 1. 全体構造

```
todo_app/
├── backend/                    # バックエンド
├── frontend/                   # フロントエンド
├── scripts/                    # 管理スクリプト
├── docs/                       # 設計書
├── reports/                    # レポート
└── learn/                      # 学習資料（今回作成）
```

## 2. バックエンド（backend/）

### 自動生成ファイル

```
backend/
├── package.json          # npm init で作成
├── package-lock.json     # npm install で作成
└── node_modules/         # npm install で作成
```

### 手動作成ディレクトリ

```
backend/
├── src/
│   ├── server.js         # メインサーバーファイル
│   ├── db.js             # DB接続・初期化
│   ├── routes/
│   │   └── tasks.js      # APIルーティング
│   └── controllers/
│       └── taskController.js # ビジネスロジック
├── database/
│   └── todos.db          # SQLiteデータベース（自動生成）
└── .env                  # 環境変数設定
```

### 設定ファイルの詳細

#### package.json

```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node src/server.js"
  },
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^17.4.1",
    "express": "^5.2.1",
    "sqlite3": "^6.0.1"
  }
}
```

#### .env

```
PORT=3000
NODE_ENV=development
DB_PATH=./database/todos.db
```

## 3. フロントエンド（frontend/）

### Vite/React自動生成ファイル

```
frontend/
├── package.json          # npm create vite で作成
├── package-lock.json     # npm install で作成
├── vite.config.js        # Vite設定
├── index.html            # HTMLテンプレート
├── node_modules/         # npm install で作成
├── public/               # 静的ファイル
│   └── vite.svg
└── src/
    ├── App.jsx           # メインコンポーネント
    ├── main.jsx          # エントリーポイント
    ├── index.css         # グローバルCSS
    └── assets/           # アセットファイル
        └── react.svg
```

### 手動作成・編集ファイル

```
frontend/
├── src/
│   ├── api/
│   │   └── tasks.js      # API通信関数
│   └── App.css           # コンポーネントCSS
└── vite.config.js        # proxy設定追加
```

### 設定ファイルの詳細

#### package.json（Vite生成 + 手動追加）

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.8"
  },
  "devDependencies": {
    "@types/react": "^18.2.73",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "vite": "^5.2.0"
  }
}
```

#### vite.config.js（proxy設定追加）

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
      "/health": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

## 4. 管理スクリプト（scripts/）

### PowerShellスクリプト

```
scripts/
├── start-servers.ps1     # サーバー起動
├── stop-servers.ps1      # サーバー停止
└── check-servers.ps1     # 状態確認
```

## 5. 設計書・ドキュメント（docs/）

### 設計書ファイル

```
docs/
├── requirement.md        # 要件定義
├── API.md               # API仕様
├── DB.md                # DB設計
├── frontend.md          # フロントエンド設計
└── server-operations.md # 操作手順
```

## 6. レポート（reports/）

```
reports/
└── backend_development_report.md
```

## 7. ファイル作成のポイント

### 自動生成 vs 手動作成

- **自動生成**: npm init, npm create vite, npm install
- **手動作成**: アプリケーション固有のファイル（server.js, App.jsx等）

### 設定ファイルの役割

- **package.json**: プロジェクト情報、依存関係、スクリプト定義
- **vite.config.js**: ビルド設定、開発サーバー設定
- **.env**: 環境固有の設定（APIキー、ポート等）

### ディレクトリ構造の重要性

- **src/**: ソースコード
- **node_modules/**: 外部ライブラリ
- **public/**: 静的ファイル
- **dist/**: ビルド出力（本番用）

## 8. ファイル拡張子の意味

- **.js/.jsx**: JavaScript/Reactコード
- **.json**: 設定データ
- **.css**: スタイルシート
- **.md**: Markdownドキュメント
- **.ps1**: PowerShellスクリプト
- **.env**: 環境変数
- **.db**: SQLiteデータベース
