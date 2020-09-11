const jwt = require('jsonwebtoken')
const  PRIVATE_KEY  = 'robot'
//jwt解析token
function decode(req) {
    let token = req.get('Authorization')
    if(token.indexOf('Bearer') >= 0){
      token = token.replace('Bearer ','')
    }
    let obj = {}
    if(token!=='null') {
      jwt.verify(token,PRIVATE_KEY,(err ,decoded) => {
        if(err) {
          switch (err.name) {
            case 'JsonWebTokenError':
              obj = {code: -1,message:'无效的身份认证请重新登录'}
              break;
            case 'TokenExpiredError':
              obj = {code: -1,message:'身份认证过期请重新登录'}
              break;
          }
        }else {
          obj = {code:200,decoded}
        }
      })
    }else{
      obj = {code: -2,message:'没有身份认证请重新登录后再操作'}
    }
    return obj
  
}
module.exports = decode