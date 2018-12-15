var query = require('../schemas/users.js')

/**查找用户 */
exports.findUserData = name => {
  let _sql = `select * from users where name="${name}";`
  return query(_sql)
}

/**注册用户 */
exports.insertData = value => {
  let _sql = 'insert into users set name=?,pass=?;'
  return query(_sql, value)
}

/**查找用户通过id */
exports.findUserDataById = id => {
  let _sql = `select * from users where id="${id}"`
  return query(_sql)
}

/**查找所有用户分页 */
exports.findAllUserByPage = page => {
  let _sql = `select * from users limit ${(page - 1) * 2},2;`
  return query(_sql)
}

/**查找所有用户 */
exports.findAllUser = () => {
  let _sql = `select * from users `
  return query(_sql)
}

/**用户登录 */
// exports.findUser=value=>{
//     let _sql=`select * from users where name="${name}";`
// }
