const router = require('express').Router()
const crypto = require('crypto')
const axios = require('axios')
const client = require('../utils/redis.js')
const User = require('../model/user.js')  

const retRes = require('../utils/response.js')


/**
 * login  
 * https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
 * 
 */
router.post('/login', (req, res) => {
  let code = req.body.code
  axios({
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    method: 'get',
    params: {
      appid: 'wx5eb0183ff94037cc',
      secret: 'b2ee415cd96e981afb86aa25ae40a0be',
      js_code: code,
      grant_type: 'authorization_code'
    }
  }).then(wxRes => {
    let { openid, errcode, errmsg, session_key } = wxRes.data
    if (!errcode) {  // 成功， 返回token
      const hash = crypto.createHash('md5')
      hash.update(session_key + 'lsadjkfnsdjkc11_312+SWQfnfsdcs')
      const token = hash.digest('hex')
      // openid 查找用户，若无，新增
      User.findOne({openid: openid}, (err, user) => {
        if (!user) {
          User.create({
            openid: openid
          })
        }
      })
      // token存入redis 2小时有效期
      client.setex(token, 7200, openid, (err, rep) => {
        if (!err) return retRes(res, token)
        else return retRes(res, null, 2, 'redis err')
      })
    } else {
      retRes(res, null, errcode, errmsg)
    }
  }).catch(wxErr => {
    retRes(res, wxErr.toString(), 1, '未知错误')
  })
})



/**
 * 校验token  header  'sadtoken': ''
 *  
 */
router.all('*', (req, res, next) => {
  let token = req.get('sadtoken')
  if (token.length !== 32) return retRes(res, '', 998, 'err token')
  client.get(token, (err, reply) => { // 查redis 有-通过 
    if (reply) {
      next()
    } else {
      retRes(res, '', 999, '身份认证未通过')
    }
  })
})

module.exports = router
