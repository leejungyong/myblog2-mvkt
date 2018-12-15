var express = require('express')
var bodyParser = require('body-parser')
var Cookies = require('cookies')

var userModel = require('./models/User')
//加载模板
var swig = require('swig')
//创建app应用
var app = express()

/**设置cookies */
app.use(async (req, res, next) => {
  req.cookies = new Cookies(req, res)

  //解析登录用户的cookie信息
  req.useInfo = {}
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))

      //解析登录用户的cookie信息，是否管理员
      await userModel.findUserDataById(req.userInfo._id).then(res => {
        req.userInfo.isAdmin = res[0]['isAdmin']
        next()
      })
    } catch (e) {
      next()
    }
  } else {
    next()
  }
})
/**设置静态文件托管 */
app.use('/public', express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: true }))
/**配置应用模板  定义当前应用所使用的模板引擎 */
app.engine('html', swig.renderFile)
//设置模板文件存放的目录
app.set('views', './views')
//注册所使用的模板引擎 第二个参数和上面一致
app.set('view engine', 'html')

//在开发过程中，需要取消模板缓存
// swig.setDefaults({cache:false})

/**
 * 根据不同的功能划分模块
 */
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))

/**
 * 首页
 * res response对象  req  resquest对象
 */
// app.get('/', function(req, res, next) {
//   //   res.send('<h1>hello</h1>')
//   /**
//    * 读取views目录下的指定文件，解析返回给客户端
//    */
//   res.render('index')
// })

app.listen(8088)
console.log('listening on 8088')

/**
 * 用户发送http请求->url->解析路由->找到匹配的规则->执行指定的绑定函数，返回对应内容
 * /public->静态->直接读取
 * 动态文件处理
 */
