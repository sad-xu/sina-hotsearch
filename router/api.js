const express = require('express')
const axios = require('axios')
const router = express.Router()

const retRes = require('../utils/response.js')


/**
 * 获取系统时间 
 * 
 */
router.get('/systime', (req, res) => {
	retRes(res, {time: new Date()})
})


/**
 * 获取当前热搜
 *
 * TODO: redis缓存2分钟的数据
 */
router.get('/realtimehot', (req, res) => {
	axios.get('https://m.weibo.cn/api/container/getIndex?containerid=106003type%3D25%26filter_type%3Drealtimehot')
		.then(response => {
			if (response.status === 200) {
				let data = response.data
				if (data.ok !== 1) return retRes(res, data, 3, '微博数据错误')
				try {
					let arr = []
					data.data.cards[0].card_group.forEach(item => {
						if (item.desc_extr) {
							arr.push({
								desc: item.desc,
								n: Number(item.desc_extr)
							})
						}
					})
					retRes(res, arr)
				} catch(e) {
					retRes(res, e, 2, '数据解析错误')
				}
			} else {
				retRes(res, response, 4, '网络错误')
			}
		})
		.catch(err => {
			retRes(res, err, 5, '微博接口报错')
		})	
})





module.exports = router
