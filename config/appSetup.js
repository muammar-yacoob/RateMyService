const express = require('express');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    app.set('views', './views');
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(cookieParser());
};