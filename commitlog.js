
// 两个项目的 commit log 数据
// 只存redis 每天6:01更新 
const CronJob = require('cron').CronJob
const axios = require('axios')
const client = require('./utils/redis.js')
const CONFIG = require('./utils/config')

const request = axios.create({
  baseURL: 'https://api.github.com/repos/sad-xu/',
  headers: {
    'Authorization': 'token 386b71a5a2e8def8e2de5d439b75e5dac0212078'
  }
})


function getLog(url, key) {
  return new Promise((resolve, reject) => {
    request.get(url).then(res => {
      let data = res.data
      if (data instanceof Array && data.length) {
        let commitLog = data.map(item => {
          return {
            msg: item.commit.message,
            date: item.commit.committer.date
          }
        })
        let retObj = {
          update: new Date().getTime(),
          data: commitLog
        }
        client.set(key, JSON.stringify(retObj), err => {
          console.log(err)
          resolve()
        })
      } else {
        resolve()
      }
    }).catch(err => {
      console.log(err)
      resolve()
    })
  })
}

function init() {
  console.log('start')
  Promise.resolve()
    .then(() => getLog('/sina-hotsearch/commits', 'logback'))
    .then(() => getLog('/sina-hotsearch-xcx/commits', 'logfront'))
}

// init()

// 定时任务
const job = new CronJob('0 1 6 * * *', function() {
  try {
    init()
  } catch(e) {
    console.log(e)
  }
})
job.start()

