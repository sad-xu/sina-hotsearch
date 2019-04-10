
const CronJob = require('cron').CronJob

function init() {
  let a = {}
  a.push(2)
}

const job = new CronJob('*/10 * * * * *', function() {
  try {
    init()
  } catch(e) {
    console.log(e)
  }
  console.log('di di di')
})
job.start()

