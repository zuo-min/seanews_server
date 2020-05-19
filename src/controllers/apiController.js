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
let failStatus = 1 // 表示失败

// 登录验证
exports.login = (req, res) => {
  let { zhanghao, password } = req.body;
  let resObj = { status: successStatus, message: '' }
  let sql = 'select * from login where zhanghao = ? and password = ?';
  con.query(sql, [zhanghao, password], (err, data) => {
    // console.log(data)
    if (err) {
      resObj.status = failStatus
      resObj.message = err.message
      res.end(JSON.stringify(resObj))
      return
    }
    if (data.length > 0) {
      // console.log(data)
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
        identity: data[0].identity,
        photo: data[0].photo,
        token,
        refresh_token
      }})
      // console.log(resObj)
      res.end(JSON.stringify(resObj))
    } else {
      resObj.status = failStatus
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
      resObj.status = failStatus;
      resObj.message = err.message;
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
  let {page,per_page,status,type,begin_pubdate,end_pubdate} = req.query
  function search (sqlStr) {
    let resObj = { status: successStatus, message: '' };
    let total_count = ''
    let sql = sqlStr
    con.query(sql,(err,data) => {
      // console.log(data)
      if (err) throw err
      let n = (page-1)*per_page // 跳过多少条
      sql += ` limit ${n},${per_page}`
      let total_count = data.length
      con.query(sql,(err,data) => {
        if(err) {
          resObj.status = failStatus;
          resObj.message = err.message;
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
  if(status && !type && !begin_pubdate) { // 单选
    let sql = `select * from news_list where status = ${status}`
    search(sql)
  } else if(type && !status && !begin_pubdate) { // 类型
    let sql = `select * from news_list where type = ${type}`
    search(sql)
  } else if(type && status && !begin_pubdate) { // 单选 类型
    let sql = `select * from news_list where type = ${type} and status = ${status}`
    search(sql)
  }  else if(!status && begin_pubdate && !type) { // 时间
    begin_pubdate = Number(begin_pubdate.replace(/-/g,''))
    end_pubdate = Number(end_pubdate.replace(/-/g,''))
    let sql = `select * from news_list where pubdate > ${begin_pubdate} and pubdate < ${end_pubdate}`
    search(sql)
  }  else if(status && begin_pubdate && !type) { // 时间 单选
    begin_pubdate = Number(begin_pubdate.replace(/-/g,''))
    end_pubdate = Number(end_pubdate.replace(/-/g,''))
    let sql = `select * from news_list where pubdate > ${begin_pubdate} and pubdate < ${end_pubdate} and status = ${status}`
    search(sql)
  } else if(!status && begin_pubdate && type) { // 时间 类型
    begin_pubdate = Number(begin_pubdate.replace(/-/g,''))
    end_pubdate = Number(end_pubdate.replace(/-/g,''))
    let sql = `select * from news_list where pubdate > ${begin_pubdate} and pubdate < ${end_pubdate} and type = ${type}`
    search(sql)
  } else if(status && begin_pubdate && type) { // 时间 类型 单选
    begin_pubdate = Number(begin_pubdate.replace(/-/g,''))
    end_pubdate = Number(end_pubdate.replace(/-/g,''))
    let sql = `select * from news_list where pubdate > ${begin_pubdate} and pubdate < ${end_pubdate} and type = ${type} and status = ${status}`
    search(sql)
  } else {
    let sql = 'select * from news_list order by pubdate desc'
    search(sql)
  }
}

var img_url_name = ''
// 新增新闻图片地址获取
exports.newsadd_imgname = (req,res) => {
  let url = 'http://localhost:8888/news_img/' + req.file.filename
  url = `'${url}'`
  img_url_name = url
}
// 新增新闻
exports.newsadd = (req,res) => {
  // console.log(img_url_name)
  let resObj = { status: successStatus, message: '' }
  let {title,news,type,pubdate} = req.body
  title = `'${title}'`
  news = `'${news}'`
  // news = news.replace('<p>', '')
  // news = news.replace('</p>', '')
  // console.log(title)
  if (img_url_name === '') {
    var sql = `insert into news_list (title,news,type,pubdate,status) values(${title},${news},${type},${pubdate},'0')`
  } else {
    var sql = `insert into news_list (title,news,type,pubdate,status,image) values(${title},${news},${type},${pubdate},'0',${img_url_name})`
  }
  con.query(sql,(err,data) => {
    if (err) {
      resObj.status = failStatus
      resObj.message = err.message
      res.end(JSON.stringify(resObj))
    } else {
      resObj.message = '新闻新增成功！'
      res.end(JSON.stringify(resObj))
    }
  })
}

// 删除新闻
exports.newsdel = (req,res) => {
  let resObj = { status: successStatus, message:  '' }
  let Id = req.query.id
  // console.log(Id)
  let sql = `delete from news_list where Id = ${Id}`
  con.query(sql,(err,data) => {
    if (err) {
      resObj.status = failStatus
      resObj.message = err.message
      res.end(JSON.stringify(resObj))
    } else {
      resObj.message = '删除数据成功'
      res.end(JSON.stringify(resObj))
    }
  })
}

// 获取新闻根据id
exports.newsbyid = (req,res) => {
  let resObj = { status: successStatus, message: ''}
  let Id = req.query.id
  // console.log(Id)
  let sql = `select * from news_list where Id = ${Id}`
  con.query(sql,(err,data) => {
    if (err) {
      resObj.status = failStatus
      resObj.message = err.message
      res.end(JSON.stringify(resObj))
    } else {
      resObj.message = '根据新闻id获取成功!'
      Object.assign(resObj, {data})
      res.end(JSON.stringify(resObj))
    }
  })
}

// 修改新闻
exports.newsedit = (req,res) => {
  let resObj = { status: successStatus, message: ''}
  let Id = req.query.id
  let {title,news,type,pubdate} = req.body
  title = `'${title}'`
  news = `'${news}'`
  // news = news.replace('<p>', '')
  // news = news.replace('</p>', '')
  let sql = `update news_list set title=${title},news=${news},type=${type},pubdate=${pubdate} where Id =${Id}`
  con.query(sql,(err,data) => {
    if (err) {
      resObj.status = failStatus
      resObj.message = err.message
      res.end(JSON.stringify(resObj))
    } else {
      resObj.message = '新闻修改成功！'
      res.end(JSON.stringify(resObj))
    }
  })
}

// 获取个人信息
exports.account = (req,res) => {
  let resObj = { status: successStatus, message: ''}
  // console.log(req.query.zhanghao)
  let zhanghao = req.query.zhanghao
  let sql = `select * from login where zhanghao = ${zhanghao}`
  con.query(sql,(err,data) => {
    if (err) {
      resObj.status = failStatus
      resObj.status.message = err.message
      res.end(JSON.stringify(resObj))
    } else {
      resObj.message = '获取个人信息成功'
      Object.assign(resObj, {data})
      res.end(JSON.stringify(resObj))
    } 
  })
}

// 修改后台登录密码
exports.pwdedit = (req,res) => {
  let resObj = { status: successStatus, message: ''}
  let newPwd = req.body.newPwd
  let Id = req.query.id
  newPwd = `'${newPwd}'`
  let sql = `update login set password = ${newPwd} where Id=${Id}`
  // console.log(sql)
  con.query(sql,(err,data) => {
    if (err) {
      resObj.status = failStatus
      resObj.message = err.message
      res.end(JSON.stringify(resObj))
    } else {
      resObj.message = '密码修改成功!'
      Object.assign(resObj,req.body)
      res.end(JSON.stringify(resObj))
    } 
  })
}

// 审核改变状态
exports.editstatus = (req,res) => {
  let resObj = { status: successStatus, message: ''}
  let {id,num} = req.body
  // console.log(num,id)
  if (num === 0) {
    var sql = `update news_list set status = '1' where Id=${id}`
  } else {
    var sql = `update news_list set status = '2' where Id=${id}`
  }
  con.query(sql,(err,data) => {
    if (err) {
      resObj.status = failStatus
      resObj.message = err.message
      res.end(JSON.stringify(resObj))
    } else {
      resObj.message = '审核成功!'
      res.end(JSON.stringify(resObj))
    } 
  })
} 

// 修改头像
exports.userphoto = (req,res) => {
  let resObj = { status: successStatus, message: ''}
  let url = 'http://localhost:8888/user_photo/' + req.file.filename
  url = `'${url}'`
  let sql = `update login set photo=${url}`
  con.query(sql,(err,data) => {
    if (err) {
      resObj.status = failStatus
      resObj.message = err.message
      res.end(JSON.stringify(resObj))
    } else {
      resObj.message = '修改头像成功!'
      Object.assign(resObj,{photo: url})
      res.end(JSON.stringify(resObj))
    } 
  })
}


