var query = require('../schemas/users.js')

/**查找分类名称 */
exports.findCategoryByName = name => {
  let _sql = `select * from category where name="${name}" ;`
  return query(_sql)
}

/**添加分类名称 */
exports.insertCateData = value => {
  let _sql = `insert into category set name=?;`
  return query(_sql, value)
}

/**查找所有的分类 */
exports.findAllCategory = () => {
  let _sql = `select * from category order by id desc;`
  return query(_sql)
}
/**查找所有分类分页 */
exports.findAllCategoryByPage = page => {
  let _sql = `select * from category order by id desc limit ${(page - 1) *
    10},10;`
  return query(_sql)
}

/** 查找分类通过id*/
exports.findCategoryById = id => {
  let _sql = `select * from category where id="${id}"`
  return query(_sql)
}

/**查找分类--不是当前id但是名称相同 */
exports.findCategoryByIdAndName = (id, name) => {
  let _sql = `select * from category where id!="${id}" and name="${name}"`
  return query(_sql)
}

/**更新分类信息 */
exports.UpdateCategory = value => {
  let _sql = `update category set name=? where id=?`
  return query(_sql, value)
}

/**删除 */
exports.DeleteCategory = id => {
  let _sql = `delete from category where id="${id}"`
  return query(_sql)
}
