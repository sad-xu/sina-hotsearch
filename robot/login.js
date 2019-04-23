const request = require('request')
const querystring = require('querystring')
const encodePostData = require('./encodePostData.js')

class Login {
  constructor(userName, password) {
    this.userName = userName
    this.password = password
    // 预登录地址
    this.preLoginUrl = 'http://login.sina.com.cn/sso/prelogin.php?entry=weibo&checkpin=1&callback=sinaSSOController.preloginCallBack&rsakt=mod&client=ssologin.js(v1.4.18)'
    // 正式登陆地址
    this.loginUrl = 'http://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.18)'
    this.preLoginData = ''
  }

  init() {
    this.preLoginUrl = this.encodePreLoginUrl()
    return (async () => {
      try {
        let preLoginInitData = await this.getPreLoginData()
        this.preLoginData = await this.parsePreLoginData(preLoginInitData)
        const responseBody = await this.postData()
        const finnalLoginUrl = await this.getFinnalLoginUrl(responseBody)
        return await this.getCookie(finnalLoginUrl)
      } catch(err) {
        console.log(err)
      }
    })()
  }

  encodePreLoginUrl() {
    const encodeUserName = encodePostData.encryptUserName(this.userName)
    return this.preLoginUrl + `&su=${encodeUserName}`
  }

  // 获取预登录数据
  getPreLoginData() {
    return new Promise((resolve, reject) => {
      request(this.preLoginUrl, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          resolve(response.body)
        } else reject('预登录数据获取失败')
      })
    })
  }

  // 解析预登录数据
  parsePreLoginData(data) {
    return new Promise((resolve, reject) => {
      const reg = /\((.*)\)/
      let preLoginData = JSON.parse(reg.exec(data)[1])
      if (preLoginData) resolve(preLoginData)
      else reject('预登录数据解析失败')
    })
  }

  // 正式post
  postData() {
    const headers = {
      "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0",
      'Accept-Language': 'zh-cn',
      'Content-Type':'application/x-www-form-urlencoded',
      'Connection': 'Keep-Alive'
    }
    const encodeBody = encodePostData.encodePostData(
      this.userName, 
      this.password, 
      this.preLoginData.servertime,
      this.preLoginData.nonce, 
      this.preLoginData.pubkey, 
      this.preLoginData.rsakv
    )
    const options = {
      method: 'POST',
      url: this.loginUrl,
      headers: headers,
      body: encodeBody,
      gzip: true
    }
    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          response.setEncoding('utf-8')
          resolve(response.body)
        } else reject('正式登陆失败')
      })
    })
  }

  // 获取最终地址
  getFinnalLoginUrl(responseBody) {
    return new Promise((resolve, reject) => {
      const reg = /location\.replace\((?:"|')(.*)(?:"|')\)/
      const loginUrl = reg.exec(responseBody)[1]
      const parseLoginUrl = querystring.parse(loginUrl)
      const retCode = Number(parseLoginUrl.retcode)
      if (retCode === 0) {
        resolve(loginUrl)
      } else if (retCode === 101) {
        reject('用户名或密码错误')
      } else {
        reject('登录失败：' + retCode)
      }
    })
  }

  getCookie(finnalLoginUrl) {
    return new Promise((resolve, reject) => {
      let j = request.jar()
      request.get({
        url: finnalLoginUrl,
        jar: j
      }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          resolve(j.getCookieString(finnalLoginUrl))
        } else {
          reject('最后一步失败')
        }
      })
    })
  }
}

exports.Login = Login
