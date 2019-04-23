// 生成待发送数据
const sinaSSOEncoder = require('./ssoEncoder.js').SSOEncoder
const querystring = require('querystring')

// base64 编码用户名
function encryptUserName(userName) {
  return (sinaSSOEncoder.base64.encode(encodeURIComponent(userName)))
}

// 加密用户密码
function encryptUserPwd(userPwd, serverTime, nonce, pubkey) {
  const RSAKey = new sinaSSOEncoder.RSAKey()
  RSAKey.setPublic(pubkey, '10001')
  return RSAKey.encrypt([serverTime, nonce].join("\t") + "\n" + userPwd)
}

// post数据
function encodePostData(userName, userPwd, serverTime, nonce, pubkey, rsakv) {
  const encodeUserName = encryptUserName(userName)
  const encodeUserPwd = encryptUserPwd(userPwd, serverTime, nonce, pubkey)
  const postData = {
    "nonce": nonce,
    "rsakv": rsakv,
    "servertime": serverTime,
    "su": encodeUserName,
    "sp": encodeUserPwd,
    "encoding": "UTF-8",
    "entry": "weibo",
    "from": "",
    "gateway": 1,
    "pagerefer": "",
    "prelt": 296,
    "pwencode": "rsa2",
    "returntype": "META",
    "savestate": 0,
    "service": "miniblog",
    "sr": "1366*768",
    "url": "http://weibo.com/ajaxlogin.php?framelogin=1&callback=parent.sinaSSOController.feedBackUrlCallBack",
    "useticket": 1,
    "vsnf": 1
  }
  return querystring.stringify(postData)
}
exports.encodePostData = encodePostData
exports.encryptUserName = encryptUserName