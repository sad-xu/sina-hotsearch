const fs = require('fs')
const readline = require('readline')
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
    this.pinCode = null
  }

  init() {
    this.preLoginUrl = this.encodePreLoginUrl()
    return (async () => {
      try {
        let preLoginInitData = await this.getPreLoginData()
        this.preLoginData = await this.parsePreLoginData(preLoginInitData)
        // // 验证码
        // if (this.preLoginData.showpin == 1) {
        //   this.getPinImg()
        //   this.pinCode = await this.inputPinCode()
        // }
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
      this.preLoginData.rsakv,
      this.pinCode, 
      this.preLoginData.pcid
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

  // 获取验证码图片
  getPinImg() {
    let pinImgUrl = `http://login.sina.com.cn/cgi/pin.php?r=${Math.floor(Math.random() * 1e8)}&s=0&p=${this.preLoginData['pcid']}`
    request(pinImgUrl).pipe(fs.createWriteStream('./pinCode.png'));
  }

  inputPinCode() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    return new Promise((resolve, reject) => {
      rl.question('请输入验证码 \n', (pinCode) => {
        console.log(`你输入的验证码为：${pinCode}`)
        rl.close()
        resolve(pinCode)
      })
    })
  }
}

exports.Login = Login

// 登陆 获取cookie
exports.getCookie = function getCookie() {
  return new Promise((resolve, reject) => {
    new Login('1031568754@qq.com', 'xhc151136')
      .init()
      .then(cookie => {
        console.log(cookie)
        resolve(cookie)
      }).catch(err => {
        reject(err)
      })
  })
}

// 点赞固定微博，检验cookie是否有效
exports.hasPermission = function hasPermission(cookie) {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://weibo.com/aj/v6/like/add?ajwvr=6&__rnd=',
      method: 'POST',
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0",
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'Keep-Alive',
        "Referer": 'https://weibo.com/u/2671109275?profile_ftype=1&is_hot=1',
        'cookie': cookie
      },
      gzip: true,
      credentials: "include",
      body: querystring.stringify({
        location: 'page_100606_home',
        version: 'mini',
        qid: 'heart',
        mid: 4363901967912825,
        loc: 'profile',
        cuslike: 1,
        floating: 0,
        _t: 0
      })
    }, (error, response, body) => {
      if (!error) {
        response.setEncoding('utf-8')
        console.log('res:',response.body)
        if (response.body.length === 0) return resolve(false)
        let data = JSON.parse(response.body)
        if (data.code === '100000') {
          resolve(true)
        } else resolve(false)
      } else {
        console.log(error, response.statusCode)
        resolve(false)
      } 
    })
  })
}

// 上传图片
exports.uploadPic = function uploadPic(imgBase64Data, cookie) {
  return new Promise((resolve, reject) => {
    // fs.readFile(path, 'base64', (err, imgBase64Data) => {
      // if (err) {
      //   reject(err)
      // } else {
        request({
          url: 'http://picupload.service.weibo.com/interface/pic_upload.php?ori=1&mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog',
          method: 'POST',
          headers: {
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0",
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Connection': 'Keep-Alive',
            'Cache-Control': 'max-age=0',
            'Cookie': cookie
          },
          credentials: "include",
          body: querystring.stringify({
            b64_data: imgBase64Data.toString()
          })
        }, (error, response, body) => {
          if (!error) {
            let { data } = JSON.parse(response.body.replace(/([\s\S]*)<\/script>/g, ''));
            let imgPid = data.pics.pic_1.pid
            console.log(imgPid)
            resolve(imgPid)
          } else reject('上传图片失败')
        })
      // }
    // })
  })
}

// 发送微博
exports.sendMsg = function sendMsg(msg, picArr = [], cookie) {
  return new Promise((resolve, reject) => {
    request({
      url: `https://weibo.com/aj/mblog/add?ajwvr=6&__rnd=${new Date().getTime()}`,
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie,
        'Host': 'weibo.com',
        'Origin': 'https://weibo.com',
        'Referer': 'https://weibo.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: querystring.stringify({
        'location': 'v6_content_home',
        'text': msg,
        'appkey': '',
        'style_type': '1',
        'pic_id': picArr.join('|'),
        'tid': '',
        'pdetail': '',
        'mid': '',
        'isReEdit': 'false',
        'rank': '0',
        'rankid': '',
        'module': 'stissue',
        'pub_source': 'main_',
        'pub_type': 'dialog',
        'isPri': '0',
        '_t': '0'
      })
    }, (error, response, body) => {
      if (!error) {
        console.log('send over')
        resolve()
      } else reject('send failed')
    })
  })
}


