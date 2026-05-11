/*******************************************
*
*   ファイル名     ：auth.js
*   概要           ：loginのルーティング定義
*
*********************************************/

const express = require('express');
const router = express.Router();

const taskController = require('../controllers/authController');

// ユーザー登録
router.post('/register', authController.register);


module.exports = router;