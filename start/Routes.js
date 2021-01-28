const express = require('express');
const cookieParser = require('cookie-parser')
const Notifications = require('../controllers/Notifications.Controller');

function Routes(app) {
    app.use('/', express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(cookieParser())
    app.post('/notifications', Notifications.getNotis);
}

module.exports = Routes;