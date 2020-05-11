const path = require('path');
const express = require('express');
const http = require('http');
const fs = require('fs')
const bodyParser = require('body-parser')
let app = express();

// 注册中间件
app.use(bodyParser({ extended: false }))

// 设置请求头，解决跨域问题
app.all('/api/*', (req, res, next) => {
  //设置允许跨域响应报文头
  res.header('Access-Control-Allow-Origin', '*')
  // 设置服务器支持的所有头信息字段
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
  )
  // 设置服务器支持的所有跨域请求的方法
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.setHeader('Content-Type', 'application/json;charset=utf-8')
  next()
})

//设置路由规则
const apiRoute = require('./routes/apiRoute.js')
app.use('/',apiRoute)
app.use(express.static(path.join(__dirname,'public')))

// 监听湍口
app.listen(8888,()=> {
  console.log('8888接口服务已启动...')
})