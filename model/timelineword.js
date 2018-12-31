const mongoose = require('mongoose')


const itemSchema = mongoose.Schema({
	desc: String,
	n: Number
}, {
	_id: false
})

const timelinewordSchema = mongoose.Schema({
	time: {
		type: Number,
		required: true,
		unique: true
	},
	data: [ itemSchema ]
})

const Timelineword = mongoose.model('Timelineword', timelinewordSchema)

module.exports = Timelineword