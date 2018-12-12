const express = require('express')
const axios = require('axios')
const router = express.Router()
const Hotword = require('../model/hotword.js')
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

/**
 * 关键词搜索
 * keyword --> [{_id, desc}]
 */
router.get('/search/keyword', (req, res) => {
	let keyword = req.query.keyword.trim()
	if (!keyword.length) return retRes(res, [], 2, '缺少关键词')
	Hotword.find(
		{ desc: { $regex: keyword, $options: '$i' } },
		'_id desc'
	).limit(10)
	.then(list => retRes(res, list))
	.catch(err => retRes(res, err, 1, '查询出错'))
})


/**
 * 获取单条热搜历史数据
 * _id --> [[t, n],...]
 */

router.get('/search/historydata/:_id', (req, res) => {
	let _id = req.params._id
	if (!_id) return retRes(res, [], 1, 'no _id')
	Hotword.findById(_id, { timeline: 1})
		.then(data => {
			retRes(
				res, 
				data.timeline.reduce((all, item) => {
					all.push([item.t, item.n])
					return all
				}, [])
			)
		})
		.catch(err => retRes(res, err, 2, '查询出错'))
})





module.exports = router
