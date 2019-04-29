/**
 * 定时发微博
 *
 */
const request = require('request')
const querystring = require('querystring')
const weibo = require('./robot/weibo.js')
const getChartData = require('./robot/charts.js').getChartData

const CronJob = require('cron').CronJob
const mongoose = require('mongoose')
const CONFIG = require('./utils/config')
const Hotword = require('./model/hotword.js')            // 热搜表
const Timelineword = require('./model/timelineword.js')  // 时序表

mongoose.connect(CONFIG.DATABASE, { useNewUrlParser: true })
  .then(res => console.log('数据库连接成功'))
  .catch(err => console.log(err))
mongoose.Promise = global.Promise

// let cookie = 'SCF=AnsuNlPHR35BakUAxelT9kbgMhE0XiTVnBjfiBmZUNh498O5-FHT9zWtg4oTbC4tscOo6TeJqKWiBs6KqhTcPe4.; SUB=_2A25xwe5LDeRhGeFO41AT9CbPyzmIHXVSt1iDrDV8PUJbmtBeLRTbkW9NQV6UFZVRJguBSyAHnIEDvstc9NUPbk8-; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9Whz9ANA37kvuy-dhk3ZZW6c5JpX5K2hUgL.FoM71hzEShn0eh-2dJLoI05LxKML1heLB-BLxKqL1K5L1-eLxK-L1hnL1hqLxKqL1--L1K5LxK-LBonL1hybdNBt; SUHB=010WXbsdrcPrFM; SRT=D.QqHBJZPtW-4sOmMb4cYGS4SLiDEBPDbDRbBu5csHNEYd43AoT4MpMERt4EP1RcsrAcPJ4bM8TsVuObEdibPFdbSNNcWsAbiuA4YlN4PmWeirRqbKPPB8TqXk*B.vAflW-P9Rc0lR-ykeDvnJqiQVbiRVPBtS!r3JZPQVqbgVdWiMZ4siOzu4DbmKPWf5ZbBO!mqi-k-WQ!kSFYhJs9TPqSZi49ndDPIJcYPSrnlMcyiiqEf5!POTFtnSdXkJcM1OFyHJDPJ5mkiODEfS4oCI4HJ5mkoODEIi4noIdPJ5mjkODEfU!noTGEJ5mkoODmkI4noNqPJ5mjkOmH6U!noTGb8SmuCWv77; SRF=1556454939; SSOLoginState=1556454939'
let cookie = 'SCF=Al5QnSDrfeCT9_aX2bl5B2vV0N0Hmu6sRj1RjO23EK7oUAsY7Q7Lv-sfsA7HpRfqZk7hzUCRFn_pIQXkhNSn3VU.; SUB=_2A25xwd7DDeRhGeFO41AT9CbPyzmIHXVStrcLrDV8PUJbmtBeLWnmkW9NQV6UFXfB-dFt8AP3dTRtLK-4VTjl6mwA; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9Whz9ANA37kvuy-dhk3ZZW6c5JpX5K2hUgL.FoM71hzEShn0eh-2dJLoI05LxKML1heLB-BLxKqL1K5L1-eLxK-L1hnL1hqLxKqL1--L1K5LxK-LBonL1hybdNBt; SUHB=0cS3yWUWevMQmj; SRT=D.QqHBJZPtW-A3MmMb4cYGS4SLiDEBPDbDRbBu5csHNEYd43MpRropMERt4EP1RcsrAcPJP-ukTsVuObEdibPFdFSCIdMFWDYB4Di!PEHrOmjkiES4Tcn-UQWB*B.vAflW-P9Rc0lR-ykeDvnJqiQVbiRVPBtS!r3JZPQVqbgVdWiMZ4siOzu4DbmKPWf5ZbBO!mqi-k-WQ!kSFYhJs9TPqSZi49ndDPIJcYPSrnlMcyiiqEf5!POTFtnSdXkJcM1OFyHJDPJ5mkiODEfS4oCI4HJ5mkoODEIi4noIdPJ5mjkODEfU!noTGEJ5mkoODmkI4noNqPJ5mjkOmH6U!noTGb8SmuCWv77; SRF=1556459156; SSOLoginState=1556459156'

// 查询原始数据 当前排行前九条热搜的数据 [{timeline, desc}]
function getOriginData() {
  return new Promise((resolve, reject) => {
    // 1. 获取当前热搜，得到前9个关键词
    Timelineword.find()
      .sort({ time: -1 })
      .limit(1)
      .then(list => {
        let descList = list[0].data.slice(0, 9).map(item => item.desc)
        // 2. 根据关键词搜索历史数据
        Hotword.find({ desc: { $in: descList } }, { timeline: 1, desc: 1}) // 乱序
          .then(originData => {
            // 按最新热度，降序排
            originData.sort((a, b) => b.timeline[b.timeline.length - 1].n - a.timeline[a.timeline.length - 1].n)
            resolve(originData)
          })
      })
  })
}


// 正常微博 [{desc, imgData}]
async function doSend(data) {
  let msg = ''
  let picArr = []
  for (let i = 0; i < data.length; i++) {
    msg += `#${data[i].desc}#\n`
    let picId = await weibo.uploadPic(data[i].imgData, cookie)
    picArr.push(picId)
  }
  msg += '[吃瓜][吃瓜][吃瓜]'
  await weibo.sendMsg(msg, picArr, cookie)
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
  await weibo.sendMsg(msg, [imgId1, imgId2, imgId3], cookie)
}

// 一次流程
async function init() {
  try {
    // 登录 获取cookie
    await weibo.getCookie().then(cookie => {
      cookie = cookie
    }).then(async () => {
      // 查询数据库
      let originData = await getOriginData()
      // 生成base64数据
      let chartData = []
      for (let i = 0; i < originData.length; i++) {
        let color = ''
        if (i <= 2) color = '#ff576b'
        else if (i > 2 && i < 6) color = '#ffb642'
        else color = '#7cb5ec'
        chartData.push(await getChartData(originData[i], color))
      }
      console.log(chartData.map(item => item.desc))
      // 上传图片，发送微博
      await doSend(chartData)
    })    
  } catch(err) {
    console.log(err)
  }
}


  

// 定时任务
// init()

// weibo.getCookie().then(res => {
//   console.log(res)
// })

const job = new CronJob('0 32 11 * * *', function() {
  try {
    init()
  } catch(e) {
    console.log(e)
  }
})
console.log('cron')
job.start()


    // 登录状态验证
    // const isLogin = await hasPermission(cookie)
    // console.log(isLogin)    
    // if (!isLogin) { // token失效，重新登录
    //   console.log('重新登录')
    //   cookie = await weibo.getCookie()
    // }


