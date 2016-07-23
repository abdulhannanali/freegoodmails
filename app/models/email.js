const mongoose = require("mongoose")

const ObjectId = mongoose.Schema.ObjectId

const emailSchema = new mongoose.Schema({
	recipientEmails: [{
		email: {
			type: String,
			required: true
		}
	}],
	emailId: {
		type: String,
	},
	sender: {
		type: String
	},
	emailType: {
		type: String,
		enum: ['sent', 'received'],
		default: 'sent'
	},
	format: {
		type: String,
		required: true,
		enum: ['html', 'text']
	},
	subject: {type: String, required: true},
	body: {type: String, required: true},
	replies: [{type: ObjectId, ref: "Email"}] // Contains all the replies to the emails
}, {
	timestamps: true
})

module.exports = mongoose.model("Email", emailSchema)