/**
 * 定时发微博
 *
 */
const axios = require('axios')
const sinaSSOEncoder = require('./ssoLogin.js')

/**
 * 模拟登录
 *
 */

// 1. 接口1 获取加密参数
// GET https://login.sina.com.cn/sso/prelogin.php?entry=sso&callback=sinaSSOController.preloginCallBack&su=MTAzMTU2ODc1NCU0MHFxLmNvbQ%3D%3D&rsakt=mod&client=ssologin.js(v1.4.15)&_=1555433371325
// let option = {
//   retcode: 0,
//   exectime: 5,
//   is_openlock: 0,
//   pcid: "gz-e6588f02e5bdb92c002d4654b2b45ede7a39",
//   nonce: "TKAE10",
//   servertime: 1555433275,
//   rsakv: "1330428213",
//   pubkey: "EB2A38568661887FA180BDDB5CABD5F21C7BFD59C090CB2D245A87AC253062882729293E5506350508E7F9AA3BB77F4333231490F915F6D63C55FE2F08A49B353F444AD3993CACC02DB784ABBB8E42A9B1BBFFFB38BE18D78E87A0E41B9B8F73A928EE0CCEE1F6739884B9777E4FE9E88A1BBE495927AC4A799B3181D6442443",
// }


// 2. 生成key 登录
// POST  https://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.15)
// let d = {
//   cdult: "3",
//   domain: "sina.com.cn",
//   encoding: "UTF-8",
//   entry: "sso",
//   from: "null",
//   gateway: "1",
//   pagerefer: "",
//   prelt: "165",
//   pwencode: "rsa2",
//   returntype: "TEXT",
//   savestate: "30",
//   useticket: "0",
//   vsnf: "1",
//   service: "sso",
//   sr: "1366*768",
//   servertime: "1555433275",
//   nonce: "TKAE10",
//   rsakv: "1330428213",
//   su: "MTAzMTU2ODc1NCU0MHFxLmNvbQ%3D%3D", // base64用户名
//   sp: "bbb15ee027c55ba80c3a1fee6c6ebccdd3057f5d45ac147edcc7981aeae3de458f1fb2d55a2ca94474ae702819ef7317b6741d75216ee90fd7bc1c9bbb550bb8da52aae775ca5ababd90d11ee4fd0ec73853409b0ac838eed7aebc1abd3331d3d99537260ecaf873a2e85178202a1880784ac51540aa591b2cecedf9b517c726",
// }


// let su = encryptUserName("1031568754@qq.com") // 用户名
// let sp = encrypPassword("xhc151136", {
//   pubkey: 'EB2A38568661887FA180BDDB5CABD5F21C7BFD59C090CB2D245A87AC253062882729293E5506350508E7F9AA3BB77F4333231490F915F6D63C55FE2F08A49B353F444AD3993CACC02DB784ABBB8E42A9B1BBFFFB38BE18D78E87A0E41B9B8F73A928EE0CCEE1F6739884B9777E4FE9E88A1BBE495927AC4A799B3181D6442443',
//   servertime: 1555433275,
//   nonce: 'TKAE10'
// })


// 加密用户名 -> base64
function encryptUserName(name) {
  return Buffer.from(name).toString('base64')
}

// 加密密码
function encrypPassword(password, { pubkey, servertime, nonce } = {}) {
  let RSAKey = new sinaSSOEncoder.RSAKey()
  RSAKey.setPublic(pubkey, "10001")
  return RSAKey.encrypt([servertime, nonce].join("\t") + "\n" + password)
}


// 
function login() {
  return axios.get('https://login.sina.com.cn/sso/prelogin.php?entry=account&callback=sinaSSOController.preloginCallBack&su=MTAzMTU2ODc1NCU0MHFxLmNvbQ%3D%3D&rsakt=mod&client=ssologin.js(v1.4.15)')
    .then(res => {
      if (res.status === 200) {
        const option = JSON.parse(res.data.slice(35, -1))
        return option
      } else return null
    })
    .then(option => {
      if (option) {
        return axios.post('https://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.15)', {
          cdult: "2",
          domain: "weibo.com",
          encoding: "UTF-8",
          entry: "weibo",
          from: "null",
          gateway: "1",
          pagerefer: "https://login.sina.com.cn/crossdomain2.php?action=logout&r=https%3A%2F%2Fpassport.weibo.com%2Fwbsso%2Flogout%3Fr%3Dhttps%253A%252F%252Fweibo.com%26returntype%3D1",
          prelt: "326",
          pwencode: "rsa2",
          returntype: "TEXT",
          savestate: "7",
          useticket: "1",
          vsnf: "1",
          service: "miniblog",
          sr: "1366*768",
          servertime: option.servertime,
          nonce: option.nonce,
          rsakv: option.rsakv,
          su: encryptUserName("1031568754@qq.com"),
          sp: encrypPassword("xhc151136", {
            pubkey: option.pubkey,
            servertime: option.servertime,
            nonce: option.nonce
          })
        }).then(res => {
          console.log('112', res.data)
          return 'ok'
        }).catch(err => console.log('post err: ', err))
      }
    })
    .catch(err => console.log('get err: ', err))
}


login().then(res => {
  console.log('121', res)
}).catch(err => console.log('login err: ', err))