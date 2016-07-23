/*
 * main server file
 */

/*
 * External Dependencies
 */
const morgan = require("morgan")
const fs = require("fs")
const mongoose = require("mongoose")

const config = require("./app/config")

// Location defaults to 127.0.0.1:3000
const PORT = config.PORT || 3000
const HOST = config.HOST || "127.0.0.1"


const app = require("./app")


function listen (port, host) {
	app.listen(port, host, function (error) {
		if (!error) {
			console.log(`Server is listening on ${HOST}:${PORT}`)
		}
		else {
			console.log("Error occured while listening")
			process.exit(1)
		}
	})
}

function mongooseConnect (connection_uri, options, callback) {
	return mongoose.connect(connection_uri, options, callback)
}

var mongooseDB = mongooseConnect(config.MONGODB_CONNECTION_URI, {}, function (error) {
	if (!error) {
		console.log("MongoDB connection established")
		listen(PORT, HOST)
	}
	else {
		console.error(error)
	}
})