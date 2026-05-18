/*******************************************
*
*   ファイル名     ：tasks.js
*   概要           ：crud機能のルーティング定義
*
*********************************************/

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

// タスク一覧取得
router.get(
    '/',
    authMiddleware.authenticateToken,
    taskController.getTasks);

// タスク詳細取得
router.get(
    '/:id',
    authMiddleware.authenticateToken,
    taskController.getTaskById);

// タスク作成
router.post(
    '/',
    authMiddleware.authenticateToken,
    taskController.createTask);

// タスク更新
router.put(
    '/:id',
    authMiddleware.authenticateToken,
    taskController.updateTask);

// タスク削除
router.delete(
    '/:id',
    authMiddleware.authenticateToken,
    taskController.deleteTask);

module.exports = router;