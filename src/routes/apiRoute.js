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

// 获取新闻根据id
route.get('/api/newsbyid',apiCtrl.newsbyid);

// 修改新闻
route.post('/api/newsedit',apiCtrl.newsedit);

// 获取个人信息
route.get('/api/account',apiCtrl.account);

// 修改后台登录密码
route.post('/api/pwdedit',apiCtrl.pwdedit);

// 审核改变状态
route.post('/api/editstatus',apiCtrl.editstatus);

// 修改头像
route.post('/api/userphoto',apiCtrl.userphoto);
module.exports = route