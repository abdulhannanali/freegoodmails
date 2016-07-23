const kramed = require("kramed")

const nodemailer = require("nodemailer")
const mgTransport = require("nodemailer-mailgun-transport")

function Mailer (api_key, domain, options) {
	var options = options || {}

	if (!api_key) {
		throw new Error("api_key is required")
	}
	else if (!domain) {
		throw new Error("domain is required")
	}

	this.auth = {
		auth: {
			api_key: api_key,
			domain: domain
		}
	}

	var {
		email:defaultEmail,
		format:defaultFormat,
		maxRecipients
	} = options

	this.defaultEmail = defaultEmail || "postmaster@" + domain
	this.defaultFormat = defaultFormat || "html"

	// Maximum number of recipients an email can be sent in one request
	// 0 means email can be sent to unlimited number of recipients
	this.maxRecipients = maxRecipients || 3

	this.mailer = nodemailer.createTransport(mgTransport(this.auth))
}


/**
  * sendMail functions sends the mail using the this.mailer transport
  */
Mailer.prototype.sendMail = function (options, callback) {
	try {
		this._enforce(options, ["subject", "to", "body"])
	}
	catch (error) {
		return callback(error)
	}

	var {
		from=this.defaultEmail,
		format=this.defaultFormat,
		subject,
		to,
		body
	} = options



	if (this.maxRecipients && Array.isArray(to)) {
		if (to.length > this.maxRecipients) {
			return callback(new Error(`There can only be ${this.maxRecipients} recipients at max!`))
		}
	}
	else if (this.maxRecipients && typeof to == "string") {
		if (to.split(",").length > this.maxRecipients) {
			return callback(new Error(`There can only be ${this.maxRecipients} recipients at max!`))
		}
	}

	var senderObj = {
		from,
		to,
		subject
	}


	if (format == "markdown" || format == "md") {
		kramed(body, (error, parsedBody) => {
			if (error) {
				callback(error)
			}
			else {
				senderObj.html = parsedBody
				
				this.mailer.sendMail(senderObj, (error, response) => {
					callback(error, response, senderObj)
				})
			}
		})
	}
	else {
		senderObj.html = format == "html" ? body : undefined
		senderObj.text = format == "text" ? body : undefined

		this.mailer.sendMail(senderObj, (error, response) => {
			callback(error, response, senderObj)
		})
	}

}


/**
  * Enforces that given options 
  * has all the keys
  * Raises an error if keys aren't present
  */
Mailer.prototype._enforce = function (options, requiredKeys) {
	if (!options) {
		throw new Error("Parameters for this call are undefined")
	}

	requiredKeys.forEach(function (key) {
		if (!options[key]) {
			throw new Error('Missing required parameter "' + key + '"')
		}
	})
}

module.exports = Mailer