const mysql = require('mysql')
// 链接数据库
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: '3306',
  database: 'seanews'
});
con.connect();

let successStatus = 0 //表示成功
let fialStatus = 1 // 表示失败
// 登录验证
exports.login = (req, res) => {
  let { zhanghao, password } = req.body;
  let resObj = { status: successStatus, message: '' }
  let sql = 'select * from login where zhanghao = ? and password = ?';
  con.query(sql, [zhanghao, password], (err, data) => {
    if (err) {
      resObj.status = fialStatus
      resObj.message = err.message
      res.end(JSON.stringify(resObj))
      return
    }
    if (data.length > 0) {
      let str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz23456789'
      let token = ''
      let refresh_token = ""
      //以长度单位进行循环
      for(let i=0;i<100;i++){
        token+=str.charAt(Math.floor(Math.random()*str.length))
          refresh_token+=str.charAt(Math.floor(Math.random()*str.length))
      }
      resObj.message = '登录成功!'
      Object.assign(resObj,{data:{
        id: Math.floor(Math.random()*1000),
        name: zhanghao,
        photo:'http://localhost:8888/user_photo/d5.png',
        token,
        refresh_token
      }})
      // console.log(resObj)
      res.end(JSON.stringify(resObj))
    } else {
      resObj.status = fialStatus
      resObj.message = '用户名或密码错误!'
      res.end(JSON.stringify(resObj))
    }
  })
}
// 获取新闻类型列表
exports.newstype = (req,res) => {
  let resObj = { status: successStatus, message: '' };
  let sql = 'select * from news_type';
  con.query(sql,(err,data) => {
    if(err) {
      resObj.status = fialStatus;
      resObj.message = '获取新闻类型列表失败!'
      res.end(JSON.stringify(resObj))
      return
    } else {
      resObj.message = '获取新闻类型列表成功!'
      Object.assign(resObj,{data})
      res.end(JSON.stringify(resObj))
    }
  })
}
// 获取新闻列表页
exports.newslist = (req,res) => {
  let {page,per_page,status,type} = req.query
  function search (sqlStr) {
    let resObj = { status: successStatus, message: '' };
    let total_count = ''
    let sql = sqlStr
    con.query(sql,(err,data) => {
      if (err) throw err
      let n = (page-1)*per_page // 跳过多少条
      sql += ` limit ${n},${per_page}`
      let total_count = data.length
      con.query(sql,(err,data) => {
        if(err) {
          resObj.status = fialStatus;
          resObj.message = '获取新闻列表失败!'
          res.end(JSON.stringify(resObj))
          return
        } else {
          // console.log(data)
          resObj.message = '获取新闻列表成功!'
          Object.assign(resObj,{data,total_count,page,per_page})
          res.end(JSON.stringify(resObj))
          // console.log(resObj)
        }
      })
    })
  }
  if(status && !type) {
    let sql = `select * from news_list where status = ${status}`
    search(sql)
  } else if(type && !status) {
    let sql = `select * from news_list where type = ${type}`
    search(sql)
  } else if(type && status) {
    let sql = `select * from news_list where type = ${type} and status = ${status}`
    search(sql)
  } else {
    let sql = 'select * from news_list order by Id asc'
    search(sql)
  }
}
