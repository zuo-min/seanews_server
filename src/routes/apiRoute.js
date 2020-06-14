const express = require('express')
const multer = require('multer')
const path = require('path')

let route = express.Router()
const apiCtrl = require('../controllers/apiController.js')

// 头像修改
let url_user = path.join(__dirname,'../public/user_photo')
const storage_user = multer.diskStorage({
  destination(req,file,cb) {
    cb(null,url_user)
  },
  filename(req,file,cb) {
    cb(null,Date.now() + file.originalname)
  }
})
const upload_user = multer({storage: storage_user}) 

// 创建新闻上传图片
let url_news = path.join(__dirname,'../public/news_img')
const storage_news = multer.diskStorage({
  destination(req,file,cb) {
    cb(null,url_news)
  },
  filename(req,file,cb) {
    cb(null,Date.now() + file.originalname)
  }
})
const upload_news = multer({storage: storage_news}) 

// 登录验证
route.post('/api/login',apiCtrl.login);

// 新闻类型
route.get('/api/newstype',apiCtrl.newstype);

// 新闻列表
route.get('/api/newslist',apiCtrl.newslist);

// 新增新闻
route.post('/api/newsadd',apiCtrl.newsadd);

// 新增新闻图片地址获取
route.post('/api/newsadd_imgname',upload_news.single('file'),apiCtrl.newsadd_imgname)

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
route.post('/api/userphoto',upload_user.single('file'),apiCtrl.userphoto)

// 获取新闻类型数量
route.get('/api/pie_type',apiCtrl.pie_type)

// 获取新闻状态数量
route.get('/api/pie_status',apiCtrl.pie_status)

// 极验初始化API 获取流水标识并设置状态码
route.get('/gt/register-click',apiCtrl.reg_click)

// 极验二次验证
route.post("/gt/validate-click",apiCtrl.val_click)
module.exports = route