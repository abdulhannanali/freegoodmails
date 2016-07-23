const config = require("../../../config")
const validations = require("../validations")

const Email = require("../../../models/Email")

exports.sendMail = function (req, res, next) {
	req.checkBody(validations.validationSchema)

	var errors = req.validationErrors()

	if (errors) {
		return res.json({
			errors: errors
		})
	}

	config.mailer.sendMail(req.body, function (error, response, request) {
		if (error) {
			next(error)
		}
		else {
			createEmailLog(response, request, undefined, function (error, email) {
				if (error) {
					error.additionalData = response
					next(error)
				}
				else if (email) {
					res.json({
						email,
						link: "/api/getEmail/" + email.id  
					})
				}
				else {
					res.json({response, request})
				}
			})
		}
	})
}

exports.getMail = function (req, res, next) {
	if (req.params.id) {
		Email.findOne({_id: req.params.id}, function (error, user) {
			if (error) {
				next()
			}
			else {
				res.json(user)
			}
		})
	}
	else {
		res.json({
			message: "Replace :id in email/:id with email id to retrieve information about it!"
		})
	}
}


/**
  * route handler to get replies for the mail sent by populating it's replies array
  * 
  * 
  */
exports.getMailReplies = function (req, res, next) {
	if (req.params.id) {
		Email.findOne({_id: req.params.id}, 'replies')
		.populate('replies')
		.exec(function (error, email) {
			if (error) {
				next(error)
			}
			else {
				res.json(email)
			}
		})
	}
	else {
		next()
	}
}

/**
  * filterMail
  * filters the emails depending upon the query
  *
  * @params same as the express middleware parameters
  */
exports.getMails = function (req, res, next) {
	var query = {}

	query.emailType = req.query.type || "sent"

	// the limit defaults to 10
	var limit = parseInt(req.query.limit)
	limit = (limit >= 0 && limit <= 20) ? limit : 10

	if (req.query.email) {
		req.sanitizeQuery("email").toEmailsArray()		
		query.recipientEmails = {$elemMatch: {
			email: req.query.email
		}}
	}

	var errors = req.validationErrors()
	
	if (errors) {
		return res.json({
			error: errors
		})
	}

	Email.find(query)
	.limit(limit)
	.exec(function (error, emails) {
		if (error) {
			next(error)
		}
		else {
			res.json(emails)			
		}
	})
}


/*
 * createEmailLog
 * creates an email document for Email collection
 * This log contains the basic information about the emails sent
 */
function createEmailLog (response, request, type="sent", callback) {
	var {
		from,
		subject,
		to
	} = request

	if (request["html"]) {
		var body = request["html"]
		var format = "text"
	}
	else if (request["text"]) {
		var body = request["text"]
		var format = "text"
	}

	if (typeof to == "string") {
		to = to.split(",")
	}


	var email = new Email({
		recipientEmails: to.map(function (email) {return {email: email}}),
		body,
		subject,
		format,
		emailId: response.id
	})

	email.save(function (error) {
		if (error) {
			return callback(error)
		}
		else {
			return callback(undefined, email)
		}
	})
}


// Implement validation controller for passing through quickly and not repeating this logic