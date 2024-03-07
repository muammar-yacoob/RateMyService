const express = require('express');
const router = express.Router();

//Home page
const usage = `<h2>Welcome to TipEase!</h2>
<h3>User APIs:</h3>
user endpoint example: <a href="/api/users">/api/users</a><br>
user by email   example: <a href="/api/users/email:mamoon@gmail.com">/api/users/email=mamoon@gmail.com</a><br>
<h3>Rating APIs:</h3>
rating endpoint example: <a href="/api/ratings">/api/ratings</a><br>
rating by user id example: <a href="/api/ratings/65a6feb068f227551d31b2c0">/api/ratings/userId=1</a><br>

<h3>Pages</h3>
User profile page: <a href="/
                     `;
router.get('/', (req, res) => res.send(usage));

module.exports = router;