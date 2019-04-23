/**
 * 定时发微博
 *
 */
const Login = require('./robot/login.js').Login

let cookie = ''

function getCookie() {
  return new Login('1031568754@qq.com', 'xhc151136').init()
}

getCookie().then(res => {
  cookie = res
  console.log(res)
}).catch(err => {
  console.log(err)
})










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

