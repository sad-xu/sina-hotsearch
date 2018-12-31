const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
	t: Number,
	n: Number
}, {
	_id: false
})

const hotwordSchema = mongoose.Schema({
	desc: {
		type: String,
		required: true,
		unique: true
	},
	timeline: [ itemSchema ]
})

const Hotword = mongoose.model('Hotword', hotwordSchema)

module.exports = Hotword