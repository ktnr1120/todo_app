/*******************************************
*
*   ファイル名     ：userModel.js
*   概要           ：login用のDB操作のモデル定義
*
*********************************************/

const db = require('../config/db');

/*******************************************************************************
*
*   メソッド名         ：ユーザー登録（POST /auth/register）
*   リクエストボディ   ：email  = ユーザーのメールアドレス
*                       password = ユーザーのパスワード
*   処理概要           ：ユーザー登録のDB操作を行う。
*   備考               ：ユーザー名とパスワードを受け取り、ユーザー登録を行う。
*                       パスワードはハッシュ化して保存する。
*   作成日             :2026.05.10
*
*******************************************************************************/
exports.insertUser = async (email, password) => {

    try {
        // INSERTの実行
        const [result] = await db.query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, password1]
        );

        // INSERTしたIDを取得
        const newId = result.insertId;

        // INSERT結果をSELECT
        const [rows] = await db.query(
            'SELECT id, email, created_at, updated_at FROM users WHERE id = ?', 
            [newId]
        );

        // SELECT結果を返却
        return rows[0];

    } catch(err) {
        // DB処理エラーはcontroller側でハンドリングするため再送出
        throw err;
    }
};
