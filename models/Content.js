var query = require('../schemas/users.js')

/**查找所有内容 */
exports.findAllContent = () => {
  let _sql = `select * from content`
  return query(_sql)
}

/**分页查找所有内容 */
exports.findAllContentByPage = page => {
  let _sql = `select * from content order by _id desc  limit ${(page - 1) *
    10},10;`
  return query(_sql)
}
//添加内容
exports.insertContent = value => {
  let _sql = `insert into content set title=?,category_id=?,description=?,content=?;`
  return query(_sql, value)
}

/**通过id查找 */
exports.findContentById = id => {
  let _sql = `select * from content where _id="${id}"`
  return query(_sql)
}

/**更新内容 */
exports.UpdateContent = value => {
  let _sql = `update content set title=?,description=?,content=?;`
  return query(_sql, value)
}

/**删除 */
exports.DeleteContent = id => {
  let _sql = `delete from content where _id="${id}"`
  return query(_sql)
}
