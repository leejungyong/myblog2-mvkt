var express = require('express')
var router = express.Router()
var Category = require('../models/Category')
var contentModel = require('../models/Content')

/**首页 */
router.get('/', async (req, res, next) => {
  var data = {
    page: Number(req.query.page || 1),
    limit: 10,
    pages: 0,
    count: 0,
    content: []
  }
  Category.findAllCategory().then(async result => {
    await contentModel.findAllContent().then(res => {
      // console.log(res)
      data.count = res.length
      data.pages = Math.ceil(data.count / data.limit)

      //取值不能超过pages
      data.page = Math.min(data.page, data.pages)
      //取值不能小于1
      data.page = Math.max(data.page, 1)
    })
    await contentModel.findAllContentByPage(data.page).then(result => {
      console.log(result)
      data.content = result
    })
    res.render('main/layout', {
      userInfo: req.userInfo,
      categories: result,
      contents: data.content
    })
  })
})

module.exports = router
