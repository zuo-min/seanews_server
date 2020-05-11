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
  con.query(sql, [zhanghao, password], (err, result) => {
    // console.log(result)
    if (err) {
      resObj.status = fialStatus
      resObj.message = err.message
      res.end(JSON.stringify(resObj))
      return
    }
    if (result.length > 0) {
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
        photo:'http://localhost:8888/img/d5.png',
        token,
        refresh_token
      }})
      console.log(resObj)
      res.end(JSON.stringify(resObj))
    } else {
      resObj.status = fialStatus
      resObj.message = '用户名或密码错误!'
      res.end(JSON.stringify(resObj))
    }
  })
}