const express = require('express')
const axios = require('axios')
const router = express.Router()
const Hotword = require('../model/hotword.js')						// 热搜表
const Timelineword = require('../model/timelineword.js')  // 时序表

const retRes = require('../utils/response.js')

const client = require('../redis.js')

/**
 * 获取系统时间 
 * 
 */
router.get('/systime', (req, res) => {
	retRes(res, {time: new Date()})
})


/**
 * 获取当前热搜 
 * 取数据库最后一条
 * TODO: redis缓存2分钟的数据
 */
router.get('/realtimehot', (req, res) => {
	Timelineword.find()
		.sort({ time: -1 })
		.limit(1)
		.then(list => retRes(res, list[0]))
		.catch(err => retRes(res, err, 1, '查询出错'))
})

/**
 * 关键词搜索 取最近的10条
 * keyword --> [{_id, desc}]
 */
router.get('/search_by_keyword', (req, res) => {
	let keyword = req.query.keyword.trim()
	if (!keyword.length) return retRes(res, [], 2, '缺少关键词')
	Hotword.find(
		{ desc: { $regex: keyword, $options: '$i' } },
		'_id desc'
	).sort({_id: -1}).limit(10)
	.then(list => retRes(res, list))
	.catch(err => retRes(res, err, 1, '查询出错'))
})


/**
 * 获取热搜历史数据
 * [_id1, _id2, ...]
 */
router.post('/historydata_by_id', (req, res) => {
	let _idArr = req.body._id
	if (!(_idArr instanceof Array)) return retRes(res, [], 1, '_id in not Array')
	if (!_idArr.length) return retRes(res, [], 2, '_id no content')	
	Hotword.find({ _id: { $in: _idArr } }, { timeline: 1, desc: 1})
		.then(data => {
			retRes(res, data)
		})
		.catch(err => retRes(res, err, 2, '查询出错'))
})


/**
 * 获取热搜历史数据
 * [desc1, desc2, ...]
 * 
 */
router.post('/historydata_by_desc', (req, res) => {
	let descArr = req.body.desc
	if (!(descArr instanceof Array)) return retRes(res, [], 1, 'desc in not Array')
	if (!descArr.length) return retRes(res, [], 2, 'desc no content')	
	Hotword.find({ desc: { $in: descArr } }, { timeline: 1, desc: 1})
		.then(data => {
			retRes(res, data)
		})
		.catch(err => retRes(res, err, 2, '查询出错'))
})


module.exports = router
