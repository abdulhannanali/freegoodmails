const mongoose = require("mongoose")

const ipSchema = new mongoose.Schema({
	ip: {
		type: Number,
		required: true
	},
	times: {
		type: Number,
		required: true
	},
	perDay: [Number]
})

module.exports = mongoose.model("Ip", ipSchema)