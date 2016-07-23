const validator = require("validator")
const expressValidator = require("express-validator")

const maxEmails = 3

module.exports = {
	middleware: expressValidator({
		customValidators: this.customValidators
	}),
	validationSchema: {
		'from': {
			optional: true, 
			isValidEmails: {
				errorMessage: "The sender email is not valid"
			}
		},
		'to': {
			isValidEmails: {
				errorMessage: "The recipient(s) email is/are not valid."
			},
			isValidEmailLength: {
				options: [3],
				errorMessage: "The recipients emails are more than " + maxEmails
			}
		},
		subject: {
			notEmpty: {
				errorMessage: "the emails can not be without subject"
			}
		},
		body: {
			notEmpty: {
				errorMessage: "the body of the email is required"
			}
		}
	},

	customValidators: {
		// Check if the every email this contains is valid or not!
		isValidEmails: function (emails) {
			if (Array.isArray(emails)) {
				return emails.every(function (email) {
					return validator.isEmail(email)
				})

			}
			else if (typeof emails == "string") {
				return emails.split(",").every(function (email) {
					return validator.isEmail(email)
				})
			}

			return false
		},
		isValidEmailLength: function (emails, length) {
			if (typeof emails == "string") {
				emails = emails.split(",")
			}

			return emails.length <= length
		}
	},
	customSanitizers: {
		// toEmailsArray sanitizes the emails in the string CSV form to an array
		toEmailsArray: function (emails) {
			if (typeof emails == "string") {
				return emails.replace(/\s/g, "").split(",")				
			}

			return emails
		}
	}
}