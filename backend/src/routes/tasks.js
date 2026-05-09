/*******************************************
*
*   ファイル名     ：tasks.js
*   概要           ：crud機能のルーティング定義
*
*********************************************/

const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');

// タスク一覧取得
router.get('/', taskController.getTasks);

// タスク詳細取得
router.get('/:id', taskController.getTaskById);

// タスク作成
router.post('/', taskController.createTask);

// タスク更新
router.put('/:id', taskController.updateTask);

// タスク削除
router.delete('/:id', taskController.deleteTask);

module.exports = router;