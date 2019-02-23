
const CronJob = require('cron').CronJob
const mongoose = require('mongoose')
const CONFIG = require('./utils/config')
const Timelineword = require('./model/timelineword')
const client = require('./utils/redis.js')

/*
  每天 1:11 定时跑一次
  周、月、全部 热度前50的数据
  存redis
  cross-env NODE_ENV=production node loadboard.js
*/

mongoose.connect(CONFIG.DATABASE, { useNewUrlParser: true })
  .then(res => console.log('数据库连接成功'))
  .catch(err => console.log(err))
mongoose.Promise = global.Promise


function aggregate(key, time) {
  return new Promise((resolve, reject) => {
    Timelineword.aggregate([
      { // 筛选 周/月/所有
        $match: { time:  { $gte: time } }
      }, { // 铺平数组
        $unwind: '$data'
      }, { // 重新设字段
        $project: {
          _id: 0, 
          desc: '$data.desc', 
          n: '$data.n'
        }
      }, { // 根据关键词分组,保留热度最大值
        $group: {
          _id: '$desc',
          n: { $max : '$n' }
        }
      }, {
        $sort: { n : -1}
      }, { 
        $limit: 50
      }
    ]).then(res => {
      if (res instanceof Array && res.length > 0) {
        // save in redis
        let retObj = {
          update: new Date().getTime(),
          data: res.map(item => {
            return {
              desc: item._id,
              n: item.n
            }
          })
        }
        client.set(key, JSON.stringify(retObj), err => {
          resolve()
        })
      } else {
        resolve()
      }
    })
  })
}


function init() {
  let now = Math.floor(new Date().getTime() / 1000)
  let weekTime = now - 7 * 86400
  let monthTime = now - 30 * 86400
  let allTime = 0

  Promise.resolve()
    .then(() => aggregate('leadofweek', weekTime))
    .then(() => aggregate('leadofmonth', monthTime))
    .then(() => aggregate('leadofall', allTime))
}

// setTimeout(function() {
//   console.log('start')
//   init()
// }, 3000)

// 定时任务
const job = new CronJob('0 11 1 * * *', function() {
  init()
})
job.start()



