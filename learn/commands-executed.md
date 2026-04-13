# TODO App 作成時の実行コマンド一覧

## 作成日時

2026年4月14日

## 概要

TODO Appのバックエンド・フロントエンド開発で実行した主なコマンドを時系列で記載します。

## 1. 環境準備

### Node.jsインストール

```bash
# 公式サイトからLTS版をダウンロード・インストール
# https://nodejs.org/
# インストール後、PowerShellで確認
node --version  # v24.14.1
npm --version   # 11.11.0
```

### PowerShell実行ポリシー設定

```powershell
# スクリプト実行を許可
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 2. バックエンド作成

### プロジェクト初期化

```bash
# backendディレクトリ作成
mkdir backend
cd backend

# npmプロジェクト初期化
npm init
# → package.jsonが作成される
```

### 依存関係インストール

```bash
# 必要なライブラリをインストール
npm install express dotenv cors sqlite3

# インストールされたパッケージ確認
npm list
```

### サーバー起動テスト

```bash
# 開発サーバー起動
npm start
# → "Server is running on port 3000" と表示
```

## 3. フロントエンド作成

### Reactプロジェクト作成

```bash
# ViteでReactプロジェクト作成
npm create vite@latest frontend -- --template react
cd frontend

# 依存関係インストール
npm install
```

### 追加ライブラリインストール

```bash
# API通信用ライブラリ
npm install axios
```

### 開発サーバー起動テスト

```bash
# 開発サーバー起動
npm run dev
# → "Local: http://localhost:5174/" と表示
```

## 4. サーバー管理スクリプト作成

### PowerShellスクリプト実行権限設定

```powershell
# スクリプトのブロック解除
Unblock-File start-servers.ps1, stop-servers.ps1, check-servers.ps1
```

### スクリプト実行テスト

```powershell
# サーバー起動
.\start-servers.ps1

# 状態確認
.\check-servers.ps1

# サーバー停止
.\stop-servers.ps1
```

## 5. 開発時の主なコマンド

### バックエンド

```bash
# サーバー起動
cd backend
npm start

# 依存関係追加（例）
npm install [package-name]

# スクリプト実行（package.jsonに定義）
npm run [script-name]
```

### フロントエンド

```bash
# 開発サーバー起動
cd frontend
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# 依存関係追加
npm install [package-name]
```

## 6. バージョン管理・デプロイ関連

### Git操作（実際のプロジェクトでは）

```bash
# リポジトリ初期化
git init

# コミット
git add .
git commit -m "Initial commit"

# リモート設定
git remote add origin [repository-url]
git push -u origin main
```

### デプロイ（本番環境）

```bash
# バックエンド（例: PM2使用）
npm install -g pm2
pm2 start src/server.js --name "todo-backend"

# フロントエンド
npm run build
# dist/ フォルダをWebサーバーに配置
```

## 7. トラブルシューティングで使用したコマンド

### プロセス管理

```powershell
# Node.jsプロセス確認
Get-Process -Name node

# プロセス強制終了
Get-Process -Name node | Stop-Process -Force

# ポート使用確認
netstat -ano | findstr :3000
netstat -ano | findstr :5174
```

### HTTP確認

```powershell
# バックエンドヘルスチェック
Invoke-WebRequest -Uri "http://localhost:3000/health"

# フロントエンド確認
Invoke-WebRequest -Uri "http://localhost:5174/"
```

## 8. コマンド実行のポイント

### npmコマンドの種類

- `npm init`: package.json作成
- `npm install`: パッケージインストール
- `npm start`: 定義されたスタートスクリプト実行
- `npm run [script]`: カスタムスクリプト実行

### PowerShellの特徴

- `.\script.ps1`: 相対パスでスクリプト実行
- `Get-Process`: プロセス確認
- `Stop-Process`: プロセス停止
- `Set-ExecutionPolicy`: 実行ポリシー設定

### ディレクトリ移動の重要性

- 各コマンドは適切なディレクトリで実行する必要がある
- `cd` コマンドでディレクトリ移動
- `pwd` または `Get-Location` で現在位置確認
