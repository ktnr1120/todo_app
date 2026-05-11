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
*   リクエストボディ    ：email  = ユーザーのメールアドレス
*                       hashedPassword = ハッシュ化されたパスワード
*   処理概要           ：ユーザー登録のDB操作を行う。
*   備考               ：ユーザー名とハッシュ化されたパスワードを受け取り、
*                      :ユーザー登録を行う。
*   作成日             :2026.05.10
*
*******************************************************************************/
exports.insertUser = async (email, hashedPassword) => {

    try {
        // INSERTの実行
        const [result] = await db.query(
            'INSERT INTO users (email, password_hash) VALUES (?, ?)',
            [email, hashedPassword]
        );

        /* ユーザー情報なのでSELECT結果は返却しない。
        // INSERTしたIDを取得
        const newId = result.insertId;
        // INSERT結果をSELECT
        const [rows] = await db.query(
            'SELECT id, email, created_at, updated_at FROM users WHERE id = ?', 
            [newId]
        );
        */

        // SELECT結果を返却
        return result;

    } catch(err) {
        // DB処理エラーはcontroller側でハンドリングするため再送出
        throw err;
    }
};

/*******************************************************************************
*
*   メソッド名         ：メールアドレス重複チェック（POST /auth/register）
*   リクエストボディ    ：email  = ユーザーのメールアドレス
*   処理概要           ：メールアドレス重複チェックのDB操作を行う。
*   備考               ：メールアドレスを受け取り、重複チェックを行う。
*   作成日             :2026.05.11
*
*******************************************************************************/
exports.findByEmail = async (email) => {

    try {
        // INSERT結果をSELECT
        const [rows] = await db.query(
            'SELECT COUNT(*) AS countFROM users WHERE email = ?', 
            [email]
        );

        if(rows[0].count > 0) {
            return rows[0];
        }
        // 正常は戻り値なしnullを返却
        return null;

    } catch(err) {
        // DB処理エラーはcontroller側でハンドリングするため再送出
        throw err;
    }
};
