var express = require('express')
var router = express.Router()
var userModel = require('../models/User.js')

//统一返回格式
var responseData

router.use(function(req, res, next) {
  responseData = {
    code: 0,
    message: '',
    userInfo: {}
  }
  next()
})

/**用户注册 */
router.post('/user/register', async (req, res, next) => {
  var username = req.body.username
  var password = req.body.password
  var repassword = req.body.repassword

  if (username == '') {
    responseData.code = 1
    responseData.message = '用户名不能为空'
    res.json(responseData)
    return
  } else if (password == '') {
    responseData.code = 2
    responseData.message = '密码不能为空'
    res.json(responseData)
    return
  } else if (password != repassword) {
    responseData.code = 3
    responseData.message = '两次输入的密码不一致'
    res.json(responseData)
    return
  } else {
    await userModel.findUserData(username).then(async res => {
      // console.log(res)
      if (res.length) {
        responseData.code = 4
        responseData.message = '用户名已经被注册'
        console.log('已被注册')
      } else {
        await userModel.insertData([username, password]).then(res => {
          responseData.message = '注册成功'
          console.log('注册成功')
        })
      }
    })
    res.json(responseData)
    return
  }
})

/**用户登录 */
router.post('/user/login', async (req, res, next) => {
  var username = req.body.username
  var password = req.body.password
  let userInfo
  if (username == '' || password == '') {
    responseData.code = 1
    responseData.message = '用户名或密码不能为空'
    res.json(responseData)
    return
  } else {
    await userModel.findUserData(username).then(res => {
      if (res.length) {
        userInfo = res[0]
        console.log(res)
        if (username == res[0]['name'] && res[0]['pass'] == password) {
          responseData.message = '登录成功'
          return
        } else {
          responseData.code = 2
          responseData.message = '密码错误！'
          console.log(responseData)
          return
        }
      } else {
        responseData.code = 3
        responseData.message = '用户名不存在！'
        return
      }
    })
    req.cookies.set(
      'userInfo',
      JSON.stringify({
        _id: userInfo.id,
        username: userInfo.name
      })
    )
    res.json(responseData)

    return
  }
})

/**退出 */
router.get('/user/logout', function(req, res) {
  req.cookies.set('userInfo', null)
  res.json(responseData)
})

module.exports = router
