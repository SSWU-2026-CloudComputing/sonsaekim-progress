// middlewares/authMiddleware.js
const authMiddleware = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ message: '인증 필요' });
  }
  req.userId = parseInt(userId, 10);
  next();
};

module.exports = authMiddleware;
