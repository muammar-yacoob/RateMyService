const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authenticateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.sendStatus(401);
  if (!authHeader.startsWith('Bearer ')) return res.sendStatus(401);
  token = authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403);
      throw new Error('Invalid token');
    }
    req.user = user;
    next();
  });
});

const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.status(401).send('Not authorized');
}

module.exports = { authenticateToken, isAuthenticated }