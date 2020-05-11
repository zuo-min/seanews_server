const express = require('express')
let route = express.Router()
const apiCtrl = require('../controllers/apiController.js')

// 登录验证j
route.post('/api/login',apiCtrl.login);
module.exports = route