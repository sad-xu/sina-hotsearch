// redis 连接

const redis = require('redis')
const log = require('./log.js').getLogger('err')

const client = redis.createClient({
  host: '47.101.221.188',
  port: 6379,
  password: 'xhc151136'
})

client.on('error', function (err) {
  log.error("redis error: " + err)
})

client.on('ready', function (err) {
  if (err) {
    log.error('err : ' + err)
  } else {
    log.error('redis is ready')
    console.log('Redis is ready ...')
  }
})  

module.exports = client