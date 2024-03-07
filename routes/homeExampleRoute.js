const express = require('express');
const router = express.Router();

//Home page
const usage = `<h2>Welcome to TipEase!</h2>
<h3>Endpoint Examples:</h3>
<h4>User APIs:</h4>
List all users: <a href="/api/users">/api/users</a><br>
Get user by email   example: <a href="/api/users/65a6feb068f227551d31b2c0">/api/users/userId=123</a><br>
<h4>Rating APIs:</h4>
Rate a user: <a href="/rate/65a6feb068f227551d31b2c0">/rate/userId=123</a><br>
List user ratings: <a href="/api/ratings/65a6feb068f227551d31b2c0">/api/ratings/userId=123</a><br>
User profile page: <a href="/profile/65a6feb068f227551d31b2c0">/profile/userId=123</a><br>`;
router.get('/', (req, res) => res.send(usage));

module.exports = router;