// TODO: ログイン機能追加 - 認証ミドルウェア新規作成
// module.exports = (req, res, next) => {
//   if (!req.session.userId) {
//     return res.status(401).json({ message: 'Authentication required' });
//   }
//   next();
// };