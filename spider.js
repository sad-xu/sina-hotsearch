// 新浪微博热搜爬虫

const axios = require('axios')
const log = require('./log.js').getLogger('err')

const mongoose = require('mongoose')
const Hotword = require('./models/hotword')

// 微博国际版api
// const APP_URL = 'http://overseas.weico.cc/portal.php?ct=feed&a=search_topic'

// 微博移动端页面
const WEB_URL = 'https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26filter_type%3Drealtimehot'

mongoose.connect('mongodb://localhost/SINA', { useNewUrlParser: true })
	.then(res => console.log('数据库连接成功'))
	.catch(err => console.log(err))
mongoose.Promise = global.Promise;

// 存储
// function saveData() {
// 	Hotword.findOneAndUpdate()
// }


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
	let arr = []
	data.data.cards[0].card_group.forEach(item => {
		if (item.desc_extr) {
			arr.push({
				desc: item.desc,
				num: Number(item.desc_extr)
			})
		}
	})
	console.log(arr)
}




console.log('start...')




getData()