/*******************************************
*
*   ファイル名     ：authMiddleware.js
*   概要           ：認証ミドルウェア定義
*
*********************************************/

const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    // tokenなし
    if (!token) {
        return res.status(401).json({
            code: 'AUTH_ERROR',
            message: 'トークンがありません'
        });
    }

    try {
        const user =  jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 後続で使えるように保存
        req.user = user;

        next();

    } catch(err) {
        return res.status(403).json({
            code: 'AUTH_ERROR',
            message: 'トークンが不正です'
        });
    }
};