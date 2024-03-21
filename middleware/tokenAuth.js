const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from "Bearer YOUR_TOKEN"

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isAuthenticated = (req, res, next) => {
    if (req.user) {
        return next();
    }
    res.status(401).send('Not authorized');
}

module.exports = { authenticateToken, isAuthenticated}