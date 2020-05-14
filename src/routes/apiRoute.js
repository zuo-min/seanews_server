const express = require('express')
let route = express.Router()
const apiCtrl = require('../controllers/apiController.js')

// 登录验证j
route.post('/api/login',apiCtrl.login);
// 新闻类型
route.get('/api/newstype',apiCtrl.newstype);
// 新闻列表
route.get('/api/newslist',apiCtrl.newslist);
// 新增新闻
route.post('/api/newsadd',apiCtrl.newsadd);
// 删除新闻
route.get('/api/newsdel',apiCtrl.newsdel);
module.exports = route