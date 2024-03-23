const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('../config/passport-setup'); 

module.exports = (app) => {
    app.set('views', './views');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(cookieParser());
    app.use(session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.CONNECTION_STRING })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};
