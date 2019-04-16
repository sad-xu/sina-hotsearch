/**
 * 定时发微博
 *
 */


/**
 * 模拟登录
 *
 */

// 1. 接口1 获取加密参数
// GET https://login.sina.com.cn/sso/prelogin.php?entry=sso&callback=sinaSSOController.preloginCallBack&su=MTAzMTU2ODc1NCU0MHFxLmNvbQ%3D%3D&rsakt=mod&client=ssologin.js(v1.4.15)&_=1555433371325
let ret = {
  retcode: 0,
  exectime: 5,
  is_openlock: 0,
  pcid: "gz-e6588f02e5bdb92c002d4654b2b45ede7a39",
  // important
  nonce: "TKAE10",
  pubkey: "EB2A38568661887FA180BDDB5CABD5F21C7BFD59C090CB2D245A87AC253062882729293E5506350508E7F9AA3BB77F4333231490F915F6D63C55FE2F08A49B353F444AD3993CACC02DB784ABBB8E42A9B1BBFFFB38BE18D78E87A0E41B9B8F73A928EE0CCEE1F6739884B9777E4FE9E88A1BBE495927AC4A799B3181D6442443",
  rsakv: "1330428213",
  servertime: 1555433275
}

// 2. 生成key 登录
// POST  https://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.15)
let option = {
  cdult: "3",
  domain: "sina.com.cn",
  encoding: "UTF-8",
  entry: "sso",
  from: "null",
  gateway: "1",
  pagerefer: "",
  prelt: "165",
  pwencode: "rsa2",
  returntype: "TEXT",
  savestate: "30",
  useticket: "0",
  vsnf: "1",
  service: "sso",
  sr: "1366*768",
  // important
  servertime: "1555433275",
  nonce: "TKAE10",
  rsakv: "1330428213",
  sp: "bbb15ee027c55ba80c3a1fee6c6ebccdd3057f5d45ac147edcc7981aeae3de458f1fb2d55a2ca94474ae702819ef7317b6741d75216ee90fd7bc1c9bbb550bb8da52aae775ca5ababd90d11ee4fd0ec73853409b0ac838eed7aebc1abd3331d3d99537260ecaf873a2e85178202a1880784ac51540aa591b2cecedf9b517c726",
  su: "MTAzMTU2ODc1NCU0MHFxLmNvbQ%3D%3D"
}


let su = btoa("1031568754@qq.com") // 用户名
let sp = 

