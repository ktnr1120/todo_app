# サーバー操作手順

## 作成日時

2026年4月13日

## 概要

TODO Appの開発・実行に必要なバックエンド（Express）およびフロントエンド（React）サーバーの操作手順を記載します。

## 前提条件

### システム要件

- **OS**: Windows 10/11
- **Node.js**: 24.x 以上
- **npm**: 11.x 以上
- **PowerShell**: 実行ポリシーが `RemoteSigned` 以上

### インストール確認

```powershell
# Node.jsとnpmのバージョン確認
node --version  # v24.x.x
npm --version   # 11.x.x

# PowerShell実行ポリシー確認
Get-ExecutionPolicy  # RemoteSigned または Unrestricted
```

### プロジェクト構造

```
todo_app/
├── scripts/              # サーバー管理スクリプト
│   ├── start-servers.ps1
│   ├── stop-servers.ps1
│   └── check-servers.ps1
├── backend/              # Expressバックエンド
├── frontend/             # Reactフロントエンド
└── docs/                 # 設計書類
```

## サーバー起動手順

### 方法1: 自動スクリプト使用（推奨）

1. **PowerShellを開く**

   ```powershell
   # todo_appディレクトリに移動
   cd d:\todo_app
   ```

2. **サーバー起動スクリプト実行**

   ```powershell
   # scriptsフォルダに移動
   cd scripts

   # サーバー起動
   .\start-servers.ps1
   ```

3. **起動確認**
   - コンソールに以下のメッセージが表示される
     ```
     Starting TODO App servers...
     Starting backend server...
     Starting frontend server...
     Servers started successfully!
     Backend: http://localhost:3000
     Frontend: http://localhost:5174
     ```

### 方法2: 手動起動

#### バックエンド起動

```powershell
cd d:\todo_app\backend
npm start
```

#### フロントエンド起動

```powershell
cd d:\todo_app\frontend
npm run dev
```

### 起動後の確認

- **バックエンド**: http://localhost:3000/health
- **フロントエンド**: http://localhost:5174/

## サーバー停止手順

### 方法1: 自動スクリプト使用（推奨）

1. **PowerShellでscriptsフォルダに移動**

   ```powershell
   cd d:\todo_app\scripts
   ```

2. **サーバー停止スクリプト実行**

   ```powershell
   .\stop-servers.ps1
   ```

3. **停止確認**
   - コンソールに停止メッセージが表示される
     ```
     Stopping TODO App servers...
     Stopped process PID: XXXX
     Stopped process PID: YYYY
     Stopped 2 server(s)
     ```

### 方法2: 手動停止

各ターミナルで `Ctrl + C` を押すか、プロセスを直接停止：

```powershell
# Node.jsプロセスをすべて停止
Get-Process -Name node | Stop-Process -Force
```

## サーバー状態確認手順

### 方法1: 自動スクリプト使用（推奨）

```powershell
cd d:\todo_app\scripts
.\check-servers.ps1
```

**出力例**:

```
Checking TODO App server status...

Backend Server (port 3000):
  Status: RUNNING
  Response: {"status":"OK"}

Frontend Server (port 5174):
  Status: RUNNING
  Title: Vite + React

Quick commands:
  Start: .\start-servers.ps1
  Stop:  .\stop-servers.ps1
```

### 方法2: 手動確認

#### プロセス確認

```powershell
# Node.jsプロセスの確認
Get-Process -Name node

# ポート使用状況確認
netstat -ano | findstr :3000
netstat -ano | findstr :5174
```

#### HTTP確認

```powershell
# バックエンド
Invoke-WebRequest -Uri "http://localhost:3000/health"

# フロントエンド
Invoke-WebRequest -Uri "http://localhost:5174/"
```

## トラブルシューティング

### 起動できない場合

#### エラー: "npm : 用語 'npm' は..."

- **原因**: Node.jsがインストールされていない
- **解決**: https://nodejs.org/ からLTS版をインストール

#### エラー: "execution of scripts is disabled"

- **原因**: PowerShell実行ポリシーが制限されている
- **解決**:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

#### エラー: "Port 3000 is already in use"

- **原因**: ポートが既に使用されている
- **解決**: 既存プロセスを停止
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
  ```

### 接続できない場合

#### フロントエンドがバックエンドに接続できない

- **原因**: バックエンドが起動していない
- **確認**: `.\check-servers.ps1` で状態確認
- **解決**: バックエンドを先に起動

#### CORSエラー

- **原因**: ブラウザのセキュリティ制限
- **確認**: ブラウザの開発者ツール → Console
- **解決**: バックエンドのCORS設定を確認（corsミドルウェア有効）

### パフォーマンス問題

#### サーバーが重い

- **原因**: メモリ不足またはCPU負荷
- **確認**: タスクマネージャーでNode.jsプロセスを確認
- **解決**: 不要なプロセスを停止、またはPC再起動

## スクリプトの詳細

### start-servers.ps1

- バックエンドとフロントエンドを並行起動
- PIDを `scripts/server-pids.txt` に保存
- 起動完了まで待機

### stop-servers.ps1

- 保存されたPIDからプロセスを安全停止
- PIDファイルを自動削除

### check-servers.ps1

- ポート3000（バックエンド）と5174（フロントエンド）を確認
- HTTPリクエストで実際の応答を確認

## 開発時の注意点

- **ポート変更**: 必要に応じて `backend/.env` の `PORT` を変更
- **同時実行**: バックエンドとフロントエンドは別プロセスで実行
- **ホットリロード**: フロントエンドはファイル変更で自動再読み込み
- **ログ確認**: エラー時は各ターミナルの出力を確認

## 関連ドキュメント

- `docs/API.md`: API仕様
- `docs/frontend.md`: フロントエンド設計
- `docs/DB.md`: データベース設計
- `reports/backend_development_report.md`: 開発レポート
