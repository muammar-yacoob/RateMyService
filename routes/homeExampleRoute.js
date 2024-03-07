const express = require('express');
const router = express.Router();

//Home page
const usage = `<center><br><p><font face=Arial><h2>Welcome to TipEase!</h2>
<h3>Endpoint Examples:</h3>
<h4>User APIs:</h4>
<a href="/api/users">List all users</a><br>
<a href="/api/users/65a6feb068f227551d31b2c0">Get User by Id</a><br>
<a href="/api/ratings/65a6feb068f227551d31b2c0">List ratings by User</a><br>
<h4>Pages</h4>
<a href="/rate/65a6feb068f227551d31b2c0">Rate a user</a><br>
<a href="/profile/65a6feb068f227551d31b2c0">User Profile Page</a><br></font></p></center>`;
router.get('/', (req, res) => res.send(usage));

module.exports = router;