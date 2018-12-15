var express = require('express')
var router = express.Router()
var userModel = require('../models/User')
var categoryModel = require('../models/Category')
var contentModel = require('../models/Content')

router.use(function(req, res, next) {
  if (!req.userInfo.isAdmin) {
    res.send('对不起，只有管理员才可以进入后台管理')
    return
  }
  next()
})

//不需要将/admin的路由写上
router.get('/', function(req, res, next) {
  // res.send('后台管理首页')
  res.render('admin/layout', {
    userInfo: req.userInfo
  })
})

/**用户管理 */
router.get('/user', async (req, res) => {
  let users = []
  let page = req.query.page || 1
  let count = 0
  let pages = 0
  let limit = 2
  await userModel.findAllUser().then(res => {
    count = res.length
    pages = Math.ceil(count / limit)

    //取值不能超过pages
    page = Math.min(page, pages)
    //取值不能小于1
    page = Math.max(page, 1)
  })
  await userModel.findAllUserByPage(page).then(res => {
    users = res
  })

  res.render('admin/user_index', {
    userInfo: req.userInfo,
    users: users,
    page: page,
    pages: pages,
    count: count,
    limit: limit
  })
})

/**分类首页 */
router.get('/category', async (req, res) => {
  let category = []
  let page = req.query.page || 1
  let count = 0
  let pages = 0
  let limit = 10
  await categoryModel.findAllCategory().then(res => {
    count = res.length
    pages = Math.ceil(count / limit)

    //取值不能超过pages
    page = Math.min(page, pages)
    //取值不能小于1
    page = Math.max(page, 1)
  })
  await categoryModel.findAllCategoryByPage(page).then(res => {
    category = res
  })
  res.render('admin/category_index', {
    userInfo: req.userInfo,
    categories: category,
    page: page,
    pages: pages,
    count: count,
    limit: limit
  })
})

/**分类管理-添加 */
router.get('/category/add', function(req, res) {
  res.render('admin/category_add', {
    userInfo: req.userInfo
  })
})

/**分类的保存 */
router.post('/category/add', async (req, res) => {
  console.log(req.body)
  var name = req.body.name || ''
  if (name == '') {
    res.render('admin/error', {
      message: '分类名称不能为空'
    })
    return
  }
  //数据库中是否已经存在同名分类
  await categoryModel.findCategoryByName(name).then(async result => {
    if (result.length) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类已经存在！'
      })
      // console.log(result)

      return
    } else {
      //数据库中不存在该分类
      await categoryModel.insertCateData([name]).then(result => {})
      res.render('admin/success', {
        userInfo: req.userInfo,
        message: '分类保存成功',
        url: '/admin/category'
      })
    }
  })
})

/**分类修改 */
router.get('/category/edit', function(req, res) {
  var id = req.query.id || ''

  categoryModel.findCategoryById(id).then(result => {
    console.log(result)
    if (result.length == 0) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类信息不存在！'
      })
      return
    } else {
      res.render('admin/category_edit', {
        userInfo: req.userInfo,
        category: result[0]
      })
    }
  })
})

/**分类的修改与保存 */
router.post('/category/edit', async (req, res) => {
  var id = req.query.id || ''
  var name = req.body.name || ''
  await categoryModel.findCategoryById(id).then(async result => {
    // console.log(result)
    if (result.length == 0) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类信息不存在！'
      })
      return
    } else {
      //当用户没有做任何修改
      if (name == result[0].name) {
        res.render('admin/success', {
          userInfo: req.userInfo,
          message: '修改成功',
          url: '/admin/category'
        })
        return
      } else {
        //修改的分类名称是否已经在数据库中存在
        await categoryModel
          .findCategoryByIdAndName(id, name)
          .then(async result => {
            console.log(result + 'hahaha')
            if (result.length) {
              res.render('admin/error', {
                userInfo: req.userInfo,
                message: '数据库中已存在同名分类'
              })
              return
            } else {
              await categoryModel.UpdateCategory([name]).then(() => {
                res.render('admin/success', {
                  userInfo: req.userInfo,
                  message: '修改成功',
                  url: '/admin/category'
                })
              })
            }
          })
      }
    }
  })
})

/**分类删除 */
router.get('/category/delete', function(req, res) {
  var id = req.query.id || ''
  categoryModel.DeleteCategory(id).then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '删除成功',
      url: '/admin/category'
    })
  })
})

/**内容首页 */
router.get('/content', async (req, res) => {
  let content = []
  let page = req.query.page || 1
  let count = 0
  let pages = 0
  let limit = 10
  await contentModel.findAllContent().then(res => {
    // console.log(res)
    count = res.length
    pages = Math.ceil(count / limit)

    //取值不能超过pages
    page = Math.min(page, pages)
    //取值不能小于1
    page = Math.max(page, 1)
  })
  await contentModel.findAllContentByPage(page).then(result => {
    // console.log(result)
    content = result
  })
  res.render('admin/content_index', {
    userInfo: req.userInfo,
    contents: content,
    page: page,
    pages: pages,
    count: count,
    limit: limit
  })
})

/**内容添加页面 */
router.get('/content/add', function(req, res) {
  categoryModel.findAllCategory().then(result => {
    res.render('admin/content_add', {
      userInfo: req.userInfo,
      categories: result
    })
  })
})

router.post('/content/add', async (req, res) => {
  let category_id = 0
  if (!req.body.category) {
    res.render('/admin/error', {
      userInfo: req.userInfo,
      message: '内容分类不能为空'
    })
    return
  }
  if (!req.body.title) {
    res.render('/admin/error', {
      userInfo: req.userInfo,
      message: '内容标题不能为空'
    })
    return
  }
  // console.log(req.body.category)
  // await categoryModel.findCategoryByName(req.body.category).then(result => {
  //   console.log(result)
  //   category_id = result[0].id
  // })
  //保存数据到数据库
  await contentModel
    .insertContent([
      req.body.title,
      req.body.category,
      req.body.description,
      req.body.content
    ])
    .then(() => {
      res.render('admin/success', {
        userInfo: req.userInfo,
        message: '内容保存成功',
        url: '/admin/content'
      })
    })
})

/**修改内容 */

router.get('/content/edit', async (req, res) => {
  var id = req.query.id || ''
  var categories = []
  await contentModel.findContentById(id).then(async result => {
    // console.log(result)
    if (!result.length) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '指定内容不存在'
      })
      return
    } else {
      await categoryModel.findAllCategory().then(categories => {
        categories = categories
        // console.log(content)
        res.render('admin/content_edit', {
          userInfo: req.userInfo,
          content: result[0],
          categories: categories
        })
      })
    }
  })
})

/**保存修改内容 */
router.post('/content/edit', function(req, res) {
  var id = req.query.id || ''
  contentModel
    .UpdateContent([req.body.title, req.body.description, req.body.content])
    .then(() => {
      res.render('admin/success', {
        userInfo: req.userInfo,
        message: '内容保存成功',
        url: '/admin/content/edit?id=' + id
      })
    })
})

/**内容删除 */
router.get('/content/delete', function(req, res) {
  var id = req.query.id || ''
  contentModel.DeleteContent(id).then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '删除成功',
      url: '/admin/content'
    })
  })
})
module.exports = router
