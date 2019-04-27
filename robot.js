/**
 * 定时发微博
 *
 */
const fs = require('fs')
const request = require('request')
const querystring = require('querystring')
const Login = require('./robot/login.js').Login

let cookie = 'SCF=AoQVLVPbqBwDmmpAtHTWkGN1OoYhH-T7VNU5sPrstP00jkZrqshGlRO2kTLmvBD_kP8da3WWGqCCXjVDAqpobLg.; SUB=_2A25xx7dSDeRhGeFO41AT9CbPyzmIHXVStK-arDV8PUJbmtBeLW_ikW9NQV6UFU7nokCty6AFfWl1o4wGaH-zbs-v; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9Whz9ANA37kvuy-dhk3ZZW6c5JpX5K2hUgL.FoM71hzEShn0eh-2dJLoI05LxKML1heLB-BLxKqL1K5L1-eLxK-L1hnL1hqLxKqL1--L1K5LxK-LBonL1hybdNBt; SUHB=0BL4uj9HyQ5QoV; SRT=D.QqHBJZPt5DW!4rMb4cYGS4SLiDEBPDbDRbBu5csHNEYd43MIIdEpMERt4EP1RcsrAcPJPsy9TsVuObEdibPFPOWlU-kDWG!-A4ScP-noUqM3M-EzIQ98Vps-*B.vAflW-P9Rc0lR-ykeDvnJqiQVbiRVPBtS!r3JZPQVqbgVdWiMZ4siOzu4DbmKPWf5ZbBO!mqi-k-WQ!kSFYhJs9TPqSZi49ndDPIJcYPSrnlMcyiiqEf5!POTFtnSdXkJcM1OFyHJDPJ5mkiODEfS4oCI4HJ5mkoODEIi4noIdPJ5mjkODEfU!noTGEJ5mkoODmkI4noNqPJ5mjkOmH6U!noTGb8SmuCWv77; SRF=1556334338; SSOLoginState=1556334338'

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
// http://picupload.service.weibo.com/interface/pic_upload.php?ori=1&mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog
// `https://picupload.weibo.com/interface/pic_upload.php?mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=0&app=miniblog&s=rdxt&pri=null&file_source=1&callback=STK_ijax_${new Date().getTime().toString() + 33}`
function uploadPic(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'base64', (err, imgBase64Data) => {
      if (err) {
        reject(err)
      } else {
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
            resolve(imgPid)
          } else reject('上传图片失败')
        })
      }
    })
  })
}

// 发送微博
function sendMsg(msg, picArr = []) {
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

// 正常微博 [{text, img}]
async function doSend(data) {
  let msg = ''
  let picArr = []
  for (let i = 0; i < data.length; i++) {
    msg += `#${data[i].text}#\n`
    let picId = await uploadPic(data[i].img)
    picArr.push(picId)
  }
  msg += '[吃瓜][吃瓜][吃瓜]'
  await sendMsg(msg, picArr)
}

// 失败微博 
async function failAction() {
  const imgId1 = '007Jiojnly1g2h6e6ul5kj31hc0u043k'
  const imgId2 = '007Jiojnly1g2h6hea3ywj31hc0u043k'
  const imgId3 = '007Jiojnly1g2h6i4dx20j31hc0u043k'
  const msg = `失敗した失敗した失敗した失敗した失敗した
失敗した失敗した失敗した失敗した失敗した
失敗した失敗した失敗した失敗した失敗した
失敗した失敗した失敗した失敗した失敗した

あたしは失敗した失敗した失敗した失敗した
失敗した失敗した失敗した失敗した失敗した
失敗した失敗した失敗したあたしは失敗`
  await sendMsg(msg, [imgId1, imgId2, imgId3])
}

(async () => {
    // const isLogin = await hasPermission()
    // console.log(isLogin)    
    // if (!isLogin) { // token失效，重新登录
    //   console.log('重新登录')
    //   await getCookie()
    // }

    // 上传图片
    // let imgId = await uploadPic('./robot/Failed.jpg')

    // 发送微博
    // await sendMsg('test 1', ['007Jiojnly1g2h0jyvljvj301y01yt8r'])


    // 正常发送
    // doSend([{
    //   text: 'keywords1-xixi(๑´ㅂ`๑)？',
    //   img: './robot/testpic1.jpg'
    // }, {
    //   text: 'keywords2-嘻嘻',
    //   img: './robot/testpic2.jpg'
    // }])
    // 异常发送
    // await failAction()
})()


// 换行 \n 


/*
失敗した失敗した失敗した失敗した失敗した
失敗した失敗した失敗した失敗した失敗した
失敗した失敗した失敗した失敗した失敗した
失敗した失敗した失敗した失敗した失敗した

あたしは失敗した失敗した失敗した失敗した
失敗した失敗した失敗した失敗した失敗した
失敗した失敗した失敗したあたしは失敗
*/



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

