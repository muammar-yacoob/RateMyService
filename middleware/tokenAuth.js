const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authenticateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.sendStatus(401);
  if (!authHeader.startsWith('Bearer ')) return res.sendStatus(401);
  token = authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      err.status = 403;
      err.message = 'Invalid Token';
      next(err);
    }
    req.user = {_id: decoded._id}; // Assuming the token includes the user's _id
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