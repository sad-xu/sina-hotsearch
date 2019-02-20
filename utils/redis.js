// redis 连接

const redis = require('redis')
const log = require('./log.js').getLogger('err')
const CONFIG = require('./config')

const client = redis.createClient(CONFIG.REDIS)

client.on('error', function (err) {
  log.error("redis error: " + err)
})

client.on('ready', function (err) {
  if (err) {
    log.error('err : ' + err)
  } else {
    console.log('Redis is ready ...')
  }
})  

module.exports = client
