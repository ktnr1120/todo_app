/*******************************************
*
*   ファイル名     ：tasks.js
*   概要           ：ルーティング定義
*
*********************************************/

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// タスク一覧取得（GET /tasks）
// クエリパラメータ: page, keyword, status
// router.get('/', taskController.getTasks);

// タスク詳細取得（GET /tasks/:id）
// パスパラメータ: id（タスクID）
// router.get('/:id', taskController.getTaskById);

// タスク作成（POST /tasks）
// リクエストボディ: { title: string, status?: string }
// router.post('/', taskController.createTask);

// タスク更新（PUT /tasks/:id）
// パスパラメータ: id（タスクID）
// リクエストボディ: { title?: string, status?: string }
// router.put('/:id', taskController.updateTask);

// タスク削除（DELETE /tasks/:id）
// パスパラメータ: id（タスクID）
// router.delete('/:id', taskController.deleteTask);

// タスク詳細取得（GET /tasks/:id）
// パスパラメータ: id（タスクID）
router.get('/:id', taskController.getTaskById);

// タスク作成（POST /tasks）
// リクエストボディ: { title: string, status?: string }
// router.post('/', taskController.createTask);
router.post('/tasks', taskController.createTask);

// タスク更新（PUT /tasks/:id）
// パスパラメータ: id（タスクID）
// リクエストボディ: { title?: string, status?: string }
router.put('/:id', taskController.updateTask);

// タスク削除（DELETE /tasks/:id）
// パスパラメータ: id（タスクID）
router.delete('/:id', taskController.deleteTask);

module.exports = router;
