const mongoose = require('mongoose')

const hotwordSchema = mongoose.Schema({
	desc: {
		type: String,
		required: true,
		unique: true
	},
	timeline: [
		{
			t: Number,
			n: Number
		}
	]
})

const Hotword = mongoose.model('Hotword', hotwordSchema)

module.exports = Hotword