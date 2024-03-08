const express = require('express');
const router = express.Router();

//Home page
const bgImage = 'https://img.freepik.com/premium-vector/kawaii-chicken-duck-seamless-background_6997-1604.jpg';
// const bgImage = '/res/imgs/bg.jpg';
const usage = `
<!DOCTYPE html>
<html>
<head>
    <title>TipEase</title>
    <style>
        /* Ensure html and body cover the full height of the viewport */
        html, body {
            margin: 0;
            padding: 0;
            height: 100%; 
            background-image: url('${bgImage}'); 
            background-repeat: repeat; 
            background-position: center; 
            background-size: auto; 
            font-family: Arial; 
        }

        /* Style for the content box */
        .content-box {
            margin: 0 auto;
            max-width: 300px;
            background-color: #ffffffdd;
            border-radius: 10px; 
            padding: 15px; 
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
        }
        
        h2, h3, h4, a {
            margin: 10px 0; 
        }
        
        a {
            color: #00ccee; /* Color for links */
            text-decoration: none; /* Remove underline from links */
        }
        
        a:hover {
            text-decoration: underline; /* Underline on hover for links */
        }
    </style>
</head>
<body>
    <br><br>
    <div class="content-box">
        <center>
            <h2>Welcome to TipEase!</h2>
            <h3>Endpoint Examples:</h3>
            <h4>User APIs:</h4>
            <a href="/api/users">List all users</a><br>
            <a href="/api/users/65a6feb068f227551d31b2c0">Get User by Id</a><br>
            <a href="/api/ratings/65a6feb068f227551d31b2c0">List ratings by User</a><br>
            <h4>Pages</h4>
            <a href="/rate/65a6feb068f227551d31b2c0">Rate a user</a><br>
        </center>
    </div>
</body>
</html>

`;
router.get('/', (req, res) => res.send(usage));

module.exports = router;