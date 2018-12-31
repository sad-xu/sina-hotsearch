// 新浪微博热搜爬虫

const CronJob = require('cron').CronJob
const axios = require('axios')
const log = require('./log.js').getLogger('err')

const mongoose = require('mongoose')
const Hotword = require('./model/hotword')
const Timelineword = require('./model/Timelineword')

// 微博国际版api
// const APP_URL = 'http://overseas.weico.cc/portal.php?ct=feed&a=search_topic'

// 微博移动端页面
const WEB_URL = 'https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26filter_type%3Drealtimehot'

mongoose.connect('mongodb://localhost/SINA', { useNewUrlParser: true })
	.then(res => console.log('数据库连接成功'))
	.catch(err => console.log(err))
mongoose.Promise = global.Promise

// 存储
function saveData(d) {
	// {desc: String, t: Number, n: Number}
	Hotword.findOneAndUpdate(
		{ desc: d.desc },
		{ $push: { 
				timeline: {t: d.t, n: d.n} 
			}
		},
		{ upsert: true }
	).then(res => {

	}).catch(err => {
		log.error(d, err)
	})
}

// save 时间线数据
function saveTimelinewords(data, time) {
	Timelineword.create({
		time,
		data
	}).then(res => {

	}).catch(err => {
		log.error(d, err)
	})
}


// 获取数据
function getData() {
	axios.get(WEB_URL)
		.then(res => {
			if (res.status === 200) {
				webProcessData(res.data)
			} else {
				log.error('网络错误')
			}
		}).catch(err => {
			log.error(err)
		})
}


// 移动端页面 处理数据
function webProcessData(data) {
	if (data.ok !== 1) return log.error('error:', data)
	let time = Math.floor(new Date().getTime() / 1000)
	let usefulData = data.data.cards[0].card_group.reduce((all, item) => {
		if (item.desc_extr) {
			all.push({
			 desc: item.desc, 
			 n: Number(item.desc_extr) 
			})
		}
		return all
	}, [])
	usefulData.forEach(item => {
		saveData({
			desc: item.desc, 
			t: time, 
			n: item.n
		})
	})
	saveTimelinewords(usefulData, time)
}




console.log('start...')

// 定时任务
const job = new CronJob('0 */5 * * * *', function() {
	getData()
	console.log(`doing in ${new Date()}`)
})
job.start()




