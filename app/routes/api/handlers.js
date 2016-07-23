const mongoose = require("mongoose")

exports.notFound = function (req, res, next) {
	res.json({
		statusCode: 404,
		message: "NOT FOUND!"
	})
}

exports.mongooseError = function (error, req, res, next) {
	// Only use this middleware if error is arising from within mongoose
	if (!(error instanceof mongoose.Error)) {
		return next(error)
	}

	return res.status(500).json({
		statusCode: 500,
		data: error.additionalData || {},
		message: "Error occured while saving to database! IF you are sending email you won't be able to receive email for now!",
		errorDetails: error
	})
}

exports.error = function (error, req, res, next) {
	var statusCode = error.statusCode || 500

	console.log(error)

	return res.status(statusCode).json({
		code: statusCode,
		message: "Sorry for inconvenience an internal server error occured"
	})
}