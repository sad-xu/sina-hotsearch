/**
 * 定时发微博
 *
 */
const fs = require('fs')
const request = require('request')
const querystring = require('querystring')
const Login = require('./robot/login.js').Login

let cookie = 'SCF=AldmGDEwDPkD92RXILczZb2G8pPApbPauTIKHBTujc57QXAslK-sLHrWCgsRG1Gl-AQPsxAbIPZRXniM9zY4Ydo.; SUB=_2A25xu1A6DeRhGeFO41AT9CbPyzmIHXVSscbyrDV8PUJbmtBeLRSkkW9NQV6UFUu0kxYJRe2FtiGpn9f3thO4HoSH; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9Whz9ANA37kvuy-dhk3ZZW6c5JpX5K2hUgL.FoM71hzEShn0eh-2dJLoI05LxKML1heLB-BLxKqL1K5L1-eLxK-L1hnL1hqLxKqL1--L1K5LxK-LBonL1hybdNBt; SUHB=0eb9sZ1rRPZAco; SRT=D.QqHBJZPtWOEBi!Mb4cYGS4SLiDEBPDbDRbBu5csHNEYd43iZRebpMERt4EP1RcsrAcPJ4bihTsVuObEdibPFPQ4nT3YSNbHbJ!SrT4WnUZbcJ3MfOqMzUsiz*B.vAflW-P9Rc0lR-ykeDvnJqiQVbiRVPBtS!r3JZPQVqbgVdWiMZ4siOzu4DbmKPWf5ZbBO!mqi-k-WQ!kSFYhJs9TPqSZi49ndDPIJcYPSrnlMcyiiqEf5!POTFtnSdXkJcM1OFyHJDPJ5mkiODEfS4oCI4HJ5mkoODEIi4noIdPJ5mjkODEfU!noTGEJ5mkoODmkI4noNqPJ5mjkOmH6U!noTGb8SmuCWv77; SRF=1556029546; SSOLoginState=1556029546'

// 登陆 获取cookie
function getCookie() {
  return new Promise((resolve, reject) => {
    new Login('1031568754@qq.com', 'xhc151136')
      .init()
      .then(res => {
        cookie = res
        resolve(res)
      }).catch(err => {
        reject(err)
      })
  })
}

// 点赞固定微博，检验cookie是否有效
function hasPermission() {
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
      if (!error && response.statusCode === 200) {
        response.setEncoding('utf-8');
        let data = JSON.parse(response.body)
        if (data.code === '100000') {
          resolve(true)
        } else reject(false)
      } else reject(false)
    })
  })
}

// 上传图片
function uploadPic(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'base64', (err, imgBase64Data) => {
      if (err) console.log(err)
      request({
        url: `https://picupload.weibo.com/interface/pic_upload.php?mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=0&app=miniblog&s=rdxt&pri=null&file_source=1&callback=STK_ijax_155603547178672`,
        method: 'POST',
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0",
          'Accept-Language': 'en-US,en;q=0.5',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Connection': 'Keep-Alive',
          "Referer": 'https://weibo.com/u/5330776018/home',
          'Host': 'picupload.weibo.com',
          'Origin': 'https://weibo.com',
          'Upgrade-Insecure-Requests': 1,
          'Cache-Control': 'max-age=0',
          'Content-Length': 4259,
          'cookie': cookie
        },
        gzip: true,
        credentials: "include",
        body: querystring.stringify({
          b64_data: encodeURIComponent(imgBase64Data.toString())
        })
      }, (error, response, body) => {
        if (!error) {
          console.log(response.headers, body)
          resolve('s')
        } else reject('上传图片失败')
      })
    })
  })
}


(async () => {
  // const isLogin = await hasPermission()
  // if (!isLogin) { // token失效，重新登录
  //   console.log('重新登录')
  //   await getCookie()
  // }
  // 发微博
  await uploadPic('./robot/testpic2.png')
})()







// const axios = require('axios')
// const sinaSSOEncoder = require('./ssoLogin.js')

// const request = axios.create({
//   headers: {
//     "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0",
//     'Accept-Language': 'zh-cn',
//     'Content-Type':'application/x-www-form-urlencoded',
//     'Connection': 'Keep-Alive'
//   },
//   withCredentials: true
// })

// // 加密用户名 -> base64
// function encryptUserName(name) {
//   return Buffer.from(name).toString('base64')
// }

// // 加密密码
// function encrypPassword(password, { pubkey, servertime, nonce } = {}) {
//   let RSAKey = new sinaSSOEncoder.RSAKey()
//   RSAKey.setPublic(pubkey, "10001")
//   return RSAKey.encrypt([servertime, nonce].join("\t") + "\n" + password)
// }

// function login() {
//   return request.get('https://login.sina.com.cn/sso/prelogin.php?entry=weibo&callback=sinaSSOController.preloginCallBack&su=MTAzMTU2ODc1NCU0MHFxLmNvbQ%3D%3D&rsakt=mod&checkpin=1&client=ssologin.js(v1.4.18)')
//     .then(res => {
//       if (res.status === 200) {
//         const option = JSON.parse(res.data.slice(35, -1))
//         return option
//       } else return null
//     })
//     .then(option => {
//       console.log(option)
//       if (option) {
//         const su = encryptUserName("1031568754@qq.com")
//         const sp = encrypPassword("xhc151136", {
//           pubkey: option.pubkey,
//           servertime: option.servertime,
//           nonce: option.nonce
//         })
//         return request({
//           method: 'post',
//           url: 'https://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.18)',
//           data: {
//             cdult: "2",
//             domain: "weibo.com",
//             encoding: "UTF-8",
//             entry: "weibo",
//             from: "null",
//             gateway: "1",
//             qrcode_flag: false,
//             pagerefer: "",
//             prelt: "326",
//             pwencode: "rsa2",
//             returntype: "TEXT",
//             savestate: "7",
//             useticket: "1",
//             vsnf: "1",
//             service: "miniblog",
//             sr: "1366*768",
//             servertime: option.servertime,
//             nonce: option.nonce,
//             rsakv: option.rsakv,
//             su,
//             sp
//           }
//         }).then(res => {
//           console.log(su, sp)
//           console.log('112', res.data)
//           return 'ok'
//         }).catch(err => console.log('post err: ', err))
//       }
//     })
//     .catch(err => console.log('get err: ', err))
// }


// login().then(res => {
//   console.log('121', res)
// }).catch(err => console.log('login err: ', err))

