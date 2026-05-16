/*******************************************
*
*   ファイル名     ：authController.js
*   概要           ：認証関連のコントローラー
*
*********************************************/


const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const logger = require('../utils/logger');

// エラーレスポンスを統一して送信する関数
function sendError(res, code, message, status = 400) {
  return res.status(status).json({ code, message, details: [] });
}

/*******************************************************************************
*
*   メソッド名         ：ログイン（POST /auth/login）
*   リクエストボディ   ：e-mail = ユーザーのメールアドレス
*                      password = ユーザーのパスワード(登録用)
*   処理概要           ：ユーザーの「認証を行う
*   備考               ：ユーザー名とパスワードを受け取り、ユーザーの認証を行う。
*   作成日             ：2026.05.xx
*
*******************************************************************************/
exports.login = async (req,res) => {
  const { email, password } = req.body;

  // バリデーション※SQLインジェクション対策も兼ねる
  // メールアドレスが空白
  if (!email || typeof email !== 'string') {
    logger.warn('[100]メールアドレス未設定');
    return sendError(res, 'VALIDATION_ERROR', 'メールアドレスは必須です', 400);
  }
  // メールアドレス形式チェック
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    logger.warn('[120]メールアドレスの形式不正');
    return sendError(res, 'VALIDATION_ERROR', 'メールアドレスの形式が不正です', 400);
  }

    // パスワードが空白
  if (!password || typeof password !== 'string') {
    // logにパスワードの内容が残らないようにする(以下はNG例)
    // logger.warn('[200]パスワード未設定', { body: req.body });
    logger.warn('[200]パスワード未設定');
    return sendError(res, 'VALIDATION_ERROR', 'パスワードは必須です', 400);
  }

/* 
controller側の処理概要
（ログイン／パスワード）バリデーション
token発行
Model側で存在確認を実施。
*/

  try {   
    // ログイン実行の実行
    const result = await userModel.authenticate(email, password);

    if(!result) {
      logger.error('[300]ログイン失敗', result.error);
      return sendError(res, 'AUTH_ERROR', 'メールアドレスまたはパスワードが正しくありません',401);
    }

    logger.info('[00]ログイン成功');

    // JWTの発行
    const token = JWT.sign(
      { userId: result.id, email: result.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h'}
    );

    return res.status(200).json({ token });
  } catch(err) {

    logger.error('[300]ログイン失敗', err);

    return sendError(res, 'DB_ERROR', 'ログインに失敗しました', 500);
  }

};


/*******************************************************************************
*
*   メソッド名         ：ログアウト（POST /auth/logout）
*   リクエストボディ   ：なし
*   処理概要           ：ログアウトを行う
*   備考               ：セッションやトークンの無効化など、ログアウトに必要な処理実行
*   作成日             ：2026.05.xx
*
*******************************************************************************/
token blacklist
refresh token削除
Cookie削除

/*******************************************************************************
*
*   メソッド名         ：リフレッシュトークンの取得（POST /auth/refresh）
*   リクエストボディ   ：なし
*   処理概要           ：リフレッシュトークンの取得を行う
*   備考               ：アクセストークンの有効期限が切れた際に、リフレッシュトークン
*                       を使用して新しいアクセストークンを発行するためのエンドポイント
*   作成日             ：2026.05.xx
*
*******************************************************************************/


/*******************************************************************************
*
*   メソッド名         ：レジスター（POST /auth/register）
*   リクエストボディ   ：e-mail = ユーザーのメールアドレス
*                      password = ユーザーのパスワード(登録用)
*                      passwordConfirm = ユーザーのパスワード(確認用) 
*   処理概要           ：ユーザー登録を行う
*   備考               ：ユーザー名とパスワードを受け取り、ユーザー登録を行う。
*                       パスワードはハッシュ化して保存する。
*   作成日             ：2026.05.10
*
*******************************************************************************/

exports.register = async (req,res) => {
  const { email, password, passwordConfirm } = req.body;

  // バリデーション
  // メールアドレスが空白
  if (!email || typeof email !== 'string') {
    logger.warn('[100]メールアドレス未設定');
    return sendError(res, 'VALIDATION_ERROR', 'メールアドレスは必須です', 400);
  }
  // メールアドレスが255文字オーバー
  if (email.length > 255) {
    logger.warn('[110]メールアドレスが255文字オーバー');
    return sendError(res, 'VALIDATION_ERROR', 'メールアドレスは255文字以内で入力してください', 400);
  }
  // メールアドレス形式チェック
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    logger.warn('[120]メールアドレスの形式不正');
    return sendError(res, 'VALIDATION_ERROR', 'メールアドレスの形式が不正です', 400);
  }

    // パスワードが空白
  if ((!password || typeof password !== 'string') || (!passwordConfirm || typeof passwordConfirm !== 'string')) {
    // logにパスワードの内容が残らないようにする(以下はNG例)
    // logger.warn('[200]パスワード未設定', { body: req.body });
    logger.warn('[200]パスワード未設定');
    return sendError(res, 'VALIDATION_ERROR', 'パスワードは必須です', 400);
  }
    // パスワードが72文字オーバー※bcryptの仕様上、72文字を超えるとハッシュ化できない為
  if (password.length > 72) {
    logger.warn('[210]パスワードが72文字オーバー');
    return sendError(res, 'VALIDATION_ERROR', 'パスワードは72文字以内で入力してください', 400);
  }
    // パスワードが8文字未満
  if (password.length < 8) {
    logger.warn('[220]パスワードが8文字未満');
    return sendError(res, 'VALIDATION_ERROR', 'パスワードは8文字以上で入力してください', 400);
  }
    // パスワードに半角英字が含まれていない
  if (!/[a-zA-Z]/.test(password)) {
    logger.warn('[230]パスワードに半角英字が含まれてない');
    return sendError(res, 'VALIDATION_ERROR', 'パスワードに半角英字を含めてください', 400);
  }
    // パスワードに半角数字が含まれていない
  if (!/[0-9]/.test(password)) {
    logger.warn('[240]パスワードに半角数字が含まれてない');
    return sendError(res, 'VALIDATION_ERROR', 'パスワードに半角数字を含めてください', 400);
  }
    //　パスワード１とパスワード２が不一致
  if (password !== passwordConfirm ) {
    logger.warn('[250]パスワード１とパスワード２が不一致');
    return sendError(res, 'VALIDATION_ERROR', '確認用パスワードが一致しません', 400);
  } 



  try {
    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // メールアドレスの重複チェック
    const exists = await userModel.findByEmail(email);
    // 戻り値がnullではない場合、重複のためエラーを返却
    if (exists) {
        return sendError(res, 'VALIDATION_ERROR', 'このメールアドレスはすでに登録されています', 409);
    }
    
    // ユーザー登録の実行
    const result = await userModel.insertUser(email, hashedPassword);

    logger.info('[00]ユーザー登録成功');

    return res.status(201).json(result);
  } catch(err) {

    logger.error('[300]ユーザー登録失敗', err);

    return sendError(res, 'DB_ERROR', 'ユーザー登録に失敗しました', 500);
  }

};
