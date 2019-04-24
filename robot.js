/**
 * 定时发微博
 *
 */
const fs = require('fs')
const request = require('request')
const querystring = require('querystring')
const Login = require('./robot/login.js').Login

let cookie = 'SCF=Am8IKN_j2CdumcxuoL2cSgQPvmkvEqYbQkBGE062BWklNkVFUw47ZOEYH9RCqiIwkW2jUEVll49e8-32LbVfZ1g.; SUB=_2A25xxAkHDeRhGeFO41AT9CbPyzmIHXVSsH3PrDV8PUJbmtBeLXH8kW9NQV6UFZq7JMv54mZHEg67Dnpjng2lsV1u; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9Whz9ANA37kvuy-dhk3ZZW6c5JpX5K2hUgL.FoM71hzEShn0eh-2dJLoI05LxKML1heLB-BLxKqL1K5L1-eLxK-L1hnL1hqLxKqL1--L1K5LxK-LBonL1hybdNBt; SUHB=0FQ7wTKrZgFLW6; SRT=D.QqHBJZPt5mEhNmMb4cYGS4SLiDEBPDbDRbBu5csHNEYd43izJsBpMERt4EP1RcsrAcPJdmXtTsVuObEdibPFdem3N!s-iOMkd!YESqR3MFunTcueJcoqPZEs*B.vAflW-P9Rc0lR-ykeDvnJqiQVbiRVPBtS!r3JZPQVqbgVdWiMZ4siOzu4DbmKPWf5ZbBO!mqi-k-WQ!kSFYhJs9TPqSZi49ndDPIJcYPSrnlMcyiiqEf5!POTFtnSdXkJcM1OFyHJDPJ5mkiODEfS4oCI4HJ5mkoODEIi4noIdPJ5mjkODEfU!noTGEJ5mkoODmkI4noNqPJ5mjkOmH6U!noTGb8SmuCWv77; SRF=1556117847; SSOLoginState=1556117847'
// let cookie = 'SINAGLOBAL=5375517568265.484.1504781249536; un=1031568754@qq.com; UOR=,,login.sina.com.cn; wvr=6; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9W5QFdJJgrlNns25j79f.D.05JpX5KMhUgL.Fo-0e05NS0q7eKn2dJLoIEXLxK-LBKqL1K.LxKnL1K.LB-zLxK-L1K5L1hnLxKMLBKML12BLxK-LB-BL1K5t; ALF=1587650468; SSOLoginState=1556114470; SCF=AlX4vhQtCIlaI07fawGdHyf8Og8f2-IWerfEHarvUMUkprrSzU4APb1DJ43iX8LogtyO4s2Gh5TXOuCMM6SNWtM.; SUB=_2A25xxBx5DeRhGeNN6FIW9yjMyjSIHXVSsAqxrDV8PUNbmtBeLWnykW9NSbuFeSfm0thdv1F7FjJVW-7H6rEucRys; SUHB=0XDl2MN7pnQ_7K; _s_tentry=login.sina.com.cn; Apache=8637723983963.937.1556114582335; ULV=1556114582362:420:6:2:8637723983963.937.1556114582335:1556031267019; webim_unReadCount=%7B%22time%22%3A1556118993360%2C%22dm_pub_total%22%3A0%2C%22chat_group_pc%22%3A0%2C%22allcountNum%22%3A0%2C%22msgbox%22%3A0%7D'
// let cookie = ''

// 登陆 获取cookie
function getCookie() {
  return new Promise((resolve, reject) => {
    new Login('1031568754@qq.com', 'xhc151136')
      .init()
      .then(res => {
        cookie = res
        console.log(cookie)
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
function uploadPic(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'base64', (err, imgBase64Data) => {
      if (err) console.log(err)
      request({
        url: `https://picupload.weibo.com/interface/pic_upload.php?mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=0&app=miniblog&s=rdxt&pri=null&file_source=1&callback=STK_ijax_${new Date().getTime().toString() + 33}`,
        method: 'POST',
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0",
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          'Accept-Encoding': 'gzip, deflate, br',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Connection': 'Keep-Alive',
          "Referer": 'https://weibo.com/u/5330776018/home',
          'Host': 'picupload.weibo.com',
          'Origin': 'https://weibo.com',
          'Upgrade-Insecure-Requests': 1,
          'Cache-Control': 'max-age=0',
          // 'followRedirect': false,
          // 'followAllRedirects': false,
          // 'removeRefererHeader': true,
          'cookie': cookie
        },
        credentials: "include",
        body: querystring.stringify({
          b64_data: encodeURIComponent(imgBase64Data.toString())
        })
      }, (error, response, body) => {
        if (!error) {
          console.log(response.rawHeaders, body)
          resolve()
        } else reject('上传图片失败')
      })
    })
  })
}


(async () => {
    // const isLogin = await hasPermission()
    // console.log(isLogin)    
    // if (!isLogin) { // token失效，重新登录
    //   console.log('重新登录')
    //   await getCookie()
    // }
    // 发微博
    await uploadPic('./robot/testpic1.jpg')
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

